import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fileUpload from "express-fileupload";

const app = express();
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Movers & Packers API",
  });
});

import route from "./routes/user.router.js";
import userCatergory from "./routes/category.router.js";
import subCategory from "./routes/subCategoryRoutes.js";
import { createPaymentSession } from "./controller/paymentController.js";
import chatRoutes from "./routes/chatRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import driverRouter from "./routes/driverRouter.js";
import partnerProfileRouter from "./routes/partnerProfileRoutes.js";
import bookingQuoteRouter from "./routes/bookingQuoteRouter.js";
import paymentRoute from "./routes/paymentRoutes.js";
import { stripeWebhook } from "./controller/paymentController.js";

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(fileUpload());
app.post(
  "/payment/webhook",
  express.raw({
    type: "application/json",
  }),

  stripeWebhook,
);

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/all", route);
app.use("/category", userCatergory);
app.use("/subcategory", subCategory);

app.use("/payment", paymentRoute);

// app.post("/payment",createPaymentSession)

app.use("/ai", chatRoutes);

app.use("/api/location", locationRoutes);

app.use("/booking", bookingRoutes);

app.use("/vehicle", vehicleRoutes);

app.use("/driver", driverRouter);

app.use("/partnerprofile", partnerProfileRouter);

app.use("/bookingquotes", bookingQuoteRouter);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(process.env.BACKEND);
});

const shutdown = (signal) => {
  console.log(`\n${signal} received. Closing server...`);

  server.close((err) => {
    if (err) {
      console.error("Error closing server:", err);
      process.exit(1);
    }

    console.log("Server closed successfully.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Server did not close in time, forcing exit.");
    process.exit(1);
  }, 5000);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
