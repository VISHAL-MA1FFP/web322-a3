


// modules/projects.js
require('dotenv').config();
const { Sequelize, DataTypes, Op } = require('sequelize');

// create sequelize instance
const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);


// models
const Sector = sequelize.define('Sector', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  sector_name: DataTypes.STRING
}, { timestamps: false });

const Project = sequelize.define('Project', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: DataTypes.STRING,
  feature_img_url: DataTypes.STRING,
  summary_short: DataTypes.TEXT,
  intro_short: DataTypes.TEXT,
  impact: DataTypes.TEXT,
  original_source_url: DataTypes.STRING,
  sector_id: DataTypes.INTEGER
}, { timestamps: false });

Project.belongsTo(Sector, { foreignKey: 'sector_id', targetKey: 'id' });

// exported functions
module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
  getAllSectors,
  addProject,
  editProject,
  deleteProject
};

function initialize() {
  return new Promise(async (resolve, reject) => {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function getAllProjects() {
  return new Promise(async (resolve, reject) => {
    try {
      const projects = await Project.findAll({ include: [Sector], order: [['id', 'ASC']] });
      resolve(projects.map(p => p.get({ plain: true })));
    } catch (err) {
      reject("Unable to find projects");
    }
  });
}

function getProjectById(projectId) {
  return new Promise(async (resolve, reject) => {
    try {
      const project = await Project.findOne({ where: { id: projectId }, include: [Sector] });
      if (!project) return reject("Project not found");
      resolve(project.get({ plain: true }));
    } catch (err) {
      reject("Unable to find requested project");
    }
  });
}

function getProjectsBySector(sector) {
  return new Promise(async (resolve, reject) => {
    try {
      // try numeric id first
      if (/^\d+$/.test(sector)) {
        const projects = await Project.findAll({
          where: { sector_id: parseInt(sector) },
          include: [Sector]
        });
        if (projects.length === 0) return reject("No projects found");
        return resolve(projects.map(p => p.get({ plain: true })));
      }

      // otherwise search by sector name (case-insensitive)
      const projects = await Project.findAll({
        include: [{
          model: Sector,
          where: { sector_name: { [Op.iLike]: `%${sector}%` } }
        }]
      });

      if (projects.length === 0) return reject("No projects found");
      resolve(projects.map(p => p.get({ plain: true })));
    } catch (err) {
      reject("Unable to find requested projects");
    }
  });
}

function getAllSectors() {
  return new Promise(async (resolve, reject) => {
    try {
      const sectors = await Sector.findAll({ order: [['id', 'ASC']] });
      resolve(sectors.map(s => s.get({ plain: true })));
    } catch (err) {
      reject("Unable to find sectors");
    }
  });
}

function addProject(projectData) {
  return new Promise(async (resolve, reject) => {
    try {
      await Project.create(projectData);
      resolve();
    } catch (err) {
      reject("Unable to create project");
    }
  });
}

function editProject(id, projectData) {
  return new Promise(async (resolve, reject) => {
    try {
      const num = await Project.update(projectData, { where: { id: id } });
      if (num[0] === 0) return reject("No project found to update");
      resolve();
    } catch (err) {
      reject("Unable to update project");
    }
  });
}

function deleteProject(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const num = await Project.destroy({ where: { id: id } });
      if (num === 0) return reject("No project found to delete");
      resolve();
    } catch (err) {
      reject("Unable to delete project");
    }
  });
}

// ====== BULK INSERT FOR ASSIGNMENT 3 ======
const projectData = require("../data/projects.json");
const sectorData = require("../data/sectors.json");

if (require.main === module) {
  (async () => {
    try {
      console.log("Connecting to DB...");
      await sequelize.authenticate();

      console.log("Syncing tables...");
      await sequelize.sync({ force: true });

      console.log("Inserting sectors...");
      await Sector.bulkCreate(sectorData);

      console.log("Inserting projects...");
      await Project.bulkCreate(projectData);

      console.log("Data inserted successfully!");
      process.exit();
    } catch (err) {
      console.error("Bulk insert error:", err);
      process.exit(1);
    }
  })();
}
