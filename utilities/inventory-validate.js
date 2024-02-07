const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

validate.invDataRules = () => {
    return [
        body("inv_model").isAlpha('en-US', {ignore: ' '})
            .trim()
            .custom(async (inv_model) => {
                const invExists = await invModel.checkExistingInventory(inv_model)
                if (invExists){
                    throw new Error("There is already an inventory item with that model! Please use a vehicle with a model that does not already exist in the database.")
                }
            })
            .custom(async (inv_model) => {
                const checkAlphaNum = new RegExp("^[a-zA-Z0-9]*$")
                if (!inv_model.match(checkAlphaNum)) {
                    throw new Error("Please keep the vehicle model to alphanumeric (Aa-Zz, 0-9) only!")
                }
            }),
        body("inv_make").trim().custom(async (inv_make) => {
            const checkAlphaNum = new RegExp("^[a-zA-Z0-9]*$")
            if (!inv_make.match(checkAlphaNum)) {
                throw new Error("Please keep the vehicle make to alphanumeric (Aa-Zz, 0-9) only!")
            }
        }),
        body("inv_year").trim().custom(async (inv_year) => {
            const checkNum = new RegExp("^[0-9]*$")
            if (!inv_year.match(checkNum)) {
                throw new Error("Please keep the vehicle year to numeric (0-9) only!")
            }
        }),
        body("inv_description").trim(),
        body("inv_price").trim().custom(async (inv_price) => {
            const checkNum = new RegExp("^[0-9]*$")
            if (!inv_price.match(checkNum)) {
                throw new Error("Please keep the vehicle price to numeric (0-9) only!")
            }
        }),
        body("inv_miles").trim().custom(async (inv_miles) => {
            const checkNum = new RegExp("^[0-9]*$")
            if (!inv_miles.match(checkNum)) {
                throw new Error("Please keep the vehicle mileage to numeric (0-9) only!")
            }
        }),
        body("inv_color").trim().custom(async (inv_color) => {
            const checkAlphaNum = new RegExp("^[a-zA-Z0-9]*$")
            if (!inv_color.match(checkAlphaNum)) {
                throw new Error("Please keep the vehicle color to alphanumeric (Aa-Zz, 0-9) only!")
            }
        })

    ]
}

validate.checkInvData = async (req, res, next) => {
    const {  inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let selectList = await utilities.getClassSelect()
        res.render("inventory/add-inventory", {
            errors, title: "Add inventory",
            nav,
            inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, selectList
        })
        return
    }
    next();
}

module.exports = validate