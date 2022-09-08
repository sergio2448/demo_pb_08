const express = require("express");
const productRoutes = require("./products/products.routes");
const usersRoutes = require("./users/users.routes");

const router = express.Router();

router.use("/products", productRoutes);
router.use("/users", usersRoutes);

module.exports = router;
