// Needed resources

const invModel = require("../models/inventory-model")
const revModel = require("../models/review-model")
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
  const barData = await revModel.getReviewByInvId(inventory_id)
  const bar = await utilities.buildItemReviewBar(barData)
  let nav = await utilities.getNav()
  const className = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
  res.render("./inventory/detail", {
    title: className,
    nav,
    detail,
    bar,
    hiddenInvId: data[0].inv_id,
    errors: null
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
  const selectList = await utilities.getClassSelect()
  res.render("./inventory/management", {
    title: "Addition Management",
    nav,
    selectList,
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
 *  Build add inventory view
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
      selectList,
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


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build update inventory view
 * ************************** */

invCont.buildUpdateInventory = async function(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  console.log(req)
  const itemDataOrig = await invModel.getItemByInventoryId(inv_id)
  const itemData = itemDataOrig[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
 
  let selectList = await utilities.getClassSelect(itemData.classification_id)

  res.render("./inventory/edit-inventory", {
    title: "Edit Inventory: " + itemName,
    nav,
    selectList,
    
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )
  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const selectList = await utilities.getClassSelect()
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    selectList,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete confirm inventory view
 * ************************** */

invCont.buildDelete = async function(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  console.log(req)
  const itemDataOrig = await invModel.getItemByInventoryId(inv_id)
  const itemData = itemDataOrig[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete: " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.deleteInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )
  if (updateResult) {
    req.flash("notice", `The vehicle was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const selectList = await utilities.getClassSelect()
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    selectList,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


module.exports = invCont