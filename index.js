const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")
const authRoute = require("./routes/authRoute");
const roleRoute = require("./routes/roleRoute");
const stateRoute = require("./routes/stateRoute");
const cityRoute = require("./routes/cityRoute");
const centreRoute = require("./routes/centreRoute");

const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser())

// Routes
app.use("/api", authRoute);
app.use("/api", roleRoute);
app.use("/api", stateRoute);
app.use("/api", cityRoute);
app.use("/api", centreRoute);



const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("Mongo DB connected")
}).catch((error)=>{
    console.log("MongoDB connection :", error)
});


app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})