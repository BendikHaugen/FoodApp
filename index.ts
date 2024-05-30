import express from "express";
import { AdminRoute, VandorRoute } from "./routes";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { MONGO_URI } from "./config";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin", AdminRoute);
app.use("/vandor", VandorRoute);

mongoose
  .connect(MONGO_URI)
  .then((result) => console.log("Connected to MongoDB  \n " + result))
  .catch((err) => console.log("Error " + err));

app.listen(8000, () => {
  console.clear();
  console.log("App is listening to port 8000");
});
