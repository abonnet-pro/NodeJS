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

    async isListShare(list, userId)
    {
        const shares = await this.dao.getShareReceiveBySend(list.iduser, userId)

        return shares.length === 0;
    }
}