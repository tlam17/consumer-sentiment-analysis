const express = require("express");
const app = express();
const productsRoutes = require("./routes/productsRoutes");
const reviewsRoutes = require("./routes/reviewsRoutes");
const usersRoutes = require("./routes/usersRoutes");

app.use(express.json());
app.use("/products", productsRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/users", usersRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});