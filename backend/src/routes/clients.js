import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import * as ctrl from "../controllers/clients.js";

const router = Router();

router.use(requireAuth); // all client routes require login

router.get("/",       ctrl.getAllClients);
router.get("/:id",    ctrl.getClient);
router.post("/",      ctrl.createClient);
router.patch("/:id",  ctrl.updateClient);
router.delete("/:id", ctrl.deleteClient);

export default router;
