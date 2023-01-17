const { Router } = require("express");
const { validate } = require("express-validation");

const AuthContrller = require("../controllers/auth.controller");
const { verifyAccessToken } = require("../utils/verifyToken");
const {
  createUserValidation,
  loginUserValiation,
} = require("../validations/user.validation");
const router = Router();

router.post(
  "/register",
  validate(createUserValidation),
  AuthContrller.register
);
router.post("/login", validate(loginUserValiation), AuthContrller.login);
router.post("/refresh-token", AuthContrller.refreshToken);
router.post("/protected", verifyAccessToken, AuthContrller.protectedRoute);
router.post("/logout", AuthContrller.logout);

module.exports = router;
