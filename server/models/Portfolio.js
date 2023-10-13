import mongoose from "mongoose";

const portfolioSchema = mongoose.Schema({
  userName: {
    type: String,
    unique: true,
  },
  stocks: [
    {
      symbol: String,
      avgPrice: Number,
      quantity: Number,
    },
  ],
  investment: Number,
  balance: Number,
});

const PortfolioModel = mongoose.model("portfolio", portfolioSchema);
export default PortfolioModel;
