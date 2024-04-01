const logRequest = (req, res, next) => {
  console.log("Client melakukan request ke PATH: ", req.path);
  next();
};

module.exports = logRequest;
