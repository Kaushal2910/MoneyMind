const express = require("express");
const router = express.Router();
const controller = require("./budget.controller");
const jwtMiddleware = require("../../middleware/jwt.middleware");

router.use(jwtMiddleware);

router.post("/", controller.createBudget);
router.get("/", controller.getBudgets);
router.put("/:id", controller.updateBudget);
router.delete("/:id", controller.deleteBudget);
router.get("/status", controller.getBudgetStatus);

module.exports = router;
