// External modules
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require('path')


// Local modules
const productRouter = require("./routers/productRouter");
const errorMiddleWare = require("./middleware/Error");
const userRouter = require("./routers/userRouter");
const orderRouter = require("./routers/orderRouter");
const paymentRouter = require("./routers/paymentRouter");

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use("/api/v1/", productRouter);
app.use("/api/v1/", userRouter);
app.use("/api/v1/", orderRouter);
app.use("/api/v1/", paymentRouter);


// Serve static files
app.use(express.static(path.join(__dirname,"../FrontEnd/dist")))
app.use((req,res,next)=>{
  if(req.method === "GET" && !req.path.startsWith("/api")){
 res.sendFile(path.resolve(__dirname, "../FrontEnd/dist/index.html"));
  }else{
    next()
  }
})
// Error middleware
app.use(errorMiddleWare);

module.exports = app;
