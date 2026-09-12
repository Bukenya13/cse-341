const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const getAll = async (req, res, next) => {
    try {
        const contacts = await mongodb.getDatabase().db().collection('contacts').find().toArray();
        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
};

const getSingle = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid contact id.' });
    }

    try {
        const contact = await mongodb
            .getDatabase()
            .db()
            .collection('contacts')
            .findOne({ _id: new ObjectId(req.params.id) });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found.' });
        }

        return res.status(200).json(contact);
    } catch (error) {
        return next(error);
    }
};

module.exports = { getAll, getSingle };
