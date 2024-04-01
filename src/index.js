// define express server
const express = require("express");

// import middleware
const middlewareLogRequest = require("./middlewares/logs");

// import routes
const authRoutes = require("./routes/auth");
const rolePermissionRoutes = require("./routes/role-permission");

// running express server
const app = express();

// middleware request
app.use(middlewareLogRequest);

app.use("/auth", authRoutes);
app.use("/role-permission", rolePermissionRoutes);

// runnning at port 4000 on localhost
app.listen(4000, () => {
  console.log("Server berhasil running di port 4000");
});
