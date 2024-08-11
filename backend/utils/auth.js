const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: 3 * 24 * 60 * 60} );
}

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("Token", token);
  if(token)
  {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken)=> {
          if(err)
          {
              console.log(err.message)
              res.status(401).json({message: "Invalid email or password!"});
          }
          else
          {
              console.log(decodedToken)
              next()
          }
      })
  }
  else{
      res.status(400).json({message: "Invalid token!"});
  }
}

module.exports = { createToken, requireAuth};
