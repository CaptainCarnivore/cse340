// Needed resources

const revModel = require("../models/review-model")
const utilities = require("../utilities/")

const revCont = {}

/* ***************************
 *  Process Add review
 * ************************** */

revCont.addReview = async function (req, res, next) {
    const {review_text, inv_id, account_id} = req.body
    const addRevResult = await revModel.addReview(review_text, inv_id, account_id)
    let nav = await utilities.getNav()
    if (addRevResult) {
        req.flash(
            "notice",
            'Congratulations! Your review has been submitted!'
        )
        const urlString = "/inv/detail/" + inv_id
        res.redirect(urlString)
    }
}

/* ***************************
 *  Build edit review view
 * ************************** */

revCont.buildEditReview = async function(req, res, next) {
    const review_id = parseInt(req.params.review_id)
    const data = await revModel.getReviewByReviewId(review_id)
    if (data.length > 0) {
        const detail = await utilities.buildReviewEditView(data[0])
        let nav = await utilities.getNav()
        const className = "Edit Review for: " + data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
        res.render("./review/edit-review", {
            title: className,
            nav,
            detail,
            errors: null
        })
    } else {
        const err = new Error("Sorry, we appear to have lost that page.");
        err.status = 404;
        next(err);}
}

/* ***************************
 *  Update Review Data
 * ************************** */

revCont.updateReview = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        review_id,
        review_text
    } = req.body
    const updateResult = await revModel.updateReview(
        review_id,
        review_text
    )
    if (updateResult) {
        const review = await revModel.getReviewByReviewId(review_id)
        const reviewName = review[0].inv_year + ' ' + review[0].inv_make + " " + review[0].inv_model
        req.flash("notice", `Your review for the ${reviewName} was successfully updated.`)
        res.redirect("/account/")
      } else {

      }
}

/* ***************************
 *  Build delete confirm inventory view
 * ************************** */

revCont.buildDelete = async function(req, res, next)  {
    const review_id = parseInt(req.params.review_id)
    let nav = await utilities.getNav()
    console.log(req)
    const reviewDataOrig = await revModel.getReviewByReviewId(review_id)
    const reviewData = reviewDataOrig[0]
    const reviewName = "Review for: " + reviewData.inv_year + " " + reviewData.inv_make + " " + reviewData.inv_model
    res.render("./review/delete-review", {
      title: "Delete " + reviewName,
      nav,
      errors: null,
      account_firstname: reviewData.account_firstname,
      review_text: reviewData.review_text,
      review_id: reviewData.review_id,
    })
  }

/* ***************************
 *  Delete Review Data
 * ************************** */

revCont.deleteReview = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {account_firstname, review_text, review_id} = req.body
    const updateResult = await revModel.deleteReview(review_id)
    if (updateResult) {
        req.flash("notice", `The review was successfully deleted.`)
        res.redirect("/account/")
    } else {
        const reviewDataOrig = await revModel.getReviewByReviewId(review_id)
        const reviewData = reviewDataOrig[0]
        const reviewName = "Review for: " + reviewData.inv_year + " " + reviewData.inv_make + " " + reviewData.inv_model
        req.flash("notice", "Sorry, the deletion failed.")
        res.status(501).res.render("./review/delete-review", {
            title: "Delete " + reviewName,
            nav,
            errors: null,
            account_firstname: reviewData.account_firstname,
            review_text: reviewData.review_text,
            review_id: reviewData.review_id,
          })
    }
}

module.exports = revCont