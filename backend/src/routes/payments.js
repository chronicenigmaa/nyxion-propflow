import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import * as ctrl from "../controllers/payments.js";

const router = Router();

router.use(requireAuth);

router.get("/",       ctrl.getAllPayments);
router.get("/:id",    ctrl.getPayment);
router.post("/",      ctrl.createPayment);
router.patch("/:id",  ctrl.updatePayment);

export default router;
