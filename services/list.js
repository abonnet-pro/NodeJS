const ListDAO = require("../datamodel/listdao")

module.exports = class ListService
{
    constructor(db)
    {
        this.dao = new ListDAO(db)
    }

    isValid(list) {
        list.shop = list.shop.trim()
        if (list.shop === "") return false
        if(list.archived == null) return false
        if (list.builddate != null) {
            if (list.builddate instanceof String) {
                list.builddate = new Date(list.builddate)
            }
            if (list.builddate >= new Date()) return false
        }
        return true
    }


}