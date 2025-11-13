import dotenv from "dotenv";
dotenv.config({ quiet: true });
import express from "express";
import { PORT } from "./config/system.variable";
import router from "./router/app.router";
import { handleCustomError } from "./middleware/errorHandler";
import { mongoConnection } from "./config/db.connection";

const app = express();
app.use(express.json());
app.use("/api/v1", router);

//error handler
app.use(handleCustomError);

mongoConnection();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
