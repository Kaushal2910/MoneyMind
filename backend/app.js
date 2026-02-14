const express = require('express');
require('dotenv').config();

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./modules/auth/auth.routes');
const expenseRoutes = require("./modules/expenses/expense.routes");
const categoryRoutes = require("./modules/categories/category.routes");
const budgetRoutes = require("./modules/budgets/budget.routes");
const recurringRoutes = require('./modules/recurring/recurring.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');


const errorHandler = require('./middleware/error.middleware');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/health', healthRoutes);
app.use('/auth', authRoutes);

app.use("/api/expenses", expenseRoutes);
app.use("/api/categories", categoryRoutes);

app.use("/api/budgets", budgetRoutes);
app.use("/api/recurring", recurringRoutes);
app.use("/api/notifications", notificationRoutes);
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error middleware (must be last)
app.use(errorHandler);

module.exports = app;
