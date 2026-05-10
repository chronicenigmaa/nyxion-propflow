import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import * as ctrl from "../controllers/leases.js";

const router = Router();

router.use(requireAuth);

router.get("/",       ctrl.getAllLeases);
router.get("/:id",    ctrl.getLease);
router.post("/",      ctrl.createLease);
router.patch("/:id",  ctrl.updateLease);

export default router;
