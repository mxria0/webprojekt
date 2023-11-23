import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';

const server = express();
const port = 8080;

// Middleware 
server.use(cors());

// Beispiel
server.get('/', (req, res) => {
  res.send('Hallo');
});

server.listen(port, () => {
  console.log('Running auf Port: ${port}');
});

