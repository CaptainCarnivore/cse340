// Needed resources

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

/* ***************************
 *  Build add management view
 * ************************** */

invCont.buildManagement = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Addition Management",
    nav,
    errors: null
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

/* ***************************
 *  Build add invetory view
 * ************************** */

invCont.buildAddInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  let selectList = await utilities.getClassSelect()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    selectList,
    errors: null
  })
}

/* ***************************
 *  Process Add classification
 * ************************** */

invCont.addClassification = async function(req, res, next) {
  
  const { classification_name } = req.body
  const addClassResult = await invModel.addClassification(classification_name)
  let nav = await utilities.getNav()
  if (addClassResult) {
    req.flash(
      "notice",
      'Congratulations! New Classification type added!'
    )
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the new classification failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Process Add inventory
 * ************************** */

invCont.addInventory = async function(req, res, next) {
 
  let selectList = await utilities.getClassSelect()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  
  const addInvResult = await invModel.addInventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, 
  classification_id)
 
  let nav = await utilities.getNav()
  if (addInvResult) {
    req.flash(
      "notice",
      'Congratulations! New inventory item added!'
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the new inventory item failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      selectList,
      errors: null,
    })
  }
}


module.exports = invCont