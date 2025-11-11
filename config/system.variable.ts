import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT
export const dburl = process.env.DB_CONNECTION_URL