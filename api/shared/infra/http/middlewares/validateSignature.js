const AppError = require('../../../../shared/errors/AppError');

exports.validateSignature = async (req, res, next) => {
    const signature = req.body.headers['x-bold-signature'];
    const timestamp = req.body.headers['timestamp'];

    if (!signature || !timestamp) {
        throw new AppError('Unauthorized.', 401);
    }

    next();
}