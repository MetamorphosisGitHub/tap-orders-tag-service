const { promisify } = require('util');
const createHmacAsync = promisify(require('crypto').createHmac);

const AppError = require('../../../../shared/errors/AppError');

exports.validateSignature = async (req, res, next) => {
    const signature = req.body.headers['x-bold-signature'];
    const timestamp = req.body.headers['timestamp'];

    const json_body = JSON.stringify(req.body);

    const hash = createHmacAsync('sha256', '7cf3d39eaa3876396bfa78ac67e70c1a08337a9669305d08b7cb2821a2569cfae25b1118aa6b57e12d197e58f1bbac05c67abf2cace9d5851054b081172bb4a8')
            .update(`${json_body}.${timestamp}`)
            .digest();
        
    console.log(hash);
    throw new AppError('Unauthorized.', 401);

    if (!signature || !timestamp) {
        
    }

    // next();
}