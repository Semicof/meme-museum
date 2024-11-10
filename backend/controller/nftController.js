const axios = require("axios");
const FormData = require("form-data");
const NFT = require("../model/Nft");
const { ethers } = require("ethers");
const { CONTRACT_ADDRESS, ABI } = require("../config");

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

async function uploadFileToIPFS(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const pinataOptions = JSON.stringify({ cidVersion: 1 });
    formData.append("pinataOptions", pinataOptions);

    const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${PINATA_JWT}`
      }
    });

    if (!response.data) throw new Error("Failed to upload file to IPFS");

    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

async function uploadMetadataToIPFS(metadata) {
  try {
    const response = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PINATA_JWT}`
      }
    });

    if (!response.data) throw new Error("Failed to upload metadata to IPFS");

    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading metadata:", error);
    throw error;
  }
}


exports.createNFT = async (req, res) => {
  try {
    const { name, description, price, file } = req.body;
    const userId = req.user.id;

    // Step 1: Upload Image to IPFS
    const imageIPFSLink = await uploadFileToIPFS(file);

    // Step 2: Create Metadata and Upload to IPFS
    const metadata = {
      name,
      description,
      image: imageIPFSLink,
      attributes: [{ trait_type: "Price", value: price }],
    };
    const metadataIPFSLink = await uploadMetadataToIPFS(metadata);

    // Step 3: Mint NFT on blockchain with metadata URI
    const tx = await contract.createToken(metadataIPFSLink, ethers.utils.parseEther(price));
    const txReceipt = await tx.wait();
    const tokenId = txReceipt.events[0].args.tokenId.toString();

    // Step 4: Save NFT to database
    const newNFT = new NFT({
      name,
      description,
      price,
      owner: userId,
      tokenURI: metadataIPFSLink,
      tokenId,
    });
    await newNFT.save();

    // Step 5: Return response
    res.status(201).json({
      message: "NFT created successfully",
      nft: newNFT,
    });
  } catch (error) {
    console.error("Error creating NFT:", error);
    res.status(500).json({ message: "Error creating NFT", error });
  }
};

exports.getAllNFTs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const nfts = await NFT.find()
      .populate("owner", "name") // Populate owner field
      .skip(skip)
      .limit(limit)
      .exec();

    const totalNFTs = await NFT.countDocuments();

    res.status(200).json({
      total: totalNFTs,
      page,
      pages: Math.ceil(totalNFTs / limit),
      nfts,
    });
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    res.status(500).json({ message: "Error fetching NFTs", error });
  }
};

exports.getNFTById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch NFT details from the database by ID
    const nft = await NFT.findById(id)
      .populate("owner", "username") // Populate the owner's username field
      .exec();

    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }

    // Return NFT details
    res.status(200).json({
      message: "NFT fetched successfully",
      nft,
    });
  } catch (error) {
    console.error("Error fetching NFT:", error);
    res.status(500).json({ message: "Error fetching NFT", error });
  }
};

exports.listNFTForSale = async (req, res) => {
  try {
    const { tokenId, price } = req.body;
    const userId = req.user.id;

    const nft = await NFT.findOne({ tokenId, owner: userId });
    if (!nft) {
      return res.status(404).json({ message: "NFT not found or you do not own it" });
    }

    const tx = await contract.reSellToken(tokenId, ethers.utils.parseEther(price), {
      value: ethers.utils.parseEther(process.env.LISTING_PRICE),
    });
    await tx.wait();

    nft.price = price;
    nft.owner = process.env.MARKETPLACE_ADDRESS;
    await nft.save();

    res.status(200).json({ message: "NFT listed for sale", nft });
  } catch (error) {
    console.error("Error listing NFT for sale:", error);
    res.status(500).json({ message: "Error listing NFT for sale", error });
  }
};

exports.purchaseNFT = async (req, res) => {
  try {
    const { tokenId } = req.body;
    const buyerId = req.user.id;

    const nft = await NFT.findOne({ tokenId, owner: process.env.MARKETPLACE_ADDRESS });
    if (!nft) {
      return res.status(404).json({ message: "NFT not found or not available for sale" });
    }

    const price = ethers.utils.parseEther(nft.price.toString());
    const tx = await contract.createMarketSale(tokenId, {
      value: price,
    });
    await tx.wait();

    nft.owner = buyerId;
    nft.sold = true;
    await nft.save();

    res.status(200).json({ message: "NFT purchased successfully", nft });
  } catch (error) {
    console.error("Error purchasing NFT:", error);
    res.status(500).json({ message: "Error purchasing NFT", error });
  }
};

