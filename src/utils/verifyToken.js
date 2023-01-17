const { verify } = require('jsonwebtoken');
const createError = require('http-errors');

const redisClient = require('../utils/init-redis');

exports.verifyAccessToken = (req, res, next) => {
    if(!req.headers['authorization']) return next(createError.Unauthorized());

    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader?.split(' ')[1];

    try {
        const payload = verify(bearerToken, process.env.ACCESS_TOKEN_SECRET);
        req.payload = payload;
        next();
    } catch (error) {
        next(error);
    }
}

exports.verifyRefreshToken = async (refreshToken) => {
    try {
        const payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = payload.aud;
        const storedToken = await redisClient.get(userId);
        if (storedToken !== refreshToken) throw createError.Unauthorized();
        return userId;
    } catch (error) {
        console.log(error);
        throw createError.Unauthorized();
    }
}