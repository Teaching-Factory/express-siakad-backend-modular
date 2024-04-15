const dbPool = require("../config/database");

const getAllRoles = () => {
  const SQLQuery = "SELECT * FROM roles";

  return dbPool.execute(SQLQuery);
};

module.exports = {
  getAllRoles,
};
