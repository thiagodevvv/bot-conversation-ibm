/// Lets go use "  ; "

require('dotenv').config();

const cors = require('cors')
const express = require('express');
const app = express();
const router = require('./src/routes/index')
const PORT =  8000;

app.use(cors());
app.use(express.json());


app.use('/', router)
app.listen(PORT, () => console.log(`Server started in port::: ${PORT}`));




