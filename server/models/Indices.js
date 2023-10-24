import mongoose from "mongoose";

const indicesSchema = mongoose.Schema({
  name: String,
  symbol: String,
});

const IndicesModel = mongoose.model("Indices", indicesSchema);
export default IndicesModel;
