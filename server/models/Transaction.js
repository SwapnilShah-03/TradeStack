import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
  userName: {
    type: String,
    unique: true,
  },
  trades: [
    {
      tradeType: String,
      symbol: String,
      price: Number,
      quantity: Number,
      amount: Number,
      balance: Number,
      profitLoss: Number,
      date: Date,
    },
  ],
});

const Transactionmodel = mongoose.model("transaction", transactionSchema);
export default Transactionmodel;
