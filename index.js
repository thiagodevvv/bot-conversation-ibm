/// Lets go use "  ; "

require('dotenv').config();

const cors = require('cors')
const express = require('express');
const app = express();
const PORT =  8000;

app.use(cors());
app.use(express.json());


app.use(require('./src/routes'))
app.listen(PORT, () => console.log(`Server started in port::: ${PORT}`));




