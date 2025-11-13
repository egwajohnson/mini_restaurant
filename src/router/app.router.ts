import express from "express";
import { AdminContoller } from "../controllers/admin.controller";
import { MenuController } from "../controllers/menu.controller";

const router = express.Router();

//Admin Auth
router.post("/admin/register", AdminContoller.createAdmin);

//Menu Items
router.post("/menu", MenuController.createMenu);

export default router;
