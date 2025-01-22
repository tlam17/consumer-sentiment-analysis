const express = require("express");
const app = express();
const productsRoutes = require("./routes/productsRoutes");
const reviewsRoutes = require("./routes/reviewsRoutes");

app.use(express.json());
app.use("/products", productsRoutes);
app.use("/reviews", reviewsRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});