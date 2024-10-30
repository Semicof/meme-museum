const express = require("express");
const router = express.Router();

router.get("/",(req, res) => {
    res.status(200).json({ message: 'Test get route working!' });
})

router.post("/post/:id",(req, res) => {
    const params = req.params;
    const body = req.body;
  
    console.log('Params:', params);
    console.log('Body:', body); 
  
    res.status(200).json({
      message: 'Request received!',
      receivedParams: params,
      receivedBody: body
    });
  })

module.exports = router;
