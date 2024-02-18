const pool = require("../database/")

/* ***************************
 *  Get reviews by account
 * ************************** */

async function getReviewByAccountId(account_id){
    try {
        const data = await pool.query(
          `SELECT review_id, review_text, review_date, i.inv_id, inv_make, inv_model, inv_year, a.account_id, account_firstname, account_lastname, account_email
          FROM public.review AS r 
                    INNER JOIN
                    public.account AS a
                    ON r.account_id = a.account_id 
                    INNER JOIN
                    public.inventory AS i
                    ON r.inv_id = i.inv_id
          WHERE r.account_id = $1`,
          [account_id]
        )
        return data.rows
      } catch (error) {
        console.error("getreviewbyaccountid error " + error)
      }
}

/* ***************************
 *  Get reviews by inventory
 * ************************** */

async function getReviewByInvId(inv_id){
    try {
        const data = await pool.query(
          `SELECT review_id, review_text, review_date, i.inv_id, inv_make, inv_model, inv_year, a.account_id, account_firstname, account_lastname, account_email
          FROM public.review AS r 
                    INNER JOIN
                    public.account AS a
                    ON r.account_id = a.account_id 
                    INNER JOIN
                    public.inventory AS i
                    ON r.inv_id = i.inv_id 
          WHERE r.inv_id = $1`,
          [inv_id]
        )
        return data.rows
      } catch (error) {
        console.error("getreviewbyinventoryid error " + error)
      }
}

/* ***************************
 *  Get review by review id
 * ************************** */

async function getReviewByReviewId(review_id){
    try {
        const data = await pool.query(
          `SELECT review_id, review_text, review_date, i.inv_id, inv_make, inv_model, inv_year, a.account_id, account_firstname, account_lastname, account_email
          FROM public.review AS r 
                    INNER JOIN
                    public.account AS a
                    ON r.account_id = a.account_id 
                    INNER JOIN
                    public.inventory AS i
                    ON r.inv_id = i.inv_id
                    WHERE r.review_id = $1`,
          [review_id]
        )
        return data.rows
      } catch (error) {
        console.error("getreviewbyaccountid error " + error)
      }
}

/* ***************************
 *  Add new review
 * ************************** */

async function addReview(review_text, inv_id, account_id) {
    try {
        const sql = "INSERT INTO public.review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
        return await pool.query(sql, [review_text, inv_id, account_id])
    } catch (error) {
        console.log(error.message)
        return error.message
      }
}

/* ***************************
 *  Update Review Data
 * ************************** */

async function updateReview(
  review_id,
  review_text
) {
  try {
    const sql = "UPDATE public.review SET review_text = $1 WHERE review_id = $2 RETURNING *"
    const data = await pool.query(sql, [review_text, review_id])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteReview(
  review_id
) {
  try {
    const sql = 'DELETE FROM review WHERE review_id = $1'
    const data = await pool.query(sql, [review_id])
  return data
  } catch (error) {
    new Error("Delete Review Error")
  }
}

module.exports = {getReviewByInvId, getReviewByAccountId, getReviewByReviewId, addReview, updateReview, deleteReview}