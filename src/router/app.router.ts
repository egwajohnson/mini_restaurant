import express from "express";
import { AdminContoller } from "../controllers/admin.controller";
import { MenuController } from "../controllers/menu.controller";
import { AuthContoller } from "../controllers/auth.controller";

const router = express.Router();

//Admin Auth
router.post("/auth/admin/register", AdminContoller.createAdmin);

//user Auth
router.post("/auth/pre-register", AuthContoller.preReg);
router.post("/auth/register", AuthContoller.register);

//Menu Items
router.post("/menu", MenuController.createMenu);

export default router;
