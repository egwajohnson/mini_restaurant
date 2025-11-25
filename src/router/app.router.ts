import express from "express";
import { AdminAuthContoller } from "../controllers/adminAuthController";
import { MenuController } from "../controllers/menu.controller";
// import { AuthContoller } from "../controllers/auth.controller";
import { AuthControllers } from "../controllers/auths.controller";
import { cartControllers } from "../controllers/cart.controller";
import {
  authMiddleware,
  restaurantMiddleware,
} from "../middleware/authMiddleware";
import {
  adminAuthMiddleware,
  superAdminMiddleware,
} from "../middleware/adminAuthMiddleware";
import { upload } from "../config/multer.config";
import { RestaurantController } from "../controllers/restaurantController";
import { uploadMiddleware } from "../middleware/uploadMiddleware";

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
router.patch(
  "/auth/admin/profile",
  adminAuthMiddleware as any,
  AdminAuthContoller.profile
);

router.patch(
  "/auth/admin/password",
  adminAuthMiddleware as any,
  AdminAuthContoller.changePassword
);
router.post("/auth/admin/forgot-password", AdminAuthContoller.forgotPassword);
router.post("/auth/admin/reset-password", AdminAuthContoller.resetPassword);
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
router.post("/auth/update/user", AuthControllers.updateUser);
router.post("/auth/reset-password", AuthControllers.resetpassword);
router.post("/auth/request-new-otp", AuthControllers.requestNewOtp as any);

// ***********************|| RESTAURANT MANAGT. ||********************************//
router.post(
  "/restaurant/verify-kyc",
  authMiddleware as any,
  restaurantMiddleware as any,
  RestaurantController.kyc
);
router.patch(
  "/restaurant/update",
  authMiddleware as any,
  restaurantMiddleware as any,
  RestaurantController.updateRestaurant
);
router.patch(
  "/restauarant/flagged",
  //adminAuthMiddleware as any,
  //adminAuthMiddleware as any,
  RestaurantController.flagRestaurant
);
router.patch(
  "/restaurant/toggle-status/:restaurantId",
  authMiddleware as any,
  restaurantMiddleware as any,
  RestaurantController.toggleRestaurant
);

// *****************************||MENU MANAGT... ||********************************//
//Menu Items
router.post(
  "/menu",
  authMiddleware as any,
  restaurantMiddleware as any,
  upload.single("images") as any,
  uploadMiddleware as any,
  MenuController.createMenu
);

router.delete(
  "/menu/delete",
  authMiddleware as any,
  restaurantMiddleware as any,
  MenuController.deleteMenu
);

//create cart
router.post("/cart/create", authMiddleware as any, cartControllers.createcart as any);
//update cart
router.patch("/cart/update", authMiddleware as any, cartControllers.updateCart as any);
//get cart
router.get("/cart/get/:ownerId", authMiddleware as any, cartControllers.getCart as any);
export default router;
