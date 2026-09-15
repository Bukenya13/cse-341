const express = require('express');
const path = require('node:path');
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const port = process.env.PORT || 3000;
const app = express();

app
    .use(express.json())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    })
    .use(express.static(path.join(__dirname, 'frontend'), { index: false }))
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use('/', require('./routes'))
    .use('/professional', require('./routes/professional'));

mongodb.initDb((err) => {
    if (err) {
        console.error(err);
    } else {
        app.listen(port, () => {
            console.log(`Connected to DB and listening on ${port}`);
            console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
        });
    }
});
