import { Application, static as static_ } from "express";
import { AdminRoute, VandorRoute, ShoppingRoute } from "../routes";
import bodyParser from "body-parser";
import path from "path";

export default async (app: Application) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/images", static_(path.join(__dirname, "images")));

  app.use("/admin", AdminRoute);
  app.use("/vandor", VandorRoute);
  app.use(ShoppingRoute);
};
