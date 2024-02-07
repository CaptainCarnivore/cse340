const invModel = require("../models/inventory-model")
const Util = {}



/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the item detail view HTML
* ************************************ */

Util.buildItemDetailView = async function(data){
  let detail
  if(data){
    detail = '<section id="vehicle">'
    detail += '<div id="vehicleImg">'
    detail += '<img id="vehImg" src="' + data.inv_image + '" alt="Image of ' + data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model
    + '">' 
    detail += '</div>'
    detail += '<div id="vehicleDetails">'
    detail += '<div id="vehicleStats"><h3>$' + data.inv_price + ' | ' + data.inv_miles.toLocaleString() + ' Miles</h3>'
    + '</div>'
    detail += '<div id="vehicleDescription">' + '<h4>' + data.inv_color + ' ' + data.classification_name + '</h4>'
    + data.inv_description
    + '</div>'

    detail += '</div>'
    detail += '</section>'
  } else {
    detail += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return detail
}

/* ************************
 * Constructs the Select Classification for Add Inventory
 ************************** */
Util.getClassSelect = async function (req, res, next) {
  let selData = await invModel.getClassifications()
  let selList = "<select id='invClassification' name='classification_id' >"
  selData.rows.forEach((row) => {
    selList += "<option value='" + row.classification_id + "'>" + row.classification_name + "</option>"
  })
  selList += "</select>"
  return selList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util