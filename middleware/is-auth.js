const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const header = req.get("Authorization");

  if (!header) {
    const error = new Error("Unable to find the token");
    error.statusCode = 401;
    throw error;
  }

  const token = header.split(" ")[1];
  let payload;
  
  try {
    payload = jwt.verify(token, "supersecretkey");
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }

  if(!payload){
    const error = new Error("Invalid token");
    error.statusCode = 401;
    throw error;
  }

  next();
};

module.exports = isAuth;
