const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
let { port, connectionConfig } = require("./config");
let mysql = require("mysql");
let session = require("express-session");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.locals.session = "gola";

app.engine(
  ".hbs",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    defaultLayout: "main",
    extname: "hbs",
    helpers: {
      user: function () {
        return app.locals.user;
      },
    },
    //for partial directory
    partialsDir: __dirname + "/views/partials",
  })
);

app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.use(
  session({
    secret: "storetime123",
    saveUninitialized: true,
    resave: false,
  })
);

app.use(function (req, res, next) {
  next();
});

const auth = (req, res, next) => {
  if (!req.session.userName) {
    return res.status(401).redirect("/");
  }
  next();
};

app.get("/login", (req, res) => {
  res.render("pages/login");
});

app.post("/login", (req, res, next) => {
  let sql = `select Name from UserLogin where Name='${req.body.username}' AND Password='${req.body.password}'`;
  let result;

  const connection = mysql.createConnection(connectionConfig);

  connection.connect((err) => {
    if (err) throw err;
    console.log("Mysql Connected...");

    connection.query(sql, (err, result) => {
      if (err) throw err;

      if (result.length) {
        req.session.userName = result[0].Name;
        req.app.locals.user = {
          name: req.session.userName,
          exist: true,
        };

        return res.redirect("/users");
      }

      res.redirect("/login");
    });
  });
});

app.get("/logout", auth, (req, res) => {
  req.session.destroy();
  req.app.locals.user = null;
  res.redirect("/");
});

app.post("/registry", (req, res) => {
  user = req.body;
  let userTypeID = parseInt(user.usertype);

  const connection = mysql.createConnection(connectionConfig);

  let sql = `INSERT INTO Users(Name, Email, Phone, UserTypeID)  VALUES ('${user.name}', '${user.email}','${user.phone}',${userTypeID} )`;
  connection.connect((err) => {
    if (err) throw err;
    console.log("Mysql Connected...");

    connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log("1 record inserted");
      res.render("pages/registry", { body: req.body });
    });
  });
});

app.get("/users", auth, (req, res) => {
  var sql = `select users.*, UserType.Name as userType from users inner join UserType on users.ID=UserType.ID`;

  const connection = mysql.createConnection(connectionConfig);

  connection.connect((err) => {
    if (err) throw err;
    console.log("Mysql Connected...");

    connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.render("pages/users", {
        users: result,
      });
    });
  });
});

app.listen(port, () => console.log("listening"));
