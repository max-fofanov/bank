const express = require('express');
const userRouter = require('./routes/user.routes');
const adminRouter = require('./routes/admin.routes');

const PORT = 8080;
const server = express();

server.use(express.json());
server.use('/user', userRouter);
server.use('/admin', adminRouter);

server.listen(PORT, () => console.log("Server started"));
