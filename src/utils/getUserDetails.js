const jwt = require("jsonwebtoken");

module.exports = getUserDetails = async (token) => {
  let verified = jwt.verify(token, process.env.TOKEN, function (err, decoded) {
    console.log("👉 err", err);
    if (err.message === "jwt expired") return false;
    let details = {
      email: verified.user.email,
      handle: verified.user.handle,
      id: verified.user._id,
    };
    return details;
  });
  return verified;
};
