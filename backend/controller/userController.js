exports.getAllUser = (req, res) => {
  res.send("Get all users");
};

exports.createUser = (req, res) => {
  res.send("Create User");
};

exports.getUserById = (req, res) => {
  res.send(`Get User with ID ${req.params.id}`);
};

exports.updateUserById = (req, res) => {
  res.send(`Update User with ID ${req.params.id}`);
};

exports.deleteUserById = (req, res) => {
  res.send(`Delete User with ID ${req.params.id}`);
};
