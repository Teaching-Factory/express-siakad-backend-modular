// define express server
const express = require("express");

// import middleware
const middlewareLogRequest = require("./middlewares/logs");

// import routes
const authRoutes = require("./routes/auth");
const rolePermissionRoutes = require("./routes/role-permission");
const periodeRoutes = require("./routes/periode");
const userRoutes = require("./routes/user");
const agamaRoutes = require("./routes/agama");
const wilayahRoutes = require("./routes/wilayah");
const angkatanRoutes = require("./routes/angkatan");

// running express server
const app = express();

// middleware request
app.use(middlewareLogRequest);

app.use("/auth", authRoutes);
app.use("/role-permission", rolePermissionRoutes);
app.use("/periode", periodeRoutes);
app.use("/user", userRoutes);
app.use("/agama", agamaRoutes);
app.use("/wilayah", wilayahRoutes);
app.use("/angkatan", angkatanRoutes);

// runnning at port 4000 on localhost
app.listen(4000, () => {
  console.log("Server berhasil running di port 4000");
});
