const express = require("express");
const path = require("path");
const app = express();
const ejs = require("ejs-mate");
var bodyParser = require("body-parser");
var mysql = require("mysql");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.engine("ejs", ejs);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const PORT = process.env.PORT || 5000;

app.post("/registry", (req, res) => {
  user = req.body;

  console.log(user);
  let userTypeID = parseInt(user.usertype);

  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
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

  res.render("index", { body: req.body });
});

app.listen(PORT, () => console.log("listening"));
