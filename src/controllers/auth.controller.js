const createError = require("http-errors");

const redisClient = require('../utils/init-redis');
const User = require("../models/user.model");
const { signAccessToken, signRefreshToken } = require("../utils/jwt.utils");
const { verifyRefreshToken } = require("../utils/verifyToken");

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const doesExists = await User.findOne({ username });
    if (doesExists)
      throw createError.Conflict(`"${username}" is already registered.`);
    const user = await User.create({ username, password });
    delete user.password;
    return res.status(200).json({
      user,
      accessToken: signAccessToken(user._id),
      refreshToke: signRefreshToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) throw createError.BadRequest(`Invalid Credentials`);
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) throw createError.BadRequest(`Invalid Credentials`);
    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());
    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(createError.Unauthorized());

    const userId = await verifyRefreshToken(refreshToken);

    return res.status(200).json({
      accessToken: signAccessToken(userId),
      refreshToken: signRefreshToken(userId),
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);
    await redisClient.del(userId);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

exports.protectedRoute = (req, res, next) => {
  return res.status(200).json({ message: "Protected Info" });
};
