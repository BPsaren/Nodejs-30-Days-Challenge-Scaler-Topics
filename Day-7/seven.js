const express=require('express');
const app= express();


/**
 * Express middleware to log incoming requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function requestLoggerMiddleware(req, res, next) {
    // Your implementation here
    const timestamp = new Date().toString();
    const method = req.method;
    console.log(`${timestamp}-${method}request received`);
    next();
  }

  app.use(requestLoggerMiddleware);
  app.get("/",(req,res)=>{
    console.log("Hello world!")
  })
  const port = 3000;
app.listen(port, () => {
    console.log(`server is running at ${port}`);
});