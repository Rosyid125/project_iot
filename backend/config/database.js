import Sequelize from "sequelize";

const db = new Sequelize("project_iot", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: () => {},
});

export default db;
