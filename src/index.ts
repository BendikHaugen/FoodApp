import express from "express";
import Application from "./services/ExpressApp";
import dbConnecttion from "./services/Database";
import { PORT } from "./config";

const StartServer = async () => {
  try {
    console.log("Starting server");
    const app = express();
    console.log("Connecting to database");
    await dbConnecttion();
    console.log("Starting application");
    await Application(app);

    app.listen(8000, () => {
      console.clear();
      console.log(`App is listening to port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error);
  }
};
