import express, { Application, static as static_ } from "express";
import {
  AdminRoute,
  VandorRoute,
  ShoppingRoute,
  CustomerRoute,
} from "../routes";
import path from "path";

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/images", static_(path.join(__dirname, "images")));

  app.use("/admin", AdminRoute);
  app.use("/vandor", VandorRoute);
  app.use("/customer", CustomerRoute);
  app.use(ShoppingRoute);
};
