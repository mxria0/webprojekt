import express from "express";

const server = express();
const port=8080;

const maschine = [];

server.post('/maschine', (req, res) => {
    maschine.push(req.body);
    res.status(201).send('Geklappt');
})

//server.post('/maschine', (req, res)=> {
//   ;
//})

server.listen(port,() =>{
    console.log('Running..');
})