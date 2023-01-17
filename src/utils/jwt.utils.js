const { sign } = require("jsonwebtoken");
const redisClient = require("../utils/init-redis");

exports.signAccessToken = (userId) => {
  const tokenPayload = { userId };
  const accessToken =
    "Bearer " +
    sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
      issuer: "pratham.com",
      audience: userId.toString(),
    });

  return accessToken;
};

exports.signRefreshToken = (userId) => {
  const tokenPayload = { userId };
  const refreshToken = sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "365d",
    // expiresIn: "30s",
    issuer: "pratham.com",
    audience: userId.toString(),
  });

  redisClient.set(userId, refreshToken,{ EX: 365 * 24 * 60 * 60 });
  return refreshToken;
};
