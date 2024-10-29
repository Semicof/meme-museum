const FormData = require("form-data");
const fetch = require("node-fetch");
const NFT = require("../model/Nft");
const { ethers } = require("ethers");
const { CONTRACT_ADDRESS, ABI } = require("../config");

const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

async function uploadFileToIPFS(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const pinataOptions = JSON.stringify({ cidVersion: 1 });
    formData.append("pinataOptions", pinataOptions);

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: { Authorization: `Bearer ${PINATA_JWT}` },
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload file to IPFS");

    const data = await response.json();
    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

async function uploadMetadataToIPFS(metadata) {
  try {
    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) throw new Error("Failed to upload metadata to IPFS");

    const data = await response.json();
    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading metadata:", error);
    throw error;
  }
}

exports.createNFT = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const userId = req.user.id;

    // Step 1: Upload Image to IPFS
    const imageIPFSLink = await uploadFileToIPFS(req.file);

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
