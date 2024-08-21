const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")

const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser())


const authRoute = require("./routes/authRoute");
app.use("/api", authRoute);

const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("Mongo DB connected")
}).catch((error)=>{
    console.log("MongoDB connection error:", error)
});


app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})