import express from "express";
import { AdminContoller } from "../controllers/admin.controller";
import { MenuController } from "../controllers/menu.controller";
import {AuthControllers} from "../controllers/user.controller";

const router = express.Router();

//Admin Auth
router.post("/auth/admin/register", AdminContoller.createAdmin);

//user Auth
router.post("/auth/pre", AuthControllers.preRegister)


//Menu Items
router.post("/menu", MenuController.createMenu);


export default router;
