// Needed Resources 
const express = require("express")
const router = new express.Router() 
const actController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')
const { updateAccount } = require("../models/account-model")

// Route to build account home
router.get("/", utilities.checkLogin, utilities.handleErrors(actController.buildAccountHome))

// Route to build login
router.get("/login", actController.buildLogin);
// Route to build registration
router.get("/registration", actController.buildRegister);

// Route to build account management
router.get("/update", actController.buildUpdate)

// Route to process register
router.post(
    '/registration', 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(actController.registerAccount)
)

// Process the login attempt
router.post(
    "/login", regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(actController.accountLogin)
  )

// Route to process update account
router.post(
  "/update_account", regValidate.updateAccountRules(), regValidate.checkUpdateAccountData, utilities.handleErrors(actController.updateAccount)
)

// Route to process password change
router.post("/change_password", regValidate.changePasswordRules(), regValidate.checkChangePasswordData, utilities.handleErrors(actController.changePassword))

// Route to log out
router.get("/logout", utilities.handleErrors(actController.logOut))


module.exports = router;