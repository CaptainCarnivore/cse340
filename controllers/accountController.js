// Needed resources
const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const revModel = require("../models/review-model")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  }

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/registration", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver account home view
* *************************************** */

async function buildAccountHome(req, res, next) {
  let nav = await utilities.getNav()
  let accountId = res.locals.accountData.account_id
  const barData = await revModel.getReviewByAccountId(accountId)
  const bar = await utilities.buildAccountReviewBar(barData)
  res.render("account/", {
    title: "Account Home",
    nav,
    bar,
    errors: null,
  })
}

/* ****************************************
*  Deliver account home view
* *************************************** */

async function buildUpdate(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
  })
}



/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process Account Update
* *************************************** */

async function updateAccount (req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id} = req.body
  const updateResult = await accountModel.updateAccount( account_firstname, account_lastname, account_email, account_id )
  if (updateResult) {
    const accountData = await accountModel.getAccountByEmail(account_email)
    accountData.account_id = updateResult.account_id
    accountData.account_firstname = updateResult.account_firstname
    accountData.account_lastname = updateResult.account_lastname
    accountData.account_email = updateResult.account_email
    res.clearCookie("jwt")
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    req.flash("notice", 'Your account was successfully updated.')
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null, 
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }
}


/* ****************************************
*  Process Password Change
* *************************************** */

async function changePassword (req, res, next) {
  let nav = await utilities.getNav()
  const { account_password, account_id} = req.body
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing password change.')
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }
  const updateResult = await accountModel.changePassword( hashedPassword, account_id )
  if (updateResult) {
    req.flash("notice", 'Your password was successfully changed.')
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password change failed.")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
    const passTest = await bcrypt.compare(account_password, accountData.account_password)
   if (passTest) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   } else {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
  })} 
} catch (error) {
  return new Error('Access Forbidden')
 }
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function logOut(req, res, next) {
  if (req.cookies.jwt) {
      delete res.locals.accountData
      res.locals.loggedin = 0
       res.clearCookie("jwt")
       return res.redirect("/")
   } else {
    next()
   }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountHome, buildUpdate, updateAccount, changePassword, logOut }