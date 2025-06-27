require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/db");
const connectCloudinary = require("./config/cloudinary");
const adminRouter = require("./routes/adminRoute");
const doctorRouter = require("./routes/doctorRoute");
const userRouter = require("./routes/userRoute");

//app config
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cors());

connectDB();
connectCloudinary();

//api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
