const { ObjectId } = require('mongodb');
const mongodb = require('../database');
const { validateFields } = require('../validation');
const { profilePictureFor } = require('../profilePictures');

const withPicture = (user) => ({
    ...user,
    profilePicture: user.profilePicture || profilePictureFor(user.username)
});

const getAll = async (req, res, next) => {
    try {
        const users = await mongodb.getDatabase().db().collection('users').find().toArray();
        return res.status(200).json(users.map(withPicture));
    } catch (error) {
        return next(error);
    }
};

const getSingle = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid user id.' });
    }

    try {
        const user = await mongodb
            .getDatabase()
            .db()
            .collection('users')
            .findOne({ _id: new ObjectId(req.params.id) });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json(withPicture(user));
    } catch (error) {
        return next(error);
    }
};

const createUser = async (req, res, next) => {
    const validation = validateFields(req.body, 'user');
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const { firstName, lastName, username, email, phone, city, ipaddress } = req.body;

    try {
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('users')
            .insertOne({ firstName, lastName, username, email, phone, city, ipaddress, profilePicture: profilePictureFor(username) });

        if (!result.insertedId) {
            return res.status(500).json({ message: 'Failed to create user.' });
        }

        return res.status(201).json({ id: result.insertedId.toString() });
    } catch (error) {
        return next(error);
    }
};

const updateUser = async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user id.' });
    }

    const validation = validateFields(req.body, 'user');
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const { firstName, lastName, username, email, phone, city, ipaddress } = req.body;

    try {
        const updates = { firstName, lastName, username, email, phone, city, ipaddress };
        if (req.body.profilePicture) {
            updates.profilePicture = req.body.profilePicture;
        }

        const result = await mongodb
            .getDatabase()
            .db()
            .collection('users')
            .updateOne({ _id: new ObjectId(id) }, { $set: updates });

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user id.' });
    }

    try {
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('users')
            .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

module.exports = { getAll, getSingle, createUser, updateUser, deleteUser };