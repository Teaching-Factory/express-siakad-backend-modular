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
const fakultasRoutes = require("./routes/fakultas");
const prodiRoutes = require("./routes/prodi");
const jabatanRoutes = require("./routes/jabatan");
const unitJabatanRoutes = require("./routes/unit-jabatan");
const ruangPerkuliahanRoutes = require("./routes/ruang-perkuliahan");
const settingGlobalRoutes = require("./routes/setting-global");
const settingWSRoutes = require("./routes/setting-ws");
const identitasPTRoutes = require("./routes/identitas-pt");

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
app.use("/fakultas", fakultasRoutes);
app.use("/prodi", prodiRoutes);
app.use("/jabatan", jabatanRoutes);
app.use("/unit-jabatan", unitJabatanRoutes);
app.use("/ruang-perkuliahan", ruangPerkuliahanRoutes);
app.use("/setting/global", settingGlobalRoutes);
app.use("/setting/ws", settingWSRoutes);
app.use("/setting/identitas-pt", identitasPTRoutes);

// runnning at port 4000 on localhost
app.listen(4000, () => {
  console.log("Server berhasil running di port 4000");
});
