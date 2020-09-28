const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
let { port, connectionConfig } = require("./config");
let mysql = require("mysql");
let session = require("express-session");
const { user } = require("./DBconnection");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.engine(
  ".hbs",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    defaultLayout: "main",
    extname: "hbs",
    helpers: {
      //  user: function () {
      // return;
      // },
    },
    //for partial directory
    partialsDir: __dirname + "/views/partials",
  })
);

app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

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
  res.render("pages/login", {
    user:
      req.session && req.session.userName
        ? { name: req.session.userName, exist: true }
        : {},
  });
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
        res.locals.user = {
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
  res.locals.user = null;
  res.redirect("/");
});

app.post("/registry", (req, res) => {
  let user = req.body;
  let userTypeID = parseInt(user.usertype);

  const connection = mysql.createConnection(connectionConfig);

  let sql = `INSERT INTO Users(Name, Email, Phone, UserTypeID)  VALUES ('${user.name}', '${user.email}','${user.phone}',${userTypeID} )`;
  connection.connect((err) => {
    if (err) throw err;
    console.log("Mysql Connected...");

    connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log("1 record inserted");
      res.render("pages/registry", {
        body: req.body,
        user:
          req.session && req.session.userName
            ? { name: req.session.userName, exist: true }
            : {},
      });
    });
  });
});

app.get("/users", auth, (req, res) => {
  var sql = `select Users.*, UserType.Name as userType from Users inner join UserType on Users.UserTypeID=UserType.ID`;

  const connection = mysql.createConnection(connectionConfig);

  connection.connect((err) => {
    if (err) throw err;
    console.log("Mysql Connected...");

    connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.render("pages/users", {
        users: result,
        user:
          req.session && req.session.userName
            ? { name: req.session.userName, exist: true }
            : {},
      });
    });
  });
});

app.get("/", (req, res) => {
  console.log(
    req.session && req.session.userName
      ? { name: req.session.userName, exist: true }
      : {}
  );
  res.render("pages/index", {
    user:
      req.session && req.session.userName
        ? { name: req.session.userName, exist: true }
        : {},
  });
});

app.listen(port, () => console.log("listening"));
