const mongodb = require('../data/database');

const getData = async (req, res, next) => {
    try {
        const profile = await mongodb.getDatabase().db().collection('user').findOne();

        if (!profile) {
            return res.status(404).json({ message: 'No professional profile found in the user collection.' });
        }

        return res.status(200).json(profile);
    } catch (error) {
        return next(error);
    }
};

module.exports = { getData };
