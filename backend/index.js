const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/UserRouter");
const nftRouter = require("./routes/NftRouter");
const reactionRouter = require("./routes/ReactionRouter");
const testRouter = require("./routes/TestRouter")
const connectDB = require("./services/db");

require("dotenv").config();

connectDB();

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const port = 3456;


//api just for testing
app.use("/api/v1/test",testRouter)

app.use("/api/v1/nfts", nftRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/reaction", reactionRouter);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
