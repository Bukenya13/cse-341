const { ObjectId } = require('mongodb');
const mongodb = require('../database');
const { validateFields } = require('../validation');

const FIELDS = ['name', 'code', 'email', 'phone', 'city', 'country', 'establishedYear', 'type', 'website'];

const pick = (body) => {
    const doc = {};
    for (const field of FIELDS) {
        doc[field] = body[field];
    }
    doc.type = String(body.type).toLowerCase();
    return doc;
};

const getAll = async (req, res, next) => {
    try {
        const colleges = await mongodb.getDatabase().db().collection('colleges').find().toArray();
        return res.status(200).json(colleges);
    } catch (error) {
        return next(error);
    }
};

const getSingle = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid college id.' });
    }

    try {
        const college = await mongodb
            .getDatabase()
            .db()
            .collection('colleges')
            .findOne({ _id: new ObjectId(req.params.id) });

        if (!college) {
            return res.status(404).json({ message: 'College not found.' });
        }

        const courses = await mongodb
            .getDatabase()
            .db()
            .collection('courses')
            .find({ collegeId: college._id })
            .toArray();

        return res.status(200).json({ ...college, courses });
    } catch (error) {
        return next(error);
    }
};

const createCollege = async (req, res, next) => {
    const validation = validateFields(req.body, 'college');
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        const result = await mongodb.getDatabase().db().collection('colleges').insertOne(pick(req.body));

        if (!result.insertedId) {
            return res.status(500).json({ message: 'Failed to create college.' });
        }

        return res.status(201).json({ id: result.insertedId.toString() });
    } catch (error) {
        return next(error);
    }
};

const updateCollege = async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid college id.' });
    }

    const validation = validateFields(req.body, 'college');
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('colleges')
            .updateOne({ _id: new ObjectId(id) }, { $set: pick(req.body) });

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'College not found.' });
        }

        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

const deleteCollege = async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid college id.' });
    }

    try {
        const db = mongodb.getDatabase().db();
        const collegeId = new ObjectId(id);

        const courses = await db.collection('courses').deleteMany({ collegeId });
        const result = await db.collection('colleges').deleteOne({ _id: collegeId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'College not found.' });
        }

        return res.status(200).json({ deletedColleges: result.deletedCount, deletedCourses: courses.deletedCount });
    } catch (error) {
        return next(error);
    }
};

module.exports = { getAll, getSingle, createCollege, updateCollege, deleteCollege };
