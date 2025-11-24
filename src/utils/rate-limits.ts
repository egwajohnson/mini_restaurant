import express  from "express";
import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutesnpm i express-rate-limit
  max: 20, // Limit each IP to 20 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});