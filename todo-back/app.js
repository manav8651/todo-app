const express = require('express');
const cors = require('cors');
const todoRouter = require('./routes/todoRoutes');
const authRouter = require('./routes/authRoutes');

const app = express();

app.use(cors())
app.use(express.json());

app.use('/todos', todoRouter)
app.use('/auth', authRouter)


module.exports = app;