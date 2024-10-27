const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/UserRouter");
const nftRouter = require("./routes/NftRouter");
const connectDB = require("./services/db");
const User = require("./model/User");
const Nft = require("./model/Nft");
require("dotenv").config();

connectDB();

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const port = 3000;

app.use("/api/v1/nfts", nftRouter);
app.use("/api/v1/user", userRouter);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
