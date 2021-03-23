const BaseDAO = require('./basedao')

module.exports = class ItemDAO extends BaseDAO
{
    constructor(db)
    {
        super(db, "item")
    }
}