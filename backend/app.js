const express = require("express");
const app = express();
const productsRoutes = require("./routes/productsRoutes");

app.use(express.json());
app.use("/products", productsRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});