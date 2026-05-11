import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import * as ctrl from "../controllers/projects.js";

const router = Router();
router.use(requireAuth);

router.get("/",       ctrl.getAllProjects);
router.get("/:id",    ctrl.getProject);
router.post("/",      ctrl.createProject);
router.patch("/:id",  ctrl.updateProject);
router.delete("/:id", ctrl.deleteProject);

export default router;