// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/classification-validate")
const invValidate = require("../utilities/inventory-validate")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by classification view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build inventory management view
router.get("/", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));
// Route to build add classification view
router.get("/add-classification", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));
// Route to add new classification
router.post("/add-classification", classValidate.classNameRules(),
classValidate.checkClassData,
utilities.handleErrors(invController.addClassification))

//Route to build add inventory view
router.get("/add-inventory", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));

//Route to add new inventory
router.post("/add-inventory", invValidate.invDataRules(), invValidate.checkInvData, utilities.handleErrors(invController.addInventory));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to update inventory item
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildUpdateInventory));
// Process update
router.post("/update/", invValidate.invDataRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory))
// Delete
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildDelete))
router.post("/delete/", utilities.handleErrors(invController.deleteInventory))




module.exports = router;