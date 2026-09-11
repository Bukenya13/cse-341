const express = require('express');
const app = express();

const morgan = require("/data/databse");
const port = process.env.PORT || 3000;

app.use('/', require('./routes'));


mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => { console.log(`Database is listening and node Running on port ${port}`) });
    }
});