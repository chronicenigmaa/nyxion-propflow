import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import * as ctrl from "../controllers/units.js";

const router = Router();

router.use(requireAuth);

router.get("/",       ctrl.getAllUnits);
router.get("/:id",    ctrl.getUnit);
router.post("/",      ctrl.createUnit);
router.patch("/:id",  ctrl.updateUnit);
router.delete("/:id", ctrl.deleteUnit);

export default router;
