import "dotenv/config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ApiError } from "./utils/errors.js";

import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categories.js";
import expenseRoutes from "./routes/expenses.js";
import incomeRoutes from "./routes/incomes.js";
import summaryRoutes from "./routes/summary.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => res.json({ ok: true, name: "Expense API" }));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/summary", summaryRoutes);

// 404
app.use((_req, _res, next) => next(new ApiError(404, "Not found")));

// error handler
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Server error";
  if (status >= 500) console.error(err);
  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
