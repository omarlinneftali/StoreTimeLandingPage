const express = require("express");
const path = require("path");
const app = express();
const handlebars = require("express-handlebars");
const ejs = require("ejs-mate");
var bodyParser = require("body-parser");
var mysql = require("mysql");

const PORT = process.env.PORT || 50000;
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.engine(
  ".hbs",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    defaultLayout: "main",
    extname: "hbs",
    //for partial directory
    partialsDir: __dirname + "/views/partials",
  })
);

app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

app.post("/registry", (req, res) => {
  user = req.body;

  console.log(user);
  let userTypeID = parseInt(user.usertype);

  const con = mysql.createConnection({
    host: "localhost",
    user: "omarlin",
    password: "Storetime1@",
    database: "users",
  });
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = `INSERT INTO Users(Name, Email, Phone, UserTypeID)  VALUES ('${user.name}', '${user.email}','${user.phone}',${userTypeID} )`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });

  res.render("pages/registry", { body: req.body });
});

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.listen(PORT, () => console.log("listening"));
