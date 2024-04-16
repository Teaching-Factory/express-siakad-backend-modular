function errHandler(err, req, res, next) {
  let errors = [];
  statusCode = 500;

  console.log(err, "<----- Kesalahan pada Error Handler");

  switch (err.name) {
    case "SequelizeValidationError":
      err.errors.forEach((el) => {
        errors.push(el.message);
      });
      statusCode = 400;
      break;
    default:
      errors.push(err.message || "Internal Server Error");
      statusCode = err.statusCode || 500;
  }
  res.status(statusCode).json({
    status: "Validation Error",
    errors: errors,
  });
}

module.exports = errHandler;
