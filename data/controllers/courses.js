const { ObjectId } = require('mongodb');
const mongodb = require('../database');
const { validateFields } = require('../validation');

const FIELDS = ['name', 'code', 'collegeId', 'credits', 'duration', 'level', 'faculty', 'description'];

const pick = (body) => {
    const doc = {};
    for (const field of FIELDS) {
        doc[field] = field === 'collegeId' ? new ObjectId(body.collegeId) : body[field];
    }
    doc.credits = Number(body.credits);
    doc.duration = Number(body.duration);
    doc.level = String(body.level).toLowerCase();
    return doc;
};

const collegeExists = async (collegeId) => {
    const college = await mongodb.getDatabase().db().collection('colleges').findOne({ _id: collegeId });
    return Boolean(college);
};

const getAll = async (req, res, next) => {
    try {
        const courses = await mongodb.getDatabase().db().collection('courses').find().toArray();
        return res.status(200).json(courses);
    } catch (error) {
        return next(error);
    }
};

const getSingle = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid course id.' });
    }

    try {
        const course = await mongodb
            .getDatabase()
            .db()
            .collection('courses')
            .findOne({ _id: new ObjectId(req.params.id) });

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        return res.status(200).json(course);
    } catch (error) {
        return next(error);
    }
};

const createCourse = async (req, res, next) => {
    const validation = validateFields(req.body, 'course');
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        const collegeId = new ObjectId(req.body.collegeId);
        if (!(await collegeExists(collegeId))) {
            return res.status(400).json({ message: 'collegeId does not match an existing college.' });
        }

        const result = await mongodb.getDatabase().db().collection('courses').insertOne(pick(req.body));

        if (!result.insertedId) {
            return res.status(500).json({ message: 'Failed to create course.' });
        }

        return res.status(201).json({ id: result.insertedId.toString() });
    } catch (error) {
        return next(error);
    }
};

const updateCourse = async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid course id.' });
    }

    const validation = validateFields(req.body, 'course');
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        const collegeId = new ObjectId(req.body.collegeId);
        if (!(await collegeExists(collegeId))) {
            return res.status(400).json({ message: 'collegeId does not match an existing college.' });
        }

        const result = await mongodb
            .getDatabase()
            .db()
            .collection('courses')
            .updateOne({ _id: new ObjectId(id) }, { $set: pick(req.body) });

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

const deleteCourse = async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid course id.' });
    }

    try {
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('courses')
            .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

module.exports = { getAll, getSingle, createCourse, updateCourse, deleteCourse };
