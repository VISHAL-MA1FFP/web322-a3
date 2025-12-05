

// // server.js
// // /********************************************************************************
// // * WEB322 – Assignment 3 (continuation of Assignment 2)
// // * Name: __vishal sharma__   Student ID: __189273238__
// // ********************************************************************************/

// require('dotenv').config();
// const express = require("express");
// const path = require("path");
// const clientSessions = require("client-sessions");

// const app = express();
// const PORT = process.env.PORT || 8080;

// const {
//   initialize,
//   getAllProjects,
//   getProjectsBySector,
//   getProjectById,
//   getAllSectors,
//   addProject,
//   editProject,
//   deleteProject
// } = require("./modules/projects");

// app.use(express.static(path.join(__dirname, "public")));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // parse form data
// app.use(express.urlencoded({ extended: true }));

// // client-sessions middleware
// app.use(clientSessions({
//   cookieName: "session",
//   secret: process.env.SESSIONSECRET || "default_secret_change_me",
//   duration: 24 * 60 * 60 * 1000,       // 1 day
//   activeDuration: 1000 * 60 * 5        // extend by 5 minutes on activity
// }));

// // Make session available in all views
// app.use((req, res, next) => {
//   res.locals.session = req.session;
//   next();
// });

// // Provide sectors for navbar etc (reuse from assignment 2)
// app.use(async (req, res, next) => {
//   try {
//     res.locals.sectors = await getAllSectors();  // [{id, sector_name}, ...]
//   } catch {
//     res.locals.sectors = [];
//   }
//   next();
// });
// app.use((req, res, next) => {
//   res.locals.page = req.path;   // makes "page" available to every EJS file
//   next();
// });


// // ensure user logged in
// function ensureLogin(req, res, next) {
//   if (!req.session.user) {
//     return res.redirect('/login');
//   }
//   next();
// }

// // initialize DB and start server
// initialize().then(() => {

//   // Home & About (unchanged)
//   app.get("/", (req, res) => {
//     res.render("home", { page: "/", title: "Home" });
//   });

//   app.get("/about", (req, res) => {
//     res.render("about", { page: "/about", title: "About Us" });
//   });

//   // Projects listing (supports ?sector=)
//   app.get("/solutions/projects", async (req, res) => {
//     try {
//       const { sector } = req.query;
//       const projects = sector
//         ? await getProjectsBySector(sector)
//         : await getAllProjects();
//       res.render("projects", { page: "/projects", title: "Projects", projects });
//     } catch {
//       res.render("projects", { page: "/projects", title: "Projects", projects: [] });
//     }
//   });

//   // Single project
//   app.get("/solutions/project/:id", async (req, res) => {
//     try {
//       const project = await getProjectById(req.params.id);
//       res.render("project", { page: "/project", title: project.title, project });
//     } catch {
//       res.status(404).render("404", { title: "Not Found" });
//     }
//   });

//   // ========== New: Add Project ==========
//   app.get("/solutions/addProject", ensureLogin, async (req, res) => {
//     try {
//       const sectors = await getAllSectors();
//       res.render("addProject", { title: "Add Project", sectors });
//     } catch (err) {
//       res.render("500", { message: err });
//     }
//   });

//   app.post("/solutions/addProject", ensureLogin, async (req, res) => {
//     try {
//       const projectData = {
//         title: req.body.title,
//         feature_img_url: req.body.feature_img_url,
//         sector_id: parseInt(req.body.sector_id) || null,
//         intro_short: req.body.intro_short,
//         summary_short: req.body.summary_short,
//         impact: req.body.impact,
//         original_source_url: req.body.original_source_url
//       };
//       await addProject(projectData);
//       res.redirect("/solutions/projects");
//     } catch (err) {
//       res.render("500", { message: err });
//     }
//   });

//   // ========== New: Edit Project ==========
//   app.get("/solutions/editProject/:id", ensureLogin, async (req, res) => {
//     try {
//       const project = await getProjectById(req.params.id);
//       const sectors = await getAllSectors();
//       res.render("editProject", { title: "Edit Project", project, sectors });
//     } catch (err) {
//       res.status(404).render("404", { title: "Not Found" });
//     }
//   });

//   app.post("/solutions/editProject", ensureLogin, async (req, res) => {
//     try {
//       const id = req.body.id;
//       const projectData = {
//         title: req.body.title,
//         feature_img_url: req.body.feature_img_url,
//         sector_id: parseInt(req.body.sector_id) || null,
//         intro_short: req.body.intro_short,
//         summary_short: req.body.summary_short,
//         impact: req.body.impact,
//         original_source_url: req.body.original_source_url
//       };
//       await editProject(id, projectData);
//       res.redirect("/solutions/projects");
//     } catch (err) {
//       res.render("500", { message: err });
//     }
//   });

//   // ========== New: Delete Project ==========
//   app.get("/solutions/deleteProject/:id", ensureLogin, async (req, res) => {
//     try {
//       await deleteProject(req.params.id);
//       res.redirect("/solutions/projects");
//     } catch (err) {
//       res.render("500", { message: err });
//     }
//   });

//   // ========== Login / Logout ==========
//   app.get("/login", (req, res) => {
//     res.render("login", { errorMessage: "", userName: "" });
//   });

//   app.post("/login", (req, res) => {
//     const { userName, password } = req.body;
//     if (userName === process.env.ADMINUSER && password === process.env.ADMINPASSWORD) {
//       req.session.user = { userName: userName };
//       res.redirect("/solutions/projects");
//     } else {
//       res.render("login", { errorMessage: "Invalid User Name or Password", userName });
//     }
//   });

//   app.get("/logout", (req, res) => {
//     req.session.reset();
//     res.redirect("/");
//   });

//   // 404
//   app.use((req, res) => {
//     res.status(404).render("404", { title: "Page Not Found" });
//   });

//   // start listening
//   app.listen(PORT, () => console.log(`Server running → http://localhost:${PORT}`));
// }).catch((err) => {
//   console.error("Error initializing projects:", err);
// });


// server.js
// /********************************************************************************
// * WEB322 – Assignment 3 (continuation of Assignment 2)
// * Name: __vishal sharma__   Student ID: __189273238__
// ********************************************************************************/

require('dotenv').config();
const express = require("express");
const path = require("path");
const clientSessions = require("client-sessions");

const app = express();
const PORT = process.env.PORT || 8080;

const {
  initialize,
  getAllProjects,
  getProjectsBySector,
  getProjectById,
  getAllSectors,
  addProject,
  editProject,
  deleteProject
} = require("./modules/projects");

// Static files
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// client-sessions
app.use(clientSessions({
  cookieName: "session",
  secret: process.env.SESSIONSECRET || "default_secret_change_me",
  duration: 24 * 60 * 60 * 1000, 
  activeDuration: 1000 * 60 * 5
}));

// Make session available in EJS
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Provide sectors to navbar
app.use(async (req, res, next) => {
  try {
    res.locals.sectors = await getAllSectors();
  } catch {
    res.locals.sectors = [];
  }
  next();
});

// Current page path for navbar highlighting
app.use((req, res, next) => {
  res.locals.page = req.path;
  next();
});

// Ensure login
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

// Initialize DB then start server
initialize().then(() => {

  // HOME
  app.get("/", (req, res) => {
    res.render("home", { title: "Home", page: "/" });
  });

  // ABOUT
  app.get("/about", (req, res) => {
    res.render("about", { title: "About Us", page: "/about" });
  });

  // PROJECTS LIST
  app.get("/solutions/projects", async (req, res) => {
    try {
      const { sector } = req.query;
      const projects = sector
        ? await getProjectsBySector(sector)
        : await getAllProjects();

      res.render("projects", {
        title: "Projects",
        page: "/projects",
        projects
      });
    } catch {
      res.render("projects", {
        title: "Projects",
        page: "/projects",
        projects: []
      });
    }
  });

  // SINGLE PROJECT
  app.get("/solutions/project/:id", async (req, res) => {
    try {
      const project = await getProjectById(req.params.id);

      res.render("project", {
        title: project.title,
        page: "/project",
        project
      });
    } catch {
      res.status(404).render("404", { title: "Not Found" });
    }
  });

  // ADD PROJECT (admin only)
  app.get("/solutions/addProject", ensureLogin, async (req, res) => {
    try {
      const sectors = await getAllSectors();
      res.render("addProject", {
        title: "Add Project",
        page: "/addProject",
        sectors
      });
    } catch (err) {
      res.render("500", { title: "Error", message: err });
    }
  });

  app.post("/solutions/addProject", ensureLogin, async (req, res) => {
    try {
      await addProject({
        title: req.body.title,
        feature_img_url: req.body.feature_img_url,
        sector_id: parseInt(req.body.sector_id),
        intro_short: req.body.intro_short,
        summary_short: req.body.summary_short,
        impact: req.body.impact,
        original_source_url: req.body.original_source_url
      });

      res.redirect("/solutions/projects");
    } catch (err) {
      res.render("500", { title: "Error", message: err });
    }
  });

  // EDIT PROJECT
  app.get("/solutions/editProject/:id", ensureLogin, async (req, res) => {
    try {
      const project = await getProjectById(req.params.id);
      const sectors = await getAllSectors();

      res.render("editProject", {
        title: "Edit Project",
        page: "/editProject",
        project,
        sectors
      });
    } catch {
      res.status(404).render("404", { title: "Not Found" });
    }
  });

  app.post("/solutions/editProject", ensureLogin, async (req, res) => {
    try {
      await editProject(req.body.id, {
        title: req.body.title,
        feature_img_url: req.body.feature_img_url,
        sector_id: parseInt(req.body.sector_id),
        intro_short: req.body.intro_short,
        summary_short: req.body.summary_short,
        impact: req.body.impact,
        original_source_url: req.body.original_source_url
      });

      res.redirect("/solutions/projects");
    } catch (err) {
      res.render("500", { title: "Error", message: err });
    }
  });

  // DELETE PROJECT
  app.get("/solutions/deleteProject/:id", ensureLogin, async (req, res) => {
    try {
      await deleteProject(req.params.id);
      res.redirect("/solutions/projects");
    } catch (err) {
      res.render("500", { title: "Error", message: err });
    }
  });

  // LOGIN PAGE
  app.get("/login", (req, res) => {
    res.render("login", {
      title: "Admin Login",
      page: "/login",
      errorMessage: "",
      userName: ""
    });
  });

  // LOGIN ACTION
  app.post("/login", (req, res) => {
    const { userName, password } = req.body;

    console.log("FORM USER:", userName);
    console.log("FORM PASS:", password);
    console.log("ENV USER:", process.env.ADMINUSER);
    console.log("ENV PASS:", process.env.ADMINPASSWORD);

    if (userName === process.env.ADMINUSER &&
        password === process.env.ADMINPASSWORD) {

      req.session.user = { userName };
      return res.redirect("/solutions/projects");
    }

    res.render("login", {
      title: "Admin Login",
      page: "/login",
      errorMessage: "Invalid User Name or Password",
      userName
    });
  });

  // LOGOUT
  app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/");
  });

  // 404 PAGE
  app.use((req, res) => {
    res.status(404).render("404", { title: "Page Not Found" });
  });

  // Start server
  app.listen(PORT, () =>
    console.log(`Server running → http://localhost:${PORT}`)
  );

}).catch(err => {
  console.error("Error initializing projects:", err);
});
