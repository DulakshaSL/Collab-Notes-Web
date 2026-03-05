import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;