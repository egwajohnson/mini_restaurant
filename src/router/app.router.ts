import express from "express";
import { AdminContoller } from "../controllers/admin.controller";
import { MenuController } from "../controllers/menu.controller";
import {AuthControllers} from "../controllers/auths.controller";

const router = express.Router();

//Admin Auth
router.post("/auth/admin/register", AdminContoller.createAdmin);

//user Auth
router.post("/auth/pre", AuthControllers.preRegister)
router.post("/auth/register", AuthControllers.register);


//Menu Items
router.post("/menu", MenuController.createMenu);


export default router;
