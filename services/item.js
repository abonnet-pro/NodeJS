const ItemDAO = require("../datamodel/itemdao")

module.exports = class ItemService
{
    constructor(db)
    {
        this.dao = new ItemDAO(db)
    }
}