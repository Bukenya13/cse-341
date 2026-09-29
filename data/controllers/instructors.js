const { ObjectId } = require('mongodb');
const mongodb = require('../database');
const { validateFields } = require('../validation');

const FIELDS = ['firstName', 'lastName', 'email', 'phone', 'title', 'courseId', 'faculty', 'office', 'hireDate'];

const pick = (body) => {
    const doc = {};
    for (const field of FIELDS) {
        doc[field] = field === 'courseId' ? new ObjectId(body.courseId) : body[field];
    }
    doc.title = String(body.title).toLowerCase();
    return doc;
};

const courseExists = async (courseId) => {
    const course = await mongodb.getDatabase().db().collection('courses').findOne({ _id: courseId });
    return Boolean(course);
};

const getAll = async (req, res, next) => {
    try {
        const instructors = await mongodb.getDatabase().db().collection('instructors').find().toArray();
        return res.status(200).json(instructors);
    } catch (error) {
        return next(error);
    }
};

const getSingle = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid instructor id.' });
    }

    try {
        const instructor = await mongodb
            .getDatabase()
            .db()
            .collection('instructors')
            .findOne({ _id: new ObjectId(req.params.id) });

        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found.' });
        }

        return res.status(200).json(instructor);
    } catch (error) {
        return next(error);
    }
};

const createInstructor = async (req, res, next) => {
    const validation = validateFields(req.body, 'instructor');
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        const courseId = new ObjectId(req.body.courseId);
        if (!(await courseExists(courseId))) {
            return res.status(400).json({ message: 'courseId does not match an existing course.' });
        }

        const result = await mongodb.getDatabase().db().collection('instructors').insertOne(pick(req.body));

        if (!result.insertedId) {
            return res.status(500).json({ message: 'Failed to create instructor.' });
        }

        return res.status(201).json({ id: result.insertedId.toString() });
    } catch (error) {
        return next(error);
    }
};

const updateInstructor = async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid instructor id.' });
    }

    const validation = validateFields(req.body, 'instructor');
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        const courseId = new ObjectId(req.body.courseId);
        if (!(await courseExists(courseId))) {
            return res.status(400).json({ message: 'courseId does not match an existing course.' });
        }

        const result = await mongodb
            .getDatabase()
            .db()
            .collection('instructors')
            .updateOne({ _id: new ObjectId(id) }, { $set: pick(req.body) });

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Instructor not found.' });
        }

        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

const deleteInstructor = async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid instructor id.' });
    }

    try {
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('instructors')
            .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Instructor not found.' });
        }

        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

module.exports = { getAll, getSingle, createInstructor, updateInstructor, deleteInstructor };
