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
    .use((req, res, next) => {
        if (req.path === '/api-docs') {
            return res.redirect('/api-docs/');
        }
        next();
    })
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use('/', require('./routes'))
    .use('/professional', require('./routes/professional'))
    .use((req, res) => {
        res.status(404).json({ message: 'Route not found.' });
    })
    .use((err, req, res, next) => {
        console.error(err);
        res.status(500).json({ message: 'An unexpected error occurred.' });
    });

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
