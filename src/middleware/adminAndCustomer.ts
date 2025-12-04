import { NextFunction, Request, Response } from "express";
import { nextTick } from "process";
import {
  adminAuthMiddleware,
  IARequest,
  superAdminMiddleware,
} from "./adminAuthMiddleware";
import {
  customerMiddleware,
  IRequest,
  restaurantMiddleware,
} from "./authMiddleware";

export const isAdminOrCustomer = (
  req: IARequest,
  reqs: IRequest,
  res: Response,
  next: NextFunction
) => {
  adminAuthMiddleware(req, res, (err: any) => {
    if (!err) return next();
    customerMiddleware(reqs, res, (err: any) => {
      if (err) {
        res.status(403).send({ message: "Forbidden request" });
      } else {
        next();
      }
    });
  });
};

export const isAdminOrRestaurant = (
  req: IARequest,
  reqs: IRequest,
  res: Response,
  next: NextFunction
) => {
  adminAuthMiddleware(req, res, (err: any) => {
    if (!err) return next();
    restaurantMiddleware(reqs, res, (err: any) => {
      if (err) {
        res.status(403).send({ message: "Forbidden request" });
      } else {
        next();
      }
    });
  });
};
