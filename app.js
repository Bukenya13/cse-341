require('dotenv').config();

const express = require('express');
const path = require('node:path');
const cors = require('cors');
const session = require('express-session');
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const passport = require('./config/passport');
const { MongoStore } = require('connect-mongo');

const port = process.env.PORT || 3000;
const app = express();

const start = () => {
    if (!process.env.SESSION_SECRET) {
        console.error('SESSION_SECRET is not set. Logins will not survive a restart.');
    }

    app
        .use(cors())
        .use(express.json())
        .set('trust proxy', 1)
        .use(
            session({
                secret: process.env.SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
                store: MongoStore.create({
                    client: mongodb.getDatabase(),
                    collectionName: 'sessions',
                    ttl: 60 * 60 * 24
                })
            })
        )
        .use(passport.initialize())
        .use(passport.session())
        .use(express.static(path.join(__dirname, 'frontend'), { index: false }))
        .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
        .use((req, res, next) => {
            if (req.path === '/api-docs') {
                return res.redirect('/api-docs/');
            }
            next();
        })
        .get('/whoami', (req, res) => {
            const user = req.user || req.session?.user;
            res.status(200).send(user ? `Logged in as ${user.displayName || user.username}` : 'Logged Out');
        })
        .use('/', require('./routes'))
        .use('/professional', require('./routes/professional'))
        .use((req, res) => {
            res.status(404).json({ message: 'Route not found.' });
        })
        .use((err, req, res, next) => {
            console.error(err);
            res.status(500).json({ message: 'An unexpected error occurred.' });
        });

    app.listen(port, () => {
        console.log(`Connected to DB and listening on ${port}`);
        console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
    });
};

mongodb.initDb((err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    } else {
        start();
    }
});