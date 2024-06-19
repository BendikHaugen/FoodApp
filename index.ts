import express from "express";
import { AdminRoute, VandorRoute } from "./routes";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { MONGO_URI } from "./config";
import path from "path";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/admin", AdminRoute);
app.use("/vandor", VandorRoute);

mongoose
  .connect(MONGO_URI)
  .then((result) =>
    console.log("Connected to MongoDB  \n" + "Host: " + result.connection.host)
  )
  .catch((err) => console.log("Error: " + err));

app.listen(8000, () => {
  console.clear();
  console.log("App is listening to port 8000");
});
