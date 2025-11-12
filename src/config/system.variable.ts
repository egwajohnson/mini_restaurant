import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const dburl = process.env.DB_CONNECTION_URL;
export const jwt_secret = process.env.JWT_SECRET as string;
