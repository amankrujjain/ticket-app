const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoute");
const roleRoute = require("./routes/roleRoute");
const stateRoute = require("./routes/stateRoute");
const cityRoute = require("./routes/cityRoute");
const centreRoute = require("./routes/centreRoute");
const issueRoute = require("./routes/issueRoute");
const reasonRoute = require("./routes/reasonRoute");
const machineRoute = require("./routes/machineRoute");
const ticketRoute = require("./routes/ticketRoute");
const stageRoute = require('./routes/stageRoute');
const changeStageRoute = require('./routes/changeStageRoute');
const userRoute = require('./routes/userRoute')

const path = require("path");
const cors = require("cors");
const helmet = require("helmet");

const dotenv = require("dotenv");

dotenv.config();


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000'];
    if (allowedOrigins.includes(origin) || !origin) {  // Allow if origin is in allowedOrigins or if it's undefined (like from Postman)
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,  // Allow credentials (cookies, etc.)
};

app.use(cors(corsOptions));
app.use(
  cors(corsOptions)
);

//serving the static files
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, "../client/build")));

// Routes
app.get("/check", (req,res)=>{
  res.send("This is health check")
})
app.use("/api", authRoute);
app.use("/api", roleRoute);
app.use("/api", stateRoute);
app.use("/api", cityRoute);
app.use("/api", centreRoute);
app.use("/api", issueRoute);
app.use("/api", reasonRoute);
app.use("/api", machineRoute);
app.use("/api", ticketRoute);
app.use('/api', stageRoute);
app.use('/api', changeStageRoute);
app.use('/api', userRoute)

// Error handling middleware for unhandles errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred",
  });
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_ATLAS_URL || process.env.MONGDB_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
