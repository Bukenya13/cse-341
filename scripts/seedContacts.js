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

const sampleColleges = [
    { name: 'Makerere University', code: 'MAK', email: 'admissions@mak.ac.ug', phone: '+256-414-422-000', city: 'Kampala', country: 'Uganda', establishedYear: 1922, type: 'public', website: 'https://www.mak.ac.ug' },
    { name: 'Kyambogo University', code: 'KYU', email: 'info@kyu.ac.ug', phone: '+256-312-222-555', city: 'Kampala', country: 'Uganda', establishedYear: 2003, type: 'public', website: 'https://www.kyu.ac.ug' },
    { name: 'Mbarara University of Science and Technology', code: 'MUST', email: 'registrar@must.ac.ug', phone: '+256-485-432-760', city: 'Mbarara', country: 'Uganda', establishedYear: 1989, type: 'public', website: 'https://www.must.ac.ug' },
    { name: 'Uganda Christian University', code: 'UCU', email: 'admissions@ucu.ac.ug', phone: '+256-312-322-200', city: 'Mukono', country: 'Uganda', establishedYear: 1997, type: 'private', website: 'https://ucu.ac.ug' },
    { name: 'Busitema University', code: 'BUT', email: 'info@busitema.ac.ug', phone: '+256-464-440-123', city: 'Busitema', country: 'Uganda', establishedYear: 2007, type: 'public', website: 'https://www.busitema.ac.ug' }
];

const sampleCourses = [
    { name: 'Bachelor of Science in Computer Science', code: 'BSCS', collegeCode: 'MAK', credits: 120, duration: 4, level: 'bachelors', faculty: 'Faculty of Technology', description: 'Covers programming, algorithms, databases, and software engineering.' },
    { name: 'Bachelor of Medicine and Surgery', code: 'MBBS', collegeCode: 'MAK', credits: 180, duration: 6, level: 'bachelors', faculty: 'College of Health Sciences', description: 'Clinical medicine and surgery with supervised clinical rotations.' },
    { name: 'Bachelor of Education', code: 'BED', collegeCode: 'KYU', credits: 130, duration: 3, level: 'bachelors', faculty: 'Faculty of Education', description: 'Teaching methodology, curriculum studies, and classroom practice.' },
    { name: 'Master of Data Science', code: 'MDS', collegeCode: 'KYU', credits: 90, duration: 2, level: 'masters', faculty: 'Faculty of Science', description: 'Advanced statistics, machine learning, and large-scale data engineering.' },
    { name: 'Bachelor of Science in Electrical Engineering', code: 'BSEE', collegeCode: 'MUST', credits: 140, duration: 5, level: 'bachelors', faculty: 'School of Engineering', description: 'Circuits, signals, embedded systems, and power systems.' },
    { name: 'Diploma in Information Technology', code: 'DIT', collegeCode: 'MUST', credits: 60, duration: 2, level: 'diploma', faculty: 'School of Computing', description: 'Practical networking, systems support, and web fundamentals.' },
    { name: 'Bachelor of Theology', code: 'BTH', collegeCode: 'UCU', credits: 120, duration: 4, level: 'bachelors', faculty: 'Faculty of Theology', description: 'Biblical studies, church history, and pastoral practice.' },
    { name: 'Master of Business Administration', code: 'MBA', collegeCode: 'UCU', credits: 90, duration: 2, level: 'masters', faculty: 'School of Business', description: 'Finance, organisational behaviour, strategy, and operations management.' },
    { name: 'Bachelor of Science in Environmental Health', code: 'BSEH', collegeCode: 'BUT', credits: 130, duration: 4, level: 'bachelors', faculty: 'Faculty of Science', description: 'Public health, sanitation, and environmental risk management.' },
    { name: 'Postgraduate Diploma in Public Health', code: 'PGDPH', collegeCode: 'BUT', credits: 45, duration: 1, level: 'diploma', faculty: 'School of Health Sciences', description: 'Epidemiology, health policy, and research methods for practising professionals.' }
];

const sampleInstructors = [
    { firstName: 'Grace', lastName: 'Nabirye', email: 'g.nabirye@mak.ac.ug', phone: '+256-414-422-101', title: 'professor', courseCode: 'BSCS', faculty: 'Faculty of Technology', office: 'Tech B14', hireDate: '2009-02-01' },
    { firstName: 'Joseph', lastName: 'Okello', email: 'j.okello@mak.ac.ug', phone: '+256-414-422-102', title: 'senior lecturer', courseCode: 'MBBS', faculty: 'College of Health Sciences', office: 'Med A02', hireDate: '2012-08-15' },
    { firstName: 'Sarah', lastName: 'Namutebi', email: 's.namutebi@kyu.ac.ug', phone: '+256-312-222-501', title: 'associate professor', courseCode: 'BED', faculty: 'Faculty of Education', office: 'Ed C07', hireDate: '2015-01-20' },
    { firstName: 'Daniel', lastName: 'Kato', email: 'd.kato@kyu.ac.ug', phone: '+256-312-222-502', title: 'lecturer', courseCode: 'MDS', faculty: 'Faculty of Science', office: 'Sci D11', hireDate: '2018-09-03' },
    { firstName: 'Rebecca', lastName: 'Auma', email: 'r.auma@must.ac.ug', phone: '+256-485-432-701', title: 'senior lecturer', courseCode: 'BSEE', faculty: 'School of Engineering', office: 'Eng E05', hireDate: '2014-03-10' },
    { firstName: 'Peter', lastName: 'Wekesa', email: 'p.wekesa@must.ac.ug', phone: '+256-485-432-702', title: 'lecturer', courseCode: 'DIT', faculty: 'School of Computing', office: 'Comp F09', hireDate: '2019-07-01' },
    { firstName: 'Miriam', lastName: 'Nabirye', email: 'm.nabirye@ucu.ac.ug', phone: '+256-312-322-201', title: 'professor', courseCode: 'BTH', faculty: 'Faculty of Theology', office: 'Th G03', hireDate: '2011-11-14' },
    { firstName: 'Andrew', lastName: 'Byaruhanga', email: 'a.byaruhanga@ucu.ac.ug', phone: '+256-312-322-202', title: 'associate professor', courseCode: 'MBA', faculty: 'School of Business', office: 'Bus H12', hireDate: '2016-05-23' },
    { firstName: 'Fatima', lastName: 'Nakintu', email: 'f.nakintu@busitema.ac.ug', phone: '+256-464-440-101', title: 'lecturer', courseCode: 'BSEH', faculty: 'Faculty of Science', office: 'Sci J08', hireDate: '2020-01-13' },
    { firstName: 'Charles', lastName: 'Ouma', email: 'c.ouma@busitema.ac.ug', phone: '+256-464-440-102', title: 'assistant lecturer', courseCode: 'PGDPH', faculty: 'School of Health Sciences', office: 'HL K04', hireDate: '2021-08-30' }
];

const sampleUsers = [
    { firstName: 'Lawrence', lastName: 'Bukenya', username: 'lawrencebukenya', email: 'lawrence.bukenya@example.com', phone: '+256-700-123-456', city: 'Kampala', ipaddress: '94.121.163.63' },
    { firstName: 'Alice', lastName: 'Anderson', username: 'alice.anderson', email: 'alice@example.com', phone: '+1-202-555-0101', city: 'New York', ipaddress: '192.168.1.101' },
    { firstName: 'Bob', lastName: 'Brown', username: 'bob.brown', email: 'bob@example.com', phone: '+44-20-7946-0958', city: 'London', ipaddress: '172.16.0.22' },
    { firstName: 'Carol', lastName: 'Clark', username: 'carol.clark', email: 'carol@example.com', phone: '+1-415-555-0132', city: 'San Francisco', ipaddress: '10.0.0.15' },
    { firstName: 'Dan', lastName: 'Davis', username: 'dan.davis', email: 'dan@example.com', phone: '+256-414-555-011', city: 'Entebbe', ipaddress: '203.0.113.7' }
].map((user) => ({ ...user, profilePicture: profilePictureFor(user.username) }));

// Pass a scope to seed only those collections, e.g. `npm run seed -- colleges`.
// With no scope, every collection is cleared and reseeded.
const scope = process.argv.slice(2);
const shouldSeed = (name) => scope.length === 0 || scope.includes(name);

// Colleges, courses, and instructors are seeded together because each one
// references the previous: courses point at a college, instructors at a course.
// Re-seeding a college or course regenerates ids, so instructors must follow.
const seedAcademic = async (dbInstance) => {
    const coursesCol = dbInstance.collection('courses');
    const collegesCol = dbInstance.collection('colleges');
    const instructorsCol = dbInstance.collection('instructors');

    await instructorsCol.deleteMany({});
    await coursesCol.deleteMany({});
    await collegesCol.deleteMany({});

    const cr = await collegesCol.insertMany(sampleColleges);
    console.log('Inserted', cr.insertedCount, 'colleges');

    const idByCode = {};
    sampleColleges.forEach((college, i) => {
        idByCode[college.code] = cr.insertedIds[i];
    });

    const courseDocs = sampleCourses.map(({ collegeCode, ...course }) => ({
        ...course,
        collegeId: idByCode[collegeCode]
    }));
    const csr = await coursesCol.insertMany(courseDocs);
    console.log('Inserted', csr.insertedCount, 'courses');

    const courseIdByCode = {};
    sampleCourses.forEach((course, i) => {
        courseIdByCode[course.code] = csr.insertedIds[i];
    });

    const instructorDocs = sampleInstructors.map(({ courseCode, ...instructor }) => ({
        ...instructor,
        courseId: courseIdByCode[courseCode]
    }));
    const ir = await instructorsCol.insertMany(instructorDocs);
    console.log('Inserted', ir.insertedCount, 'instructors');
};

mongodb.initDb(async (err, db) => {
    if (err) {
        console.error('DB init error', err);
        process.exit(1);
    }
    try {
        const dbInstance = db.db();

        if (shouldSeed('colleges') || shouldSeed('instructors')) {
            await seedAcademic(dbInstance);
        }

        if (shouldSeed('contacts')) {
            const contactsCol = dbInstance.collection('contacts');
            await contactsCol.deleteMany({});
            const r = await contactsCol.insertMany(sample);
            console.log('Inserted', r.insertedCount, 'contacts');
        }

        if (shouldSeed('users')) {
            const userCol = dbInstance.collection('user');
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
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
});
