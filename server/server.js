import express from "express";
import { PORT, NODE_ENV } from "./config/env.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import connectToDb from "./config/database.js";
import router from "./routes/routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send(`Caremind server is running on ${PORT} in ${NODE_ENV} env`);
});

app.use('/api/v1', router);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Caremind server is running on ${PORT} in ${NODE_ENV} env`);
  connectToDb();
});