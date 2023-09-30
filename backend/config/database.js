import Sequelize from "sequelize";

const db = new Sequelize("project_iot", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
