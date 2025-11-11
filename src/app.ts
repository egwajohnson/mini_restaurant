import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { PORT } from './config/system.variable';
import router from "./route/app.route";

const app = express();
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});