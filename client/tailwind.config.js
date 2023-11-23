const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Inter: ["Inter", "sans-serif"],
        Outfit: ["Outfit", "sans-serif"],
        Poppins: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        home: "url('../src/assets/images/background.jpg')",
        purchase: "url('../src/assets/images/purchase.jpg')",
        portfolio: "url('../src/assets/images/portfolio.jpg')",
        market: "url('../src/assets/images/market.jpg')",
        dashboard: "url('../src/assets/images/dashboard.jpg')",
        news: "url('../src/assets/images/news.jpg')",
        transactions: "url('../src/assets/images/transactions.jpg')",
        watchlist: "url('../src/assets/images/watchlist.jpg')",
        stock: "url('../src/assets/images/stock.jpg')",
        home: "url('../src/assets/images/home.jpg')",
        a: "url('../src/assets/images/a.jpg')",
        b: "url('../src/assets/images/b.jpg')",
        c: "url('../src/assets/images/c.jpg')",
        d: "url('../src/assets/images/d.jpg')",
        e: "url('../src/assets/images/e.jpg')",
        f: "url('../src/assets/images/f.jpg')",
        g: "url('../src/assets/images/g.jpg')",
        h: "url('../src/assets/images/h.jpg')",
        i: "url('../src/assets/images/i.jpg')",
      },
    },
  },
  plugins: [],
});
