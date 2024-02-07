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
router.get("/management", utilities.handleErrors(invController.buildManagement));
// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
// Route to add new classification
router.post("/add-classification", classValidate.classNameRules(),
classValidate.checkClassData,
utilities.handleErrors(invController.addClassification))

//Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

//Route to add new inventory
router.post("/add-inventory", invValidate.invDataRules(), invValidate.checkInvData, utilities.handleErrors(invController.addInventory));

module.exports = router;