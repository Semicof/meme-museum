exports.getAllNft = (req, res) => {
  res.send("Get all Nfts");
};

exports.createNft = (req, res) => {
  res.send("Create Nft");
};

exports.getNftById = (req, res) => {
  res.send(`Get Nft with ID ${req.params.id}`);
};

exports.updateNftById = (req, res) => {
  res.send(`Update Nft with ID ${req.params.id}`);
};

exports.deleteNftById = (req, res) => {
  res.send(`Delete Nft with ID ${req.params.id}`);
};
