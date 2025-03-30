const express = require("express");
const cors = require("cors");
const app = express();
const productsRoutes = require("./routes/productsRoutes");
const reviewsRoutes = require("./routes/reviewsRoutes");
const usersRoutes = require("./routes/usersRoutes");
const sendVerification = require("./routes/sendVerification");

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use("/products", productsRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/users", usersRoutes);
app.use("/send-verification", sendVerification);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});