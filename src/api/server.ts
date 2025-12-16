import express from "express";
import routes from "./routes";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(routes);

app.listen(3000, () => {
  console.log("🌐 API running on port 3000");
});
