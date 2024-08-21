const client = require('./index');
const express = require("express");
const bodyParser = require("body-parser");
const cors= require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());

// set port, listen for requests
app.listen(8080, function check(error){
  if (error) {
    console.log("Error....!!!");
  }
  else {
    console.log("Server is running on port 8080.");
  }
});

//connect to database
client.connect(function (error){
  if (error) {
    console.log("Error connecting to db....!!!");
  }
  else {
    console.log("Successfully connected to db.");
  }
});

//Get all employees
app.get('/employees', (req, res)=>{
    let order= req.query.order || 'ASC';
    client.query('SELECT * FROM employees ORDER BY emp_id '+order, (err, result) => {
      if (err) {
			  console.error('Error executing query', err);
		  } 
      else {
			  res.send(result.rows);
		  }
    });
    client.end;
});

//*
app.get('/', (req, res)=>{
   res.send("===hello===");
});

//insert(create) operation
app.post('/employees/add',(req, res)=>{
  let details=[
    req.body.emp_id,
    req.body.emp_name,
    req.body.email,
    req.body.age,
  ];
  let sql="INSERT INTO employees VALUES ($1,$2,$3,$4)";
  client.query(sql, details, (err) => {
    if (err) {
      //console.error('Error executing query', err);
      res.send({ status: false, message: "Employee create Failed"});
    } 
    else {
      res.send({ status: true, message: "Employee created Successfully"});
    }
  });
  client.end;
}); 

//search a record
app.get("/employees/:id",(req, res)=>{
  var emp_id=req.params.id;
  client.query('SELECT * FROM employees WHERE emp_id='+emp_id, (err, result) => {
    if (err) {
      console.error('Error executing query', err);
    } 
    else {
      if(result.rows.length>0){
        res.send(result.rows);
      }
      else{
        res.send({ status: false, message: "No Employee Found"});
      }
    }
  });
  client.end;
});

//update a record
app.put("/employees/update/:id",(req, res)=>{
  /*let details=[
    req.body.emp_name,
    req.body.email,
    req.body.age,
  ];
  let sql=
    "UPDATE employees SET emp_name=$1, email=$2, age=$3 WHERE emp_id=" +req.params.id;*/
  let sql=
    "UPDATE employees SET emp_name='" +
    req.body.emp_name +
    "', email='" +
    req.body.email +
    "', age=" +
    req.body.age +
    " WHERE emp_id=" +req.params.id;
  client.query(sql, (err) => {
    if (err) {
      //console.error('Error executing query', err);
      res.send({ status: false, message: "Employee update Failed"});
    } 
    else {
      res.send({ status: true, message: "Employee updated Successfully"});
    }
  });
  client.end;
}); 


//delete record
app.delete("/employees/delete/:id",(req, res)=>{
  //let sql= "DELETE FROM employees WHERE id="+ req.params.id +";";
  client.query("DELETE FROM employees WHERE emp_id="+ req.params.id, (err) => {
    if (err) {
      //console.error('Error executing query', err);
      res.send({ status: false, message: "Employee delete Failed"});
    } 
    else {
      res.send({ status: true, message: "Employee deleted Successfully"});
    }
  });
  client.end;
});