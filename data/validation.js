const REQUIRED_FIELDS = {
    contact: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
    user: ['firstName', 'lastName', 'username', 'email', 'phone', 'city', 'ipaddress']
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const URL_REGEX = /^https?:\/\/[^\s]+$/;

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

    return { valid: true };
};

module.exports = { validateFields };