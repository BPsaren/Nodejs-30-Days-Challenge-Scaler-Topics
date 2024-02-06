const express=require('express');
const app= express();

/**
 * Handles GET requests to "/greet" endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function greetHandler(req, res) {
    // Your implementation here

     const {name}=req.query;
     if(name){
        res.send(`hello ${name}`);
     }else{
        res.send("hello guest!");
     }    
  }
  app.get("/greet",greetHandler);

  const port = 3000;
app.listen(port, () => {
    console.log("Listening on port " + port);
});