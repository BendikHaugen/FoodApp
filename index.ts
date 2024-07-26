import express from "express";
import Application from "./src/services/ExpressApp";
import dbConnecttion from "./src/services/Database";

const StartServer = async () => {
  const app = express();

  await dbConnecttion();

  await Application(app);

  app.listen(8000, () => {
    console.clear();
    console.log("App is listening to port 8000");
  });
};
