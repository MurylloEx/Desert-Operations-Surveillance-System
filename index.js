const colors = require('colors');
const express = require('express');
const { WorkerRouter } = require('./routers/workers');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(WorkerRouter);

app.listen(80);