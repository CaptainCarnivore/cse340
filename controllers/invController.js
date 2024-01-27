const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  console.log(classification_id)
  const data = await invModel.getInventoryByClassificationId(classification_id)
  if (data.length > 0) {
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
} else {
  const err = new Error("Sorry, we appear to have lost that page.");
  err.status = 404;
  next(err);
}}

/* ***************************
 *  Build inventory item detail by inv id
 * ************************** */
invCont.buildByInventoryId = async function(req, res, next) {
  const inventory_id = req.params.invId
  const data = await invModel.getItemByInventoryId(inventory_id)
  if (data.length > 0) {
  const detail = await utilities.buildItemDetailView(data[0])
  let nav = await utilities.getNav()
  const className = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
  res.render("./inventory/detail", {
    title: className,
    nav,
    detail,
  })
} else {
  const err = new Error("Sorry, we appear to have lost that page.");
  err.status = 404;
  next(err);
}}

module.exports = invCont