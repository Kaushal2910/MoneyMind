const express = require("express");
const router = express.Router();
const controller = require("./category.controller");
const jwtMiddleware = require("../../middleware/jwt.middleware");

router.use(jwtMiddleware);

router.post("/", controller.createCategory);
router.get("/", controller.getCategories);
router.put("/:id", controller.updateCategory);
router.delete("/:id", controller.deleteCategory);

module.exports = router;
