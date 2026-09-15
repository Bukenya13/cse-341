const { ObjectId } = require('mongodb');
const mongodb = require('../../data/database');

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

const createContact = async (req, res, next) => {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
        return res.status(400).json({ message: 'All contact fields are required.' });
    }

    try {
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('contacts')
            .insertOne({ firstName, lastName, email, favoriteColor, birthday });

        return res.status(201).json({ id: result.insertedId.toString() });
    } catch (error) {
        return next(error);
    }
};

const updateContact = async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid contact id.' });
    }

    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
        return res.status(400).json({ message: 'All contact fields are required.' });
    }

    try {
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('contacts')
            .updateOne({ _id: new ObjectId(id) }, { $set: { firstName, lastName, email, favoriteColor, birthday } });

        if (result.matchedCount === 0) return res.status(404).json({ message: 'Contact not found.' });
        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

const deleteContact = async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid contact id.' });
    }

    try {
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('contacts')
            .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) return res.status(404).json({ message: 'Contact not found.' });
        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

module.exports = { getAll, getSingle, createContact, updateContact, deleteContact };
