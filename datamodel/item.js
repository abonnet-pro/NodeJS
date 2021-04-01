module.exports = class Item
{
    constructor(idList, label, quantity)
    {
        this.idList = idList
        this.id = null
        this.label = label
        this.quantity = quantity
        this.checked = false
    }
}