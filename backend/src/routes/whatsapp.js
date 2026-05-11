import { Router } from "express";
import { summarise } from "../controllers/whatsapp.js";

const router = Router();

router.post("/summarise", summarise);

export default router;