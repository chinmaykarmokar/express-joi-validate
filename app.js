const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');

const app = express();

// Parse JSON

app.use(express.json());

// Setting up Connection with MySQL database

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    tls: {
        rejectUnauthorized: true
    }
})

connection.connect((err) => {
    if (err) throw err;
})

//Testing Response

app.get('/', (req,res) => {
    let getQuery = "SELECT * FROM students;"

    connection.query(getQuery, (err, result, fields) => {
        res.send(result);
    })
})

app.post('/', (req,res) => {
    let insertQuery = "INSERT INTO students (name,age,hobby,email) VALUES ('" + req.body.name + "', '" + req.body.age + "', '" + req.body.hobby + "', '" + req.body.email + "');";

    const schema = Joi.object().keys({
        name: Joi.string().required(),
        age: Joi.number().required(),
        hobby: Joi.string().required(),
        email: Joi.string().email().required()
    })

    console.log(schema.validate(req.body));

    if (schema.validate(req.body).error) {
        res.send(schema.validate(req.body).error.details);
    }

    else {
        connection.query(insertQuery, (err, result, field) => {
            res.send(schema.validate(req.body));
        })
    }
})

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    if (err) throw err;
    console.log('Server is running on port: ' + port);
})