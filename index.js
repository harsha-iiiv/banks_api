const express = require("express");
const { Client } = require("pg");

const connectionString =
  "postgres://rootuser@fyle:root@123@fyle.postgres.database.azure.com:5432/postgres";
const client = new Client({
  connectionString: connectionString
});
client.connect();
var app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.set("port", process.env.PORT || 4000);
app.get("/", function(req, res, next) {
  
    res.render("index", { name: "Click here" });
  
    // res.status(200).send(result.rows);
  });
app.get("/bank", function(req, res, next) {
  const text =
    "select branch, address , city , district , state , bank_name from bank_branches bb where ifsc = $1";
  const values = [req.query.ifsc];
  client.query(text, values, function(err, result) {
    if (err) {
      console.log(err); 
      res.status(400).send(err);
    }
    res.render("ifsc", { name: result.rows[0] });
  
    // res.status(200).send(result.rows);
  });
});

app.get("/details", function(req, res, next) {
  const text =
    "select ifsc , branch , address , district ,state from bank_branches bb where city = $1 and bank_name = $2";
  const values = [req.query.city, req.query.bank_name];
  client.query(text, values, function(err, result) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    res.render("bank", { bank: result.rows });

    // res.status(200).send(result.rows);
  });
});
app.listen( app.get( 'port' ), function() {
  console.log( 'Node server is running on port ' + app.get( 'port' ));
  });