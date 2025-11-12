import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { PORT } from "./config/system.variable";
import router from "./router/app.router";
import { handleCustomError } from "./middleware/errorHandler";

const app = express();
app.use(express.json());
app.use(router);

//error handler
app.use(handleCustomError);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
