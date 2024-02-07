const utilities = require(".")
const { body, validationResult} = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

validate.classNameRules = () => {
    return [
        body("classification_name").isAlpha('en-US', {ignore: ' '})
            .trim()
            .custom(async (classifcation_name) => {
                const classExists = await invModel.checkExistingClassification(classifcation_name)
                if (classExists){
                    throw new Error("There is already a classification with that name! Please use a classification that does not already exist.")
                }
            })
            .custom(async (classifcation_name) => {
                const checkAlpha = new RegExp("^[a-zA-Z]*$")
                if (!classifcation_name.match(checkAlpha)) {
                    throw new Error("Please keep the classification name to alphabetical characters only!")
                }
            })
    ]
}

/* ******************************
 * Check data and return errors or continue to adding classification
 * ***************************** */

validate.checkClassData = async (req, res, next) => {
    const {classifcation_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classifcation_name
        })
        return
    }
    next()
}

module.exports = validate