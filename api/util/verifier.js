exports.verify = (req, res, next) => {
  const verify_token = process.env.VERIFICATION_TOKEN;
  if (req.body.token === verify_token) {
    next();
  } else {
    res.send("Invalid Token");
  }
};
