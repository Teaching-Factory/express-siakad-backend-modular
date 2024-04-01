// define express server
const express = require("express");
const app = express();

// import routes
const usersRoutes = require("./routes/users");

app.use("/users", usersRoutes);

// runnning at port 4000 on localhost
app.listen(4000, () => {
  console.log("Server berhasil running di port 4000");
});
