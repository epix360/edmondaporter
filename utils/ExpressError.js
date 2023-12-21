class ExpressError extends Error {
constructor(message, statusCode) {
    super();
    Object.assign(this, {message, statusCode});
}
}

module.exports = ExpressError;