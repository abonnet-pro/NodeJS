const ListDAO = require("../datamodel/listdao")

module.exports = class ListService
{
    constructor(db)
    {
        this.dao = new ListDAO(db)
    }
}