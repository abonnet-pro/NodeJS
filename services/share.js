const ShareDAO = require("../datamodel/sharedao")

module.exports = class ShareService
{
    constructor(db)
    {
        this.dao = new ShareDAO(db)
    }

    isValid(share)
    {
        if (share.idusersend === null) return false
        if(share.iduserreceive === null) return false
        if (share.idlist === null) return false
        if (share.modification === null) return false
        return true
    }
}