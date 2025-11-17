import express from "express";
import { AdminAuthContoller } from "../controllers/adminAuthController";
import { MenuController } from "../controllers/menu.controller";
// import { AuthContoller } from "../controllers/auth.controller";
import { AuthControllers } from "../controllers/auths.controller";
import {
  adminMiddleware,
  authMiddleware,
  restaurantMiddleware,
} from "../middleware/authMiddleware";
import {
  adminAuthMiddleware,
  superAdminMiddleware,
} from "../middleware/adminAuthMiddleware";

const router = express.Router();

//************************|| ADMIN MANAGEMENT ||**************************//
//Admin Auth
router.post("/auth/admin/register", AdminAuthContoller.createAdmin);
router.post("/auth/admin/login", AdminAuthContoller.login);
router.patch(
  "/auth/admin/upgrade",
  adminAuthMiddleware as any,
  AdminAuthContoller.upgradeAdmin
);
router.delete(
  "/auth/admin/delete",
  adminAuthMiddleware as any,
  superAdminMiddleware as any,
  AdminAuthContoller.deleteAdmin
);
router.get(
  "/auth/admins",
  adminAuthMiddleware as any,
  superAdminMiddleware as any,
  AdminAuthContoller.getAdmin
);
//************************|| USER MANAGEMENT ||**************************//
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
