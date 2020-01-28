const express = require("express");
const { Client } = require("pg");
const connectionString =
  "postgres://rootuser@fyle:root@123@fyle.postgres.database.azure.com:5432/postgres";
const client = new Client({
  connectionString: connectionString
});
client.connect();
var app = express();
app.set("port", process.env.PORT || 4000);
app.get("/", function(req, res, next) {
  const text =
    "select branch, address , city , district , state , bank_name from bank_branches bb where ifsc = $1";
  const values = [req.query.ifsc];
  client.query(text, values, function(err, result) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    res.status(200).send(result.rows);
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
    res.status(200).send(result.rows);
  });
});
app.listen(4000, function() {
  console.log("Server is running.. on Port 4000");
});
