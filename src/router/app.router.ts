import express from "express";
import { AdminContoller } from "../controllers/admin.controller";
import { MenuController } from "../controllers/menu.controller";
// import { AuthContoller } from "../controllers/auth.controller";
import {AuthControllers} from "../controllers/auths.controller";
import {adminMiddleware,authMiddleware,restaurantMiddleware} from "../middleware/authMiddleware";

const router = express.Router();

//Admin Auth
router.post("/auth/admin/register", AdminContoller.createAdmin);

//user Auth
router.post("/auth/pre-register", AuthControllers.preRegister as any);
router.post("/auth/register", AuthControllers.register);
router.post("/auth/login", AuthControllers.login);


//Menu Items
router.post(
  "/menu",
  authMiddleware as any,
  restaurantMiddleware as any,
  MenuController.createMenu
);


export default router;
