/*
 * Client-Side Validation Utilities.
 * Provides a suite of pure functions to evaluate form inputs against strict Regex patterns 
 * and business logic constraints before dispatching payloads to the server.
 */

/*
 * Evaluates the structural integrity of an email address string.
 * Ensures the presence of local-part, '@' symbol, domain, and top-level domain without illegal spaces.
 * @param {String} email - The input email string.
 * @returns {Boolean} True if the format is valid.
 */
const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 
};

/*
 * Enforces security complexity requirements for user passwords.
 * Requires: Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 numeric digit.
 * @param {String} password - The plaintext password input.
 * @returns {Boolean} True if complexity requirements are met.
 */
const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
};

/*
 * Validates mobile network formats strictly against Israeli telecom standards.
 * Requires the standard '05' prefix followed exactly by 8 numerical digits.
 * @param {String} phone - The numeric phone string.
 * @returns {Boolean} True if it matches the Israeli mobile format.
 */
const validatePhone = (phone) => {
    return /^05\d{8}$/.test(phone); 
};

/*
 * Validates alphabetical name strings.
 * Enforces a minimum length of 2 characters and strictly prohibits numeric or special characters.
 * @param {String} name - The user's first or last name.
 * @returns {Boolean} True if the string contains only letters and spaces.
 */
const validateName = (name) => {
    return /^[A-Za-z\s]{2,}$/.test(name);
};

/*
 * Evaluates chronological validity for Date of Birth inputs.
 * Ensures the string parses into a valid JavaScript Date object and represents a point in the past.
 * @param {String|Date} birthday - The input date string.
 * @returns {Boolean} True if the date is a valid historical timestamp.
 */
const validateBirthday = (birthday) => {
    if (!birthday) return false;
    const selectedDate = new Date(birthday);
    const today = new Date();
    // Validates object typing, checks against NaN dates, and ensures chronological logic
    return selectedDate instanceof Date && !isNaN(selectedDate) && selectedDate < today;
};

/*
 * Strictly limits gender input to the supported application enumerations.
 * @param {String} gender - The input string.
 * @returns {Boolean} True if the input matches the defined array.
 */
const validateGender = (gender) => {
    return ["male", "female"].includes(gender);
};

export { 
    validateEmail, 
    validatePassword, 
    validatePhone, 
    validateName, 
    validateBirthday, 
    validateGender 
};