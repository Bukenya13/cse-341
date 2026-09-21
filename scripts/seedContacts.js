const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const userProfile = require('../user.json');
const { profilePictureFor } = require('../data/profilePictures');

const sample = [
    { firstName: 'Alice', lastName: 'Anderson', email: 'alice@example.com', favoriteColor: 'blue', birthday: '1990-01-01' },
    { firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', favoriteColor: 'green', birthday: '1991-02-02' },
    { firstName: 'Carol', lastName: 'Clark', email: 'carol@example.com', favoriteColor: 'red', birthday: '1992-03-03' },
    { firstName: 'Dan', lastName: 'Davis', email: 'dan@example.com', favoriteColor: 'yellow', birthday: '1993-04-04' },
    { firstName: 'Eve', lastName: 'Evans', email: 'eve@example.com', favoriteColor: 'purple', birthday: '1994-05-05' }
];

const sampleUsers = [
    { firstName: 'Lawrence', lastName: 'Bukenya', username: 'lawrencebukenya', email: 'lawrence.bukenya@example.com', phone: '+256-700-123-456', city: 'Kampala', ipaddress: '94.121.163.63' },
    { firstName: 'Alice', lastName: 'Anderson', username: 'alice.anderson', email: 'alice@example.com', phone: '+1-202-555-0101', city: 'New York', ipaddress: '192.168.1.101' },
    { firstName: 'Bob', lastName: 'Brown', username: 'bob.brown', email: 'bob@example.com', phone: '+44-20-7946-0958', city: 'London', ipaddress: '172.16.0.22' },
    { firstName: 'Carol', lastName: 'Clark', username: 'carol.clark', email: 'carol@example.com', phone: '+1-415-555-0132', city: 'San Francisco', ipaddress: '10.0.0.15' },
    { firstName: 'Dan', lastName: 'Davis', username: 'dan.davis', email: 'dan@example.com', phone: '+256-414-555-011', city: 'Entebbe', ipaddress: '203.0.113.7' }
].map((user) => ({ ...user, profilePicture: profilePictureFor(user.username) }));

mongodb.initDb(async (err, db) => {
    if (err) {
        console.error('DB init error', err);
        process.exit(1);
    }
    try {
        const dbInstance = db.db();
        const contactsCol = dbInstance.collection('contacts');
        await contactsCol.deleteMany({});
        const r = await contactsCol.insertMany(sample);
        console.log('Inserted', r.insertedCount, 'contacts');

        const userCol = await dbInstance.collection('user');
        await userCol.deleteMany({});
        const users = (Array.isArray(userProfile) ? userProfile : [userProfile]).map((doc) => {
            if (doc && doc._id && doc._id.$oid) {
                return { ...doc, _id: new ObjectId(doc._id.$oid) };
            }
            return doc;
        });
        if (users.length > 0) {
            const ur = await userCol.insertMany(users);
            console.log('Inserted', ur.insertedCount, 'user profile');
        } else {
            console.log('No user profile found in user.json');
        }

        const usersCol = dbInstance.collection('users');
        await usersCol.deleteMany({});
        const su = await usersCol.insertMany(sampleUsers);
        console.log('Inserted', su.insertedCount, 'user profiles');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
});
