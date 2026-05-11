import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import clientRoutes    from "./routes/clients.js";
import unitRoutes      from "./routes/units.js";
import paymentRoutes   from "./routes/payments.js";
import leaseRoutes     from "./routes/leases.js";
import projectRoutes   from "./routes/projects.js";
import whatsappRoutes  from "./routes/whatsapp.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "propflow-api", time: new Date().toISOString() });
});

app.use("/api/clients",   clientRoutes);
app.use("/api/units",     unitRoutes);
app.use("/api/payments",  paymentRoutes);
app.use("/api/leases",    leaseRoutes);
app.use("/api/projects",  projectRoutes);
app.use("/api/whatsapp",  whatsappRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Propflow API running on port ${PORT}`);
});