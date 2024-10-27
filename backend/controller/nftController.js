const Nft = require("../model/Nft");
const User = require("../model/User");

// Create NFT
exports.createNft = async (req, res) => {
  const { name, description, price, imageUrl, metadataUrl } = req.body;
  try {
    const nft = await Nft.create({
      name,
      description,
      price,
      imageUrl,
      metadataUrl,
      owner: req.userId,
    });
    res.status(201).json({ message: "NFT created successfully", nft });
  } catch (error) {
    res.status(500).json({ message: "Error creating NFT", error });
  }
};

// Get NFT by ID
exports.getNftById = async (req, res) => {
  try {
    const nft = await Nft.findById(req.params.id).populate("owner", "name");
    if (!nft) return res.status(404).json({ message: "NFT not found" });

    res.status(200).json(nft);
  } catch (error) {
    res.status(500).json({ message: "Error fetching NFT", error });
  }
};

// Update NFT
exports.updateNft = async (req, res) => {
  const { name, description, price, listedForSale } = req.body;
  try {
    const nft = await Nft.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId }, // Only allow owner to update
      { name, description, price, listedForSale },
      { new: true }
    );

    if (!nft) return res.status(403).json({ message: "Unauthorized or NFT not found" });

    res.status(200).json({ message: "NFT updated successfully", nft });
  } catch (error) {
    res.status(500).json({ message: "Error updating NFT", error });
  }
};

// Delete NFT
exports.deleteNft = async (req, res) => {
  try {
    const nft = await Nft.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!nft) return res.status(403).json({ message: "Unauthorized or NFT not found" });

    res.status(200).json({ message: "NFT deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting NFT", error });
  }
};

// Transfer NFT ownership
exports.transferNft = async (req, res) => {
  const { newOwnerId } = req.body;
  try {
    const nft = await Nft.findById(req.params.id);
    if (!nft) return res.status(404).json({ message: "NFT not found" });
    if (nft.owner.toString() !== req.userId) return res.status(403).json({ message: "Unauthorized" });

    nft.previousOwners.push(nft.owner);
    nft.owner = newOwnerId;
    await nft.save();

    res.status(200).json({ message: "NFT transferred successfully", nft });
  } catch (error) {
    res.status(500).json({ message: "Error transferring NFT", error });
  }
};
