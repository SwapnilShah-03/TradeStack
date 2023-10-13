import mongoose from "mongoose";

const stockSchema = mongoose.Schema({
  name: String,
  symbol: String,
});

const StockModel = mongoose.model("Stocks", stockSchema);
export default StockModel;
