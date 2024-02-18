const invModel = require("../models/inventory-model")
const revModel = require("../models/review-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the item detail view HTML
* ************************************ */

Util.buildItemDetailView = async function(data){
  let detail
  if(data){
    detail = '<section id="vehicle">'
    detail += '<div id="vehicleImg">'
    detail += '<img id="vehImg" src="' + data.inv_image + '" alt="Image of ' + data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model
    + '">' 
    detail += '</div>'
    detail += '<div id="vehicleDetails">'
    detail += '<div id="vehicleStats"><h3>$' + data.inv_price + ' | ' + data.inv_miles.toLocaleString() + ' Miles</h3>'
    + '</div>'
    detail += '<div id="vehicleDescription">' + '<h4>' + data.inv_color + ' ' + data.classification_name + '</h4>'
    + data.inv_description
    + '</div>'

    detail += '</div>'
    detail += '</section>'
  } else {
    detail += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return detail
}

/* ************************
 * Constructs the Select Classification for Add Inventory
 ************************** */
Util.getClassSelect = async function (req, res, next) {
  let selData = await invModel.getClassifications()
  let selList = "<select id='invClassification' name='classification_id' >"
  selData.rows.forEach((row) => {
    selList += "<option value='" + row.classification_id + "'>" + row.classification_name + "</option>"
  })
  selList += "</select>"
  return selList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 *  Check Account Type for Admin views
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
    if (res.locals.accountData.account_type == "Admin" || res.locals.accountData.account_type == "Employee") {
    next()
    }
    else {
      req.flash("notice", "You are not authorized to view that page.")
      return res.redirect("/")
    }
}

/* ****************************************
 *  Build review bar on detail page
 * ************************************ */
Util.buildItemReviewBar = async function(data){
  let bar
  if(data.length > 0){
    bar = '<section class="reviewBar">' + '<h2>Customer Reviews</h2>'
    data.forEach(review => {
      bar += '<div class="reviewCard">' + '<span id="reviewerName">' + review.account_firstname + '</span> wrote on ' + review.review_date + '<hr>'
      bar += '<p id="reviewText">"' + review.review_text + '"</p>'
      bar += '</div>'
    })
    bar += '</section>'
  } else {
    bar = '<section class="reviewBarItem">' 
    bar += '<h2>Customer Reviews</h2>' + "Be the first to write a review"
    bar += '</section>'
  }
  return bar
}


/* ****************************************
 *  Build review bar on account page
 * ************************************ */
Util.buildAccountReviewBar = async function(data){
  let bar = '<h2>My Reviews</h2>' 
  if(data.length > 0){
    bar += '<ul class="reviewBarAccount">'
    data.forEach(review => {
      bar += '<li>' + 'Reviewed the ' + review.inv_year + ' ' + review.inv_make + ' '
      bar += review.inv_model + ' on ' + review.review_date.toDateString() + ' | '
      bar += '<a href="../review/edit/' + review.review_id + '"> Edit </a> | '
      bar += '<a href="../review/delete/' + review.review_id + '"> Delete </a>'
      bar += '</li>'
    })
    bar += '</ul>'
  } else {
    bar += '<p>You have not submitted any reviews</p>'
  }
  return bar
}


/* **************************************
* Build the review edit view HTML
* ************************************ */

Util.buildReviewEditView = async function(data){
  let detail
  if(data){
    detail = '<h3>Review created on ' + data.review_date.toDateString() + '</h3>'
    detail += '<form id="addReview" action="/review/update" method="post">'
    detail += '<label for="accountFirstname">Screen Name:</label><br>'
    detail += '<input type="text" id="accountFirstname" name="account_firstname" readonly value="' + data.account_firstname + '"><br>'
    detail += '<label for="reviewText">Review:</label><br>'
    detail += '<textarea id="reviewText" name="review_text" rows="4" cols="50">' +data.review_text + '</textarea>'
    detail += '<input type="hidden" name="account_id" value="' + data.account_id + '">'
    detail += '<input type="hidden" name="inv_id" value="' + data.inv_id + '">'
    detail += '<input type="hidden" name="review_id" value="' + data.review_id + '">'
    detail += '<input id="submit" type="submit" value="Update Review">'
  } else {
    detail = '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return detail
}


module.exports = Util