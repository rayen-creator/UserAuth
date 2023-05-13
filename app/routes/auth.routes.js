const { verifySignUp, authJwt } = require("../middleware/index");
const controller = require("../controllers/auth.controller");
module.exports = (app) => {
  app.post(
    "/api/auth/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signup
  );

  app.post("/api/auth/login", [authJwt.verifyToken], controller.login);

  // app.resetpwd("/api/auth/restpassword", controller.resetpwd);
};
