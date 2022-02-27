const jwt = require("jsonwebtoken");

module.exports = getUserDetails = (token) => {
  let decoded = jwt.verify(token, process.env.TOKEN);
  let details = {
    email: decoded.user.email,
    handle: decoded.user.handle,
    id: decoded.user._id,
  };
  return details;
};
