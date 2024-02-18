const utilities = require(".")
const { body, validationResult } = require("express-validator")
const revModel = require("../models/review-model")
const validate = {}


validate.checkCorrectAccount = async function(req, res, next) {
    const review_id = parseInt(req.params.review_id)
    const review = await revModel.getReviewByReviewId(review_id)
    if(review.length > 0){
      if (res.locals.accountData.account_id == review[0].account_id)
      {
        next()
      }
      else {
        req.flash("notice", "You are not authorized to view that page.")
        return res.redirect("/")
      }
  } else {
    const err = new Error("Sorry, we appear to have lost that page.");
    err.status = 404;
    next(err);
  }
}

module.exports = validate