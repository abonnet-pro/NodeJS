const BaseDAO = require('./basedao')

module.exports = class PaymentDAO extends BaseDAO
{
    constructor(db)
    {
        super(db, "payment")
    }

    insert(iduser, title, price, date)
    {
        return new Promise((resolve, reject) => {
            this.db.query("INSERT INTO payment(iduser, title, price, date) VALUES($1, $2, $3, $4) RETURNING ID", [iduser, title, price, date])
                .then(res => resolve(res.rows[0].id))
                .catch(err => reject(err))
        })
    }
}