const PaymentDAO = require("../datamodel/paymentdao")

module.exports = class PaymentService
{
    constructor(db)
    {
        this.dao = new PaymentDAO(db)
    }

    isValid(payment)
    {
        if(payment.iduser === null) return false
        if(payment.title === null) return false
        if (payment.price === null) return false
        if (payment.date != null) {
            if (payment.date instanceof String) {
                payment.date = new Date(payment.date)
            }
            if (payment.date >= new Date()) return false
        }
        return true
    }
}