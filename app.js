const express = require('express');
var cors = require('cors');
const cookieParser = require('cookie-parser');

const { swaggerUi, specs } = require('./swagger/swagger.js');
const userRouter = require('./router/user')
const matchingRouter = require('./router/matching')
const app = express()

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/user', userRouter);
app.use('/matching', matchingRouter);

app.get('/', (req, res) => {
    res.send("API");
})

app.listen(8080, ()=>{
    console.log("8080");
})

