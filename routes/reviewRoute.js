// Needed Resources 
const express = require("express")
const router = new express.Router()
const revController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const revValidate = require("../utilities/review-validate")

// Route to add review
router.post("/add_review", utilities.handleErrors(revController.addReview))

// Route to build review edit view
router.get("/edit/:review_id", utilities.checkLogin, utilities.handleErrors(revValidate.checkCorrectAccount), utilities.handleErrors(revController.buildEditReview))

// Route to update review (add validates!!)
router.post("/update/", utilities.handleErrors(revController.updateReview))

// Delete
router.get("/delete/:review_id", utilities.handleErrors(revController.buildDelete))
router.post("/delete/", utilities.handleErrors(revController.deleteReview))

module.exports = router;