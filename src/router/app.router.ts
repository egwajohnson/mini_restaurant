import express from "express";
import { AdminContoller } from "../controllers/admin.controller";
import { MenuController } from "../controllers/menu.controller";
<<<<<<< HEAD
import { AuthContoller } from "../controllers/auth.controller";
import {
  adminMiddleware,
  authMiddleware,
  restaurantMiddleware,
} from "../middleware/authMiddleware";
=======
import {AuthControllers} from "../controllers/auths.controller";
>>>>>>> 60f70567b48055984c61c043156bb9a9ea3e7032

const router = express.Router();

//Admin Auth
router.post("/auth/admin/register", AdminContoller.createAdmin);

//user Auth
router.post("/auth/pre-register", AuthContoller.preReg);
router.post("/auth/register", AuthContoller.register);
router.post("/auth/login", AuthContoller.login);
router.post("/auth/pre", AuthControllers.preRegister)
router.post("/auth/register", AuthControllers.register);


//Menu Items
router.post(
  "/menu",
  authMiddleware as any,
  restaurantMiddleware as any,
  MenuController.createMenu
);


export default router;
