import mongoose from "mongoose";

const watchlistSchema = mongoose.Schema({
  user: String,
  stocks: [{ name: String, symbol: String }],
});

const WatchlistModel = mongoose.model("watchlist", watchlistSchema);
export default WatchlistModel;
