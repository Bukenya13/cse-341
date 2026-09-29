const REQUIRED_FIELDS = {
    contact: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
    user: ['firstName', 'lastName', 'username', 'email', 'phone', 'city', 'ipaddress'],
    college: ['name', 'code', 'email', 'phone', 'city', 'country', 'establishedYear', 'type', 'website'],
    course: ['name', 'code', 'collegeId', 'credits', 'duration', 'level', 'faculty', 'description'],
    instructor: ['firstName', 'lastName', 'email', 'phone', 'title', 'courseId', 'faculty', 'office', 'hireDate']
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const URL_REGEX = /^https?:\/\/[^\s]+$/;
const CODE_REGEX = /^[A-Za-z0-9-]{2,12}$/;
const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;
const COLLEGE_TYPES = ['public', 'private', 'community', 'technical'];
const COURSE_LEVELS = ['certificate', 'diploma', 'bachelors', 'masters', 'phd'];
const INSTRUCTOR_TITLES = ['professor', 'associate professor', 'senior lecturer', 'lecturer', 'assistant lecturer', 'teaching assistant'];

const isEmpty = (value) => value === undefined || value === null || String(value).trim() === '';

const validateFields = (body, type) => {
    const required = REQUIRED_FIELDS[type] || [];
    const missing = required.filter((field) => isEmpty(body[field]));

    if (missing.length > 0) {
        return {
            valid: false,
            message: `Missing required ${type} fields: ${missing.join(', ')}.`
        };
    }

    if (!isEmpty(body.email) && !EMAIL_REGEX.test(body.email)) {
        return { valid: false, message: 'A valid email address is required.' };
    }

    if (!isEmpty(body.profilePicture) && !URL_REGEX.test(body.profilePicture)) {
        return { valid: false, message: 'profilePicture must be a valid http(s) URL.' };
    }

    if (type === 'user') {
        if (!isEmpty(body.username) && !USERNAME_REGEX.test(body.username)) {
            return { valid: false, message: 'Username may only contain letters, numbers, dots, underscores, and dashes.' };
        }
        if (!isEmpty(body.phone) && !/^[0-9+\-\s()]+$/.test(body.phone)) {
            return { valid: false, message: 'Phone number may only contain digits, spaces, and characters + - ( ).' };
        }
    }

    if (type === 'contact' && !isEmpty(body.birthday) && !DATE_REGEX.test(body.birthday)) {
        return { valid: false, message: 'Birthday must be a valid date in YYYY-MM-DD format.' };
    }

    if (type === 'college') {
        if (!isEmpty(body.code) && !CODE_REGEX.test(body.code)) {
            return { valid: false, message: 'College code must be 2-12 letters, numbers, or dashes.' };
        }
        if (!isEmpty(body.website) && !URL_REGEX.test(body.website)) {
            return { valid: false, message: 'website must be a valid http(s) URL.' };
        }
        if (!isEmpty(body.type) && !COLLEGE_TYPES.includes(String(body.type).toLowerCase())) {
            return { valid: false, message: `type must be one of: ${COLLEGE_TYPES.join(', ')}.` };
        }
        if (!isEmpty(body.establishedYear) && !/^\d{4}$/.test(String(body.establishedYear))) {
            return { valid: false, message: 'establishedYear must be a 4-digit year.' };
        }
        if (!isEmpty(body.phone) && !/^[0-9+\-\s()]+$/.test(body.phone)) {
            return { valid: false, message: 'Phone number may only contain digits, spaces, and characters + - ( ).' };
        }
    }

    if (type === 'course') {
        if (!isEmpty(body.code) && !CODE_REGEX.test(body.code)) {
            return { valid: false, message: 'Course code must be 2-12 letters, numbers, or dashes.' };
        }
        if (!isEmpty(body.collegeId) && !OBJECT_ID_REGEX.test(body.collegeId)) {
            return { valid: false, message: 'collegeId must be a valid 24-character MongoDB ObjectId.' };
        }
        if (!isEmpty(body.credits) && !/^\d{1,2}$/.test(String(body.credits))) {
            return { valid: false, message: 'credits must be a number between 1 and 99.' };
        }
        if (!isEmpty(body.level) && !COURSE_LEVELS.includes(String(body.level).toLowerCase())) {
            return { valid: false, message: `level must be one of: ${COURSE_LEVELS.join(', ')}.` };
        }
        if (!isEmpty(body.duration) && !/^\d{1,2}$/.test(String(body.duration))) {
            return { valid: false, message: 'duration must be a number of years between 1 and 99.' };
        }
    }

    if (type === 'instructor') {
        if (!isEmpty(body.title) && !INSTRUCTOR_TITLES.includes(String(body.title).toLowerCase())) {
            return { valid: false, message: `title must be one of: ${INSTRUCTOR_TITLES.join(', ')}.` };
        }
        if (!isEmpty(body.courseId) && !OBJECT_ID_REGEX.test(body.courseId)) {
            return { valid: false, message: 'courseId must be a valid 24-character MongoDB ObjectId.' };
        }
        if (!isEmpty(body.phone) && !/^[0-9+\-\s()]+$/.test(body.phone)) {
            return { valid: false, message: 'Phone number may only contain digits, spaces, and characters + - ( ).' };
        }
        if (!isEmpty(body.hireDate) && !DATE_REGEX.test(body.hireDate)) {
            return { valid: false, message: 'hireDate must be a valid date in YYYY-MM-DD format.' };
        }
        if (!isEmpty(body.office) && !/^[A-Za-z0-9\s-]{1,20}$/.test(body.office)) {
            return { valid: false, message: 'office may only contain letters, numbers, spaces, and dashes.' };
        }
    }

    return { valid: true };
};

module.exports = { validateFields };