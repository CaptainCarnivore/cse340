// Needed Resources 
const express = require("express")
const router = new express.Router() 
const actController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Route to build login
router.get("/login", actController.buildLogin);
// Route to build registration
router.get("/registration", actController.buildRegister);
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
    (req, res) => {
      res.status(200).send('login process')
    }
  )

module.exports = router;