const BaseDAO = require('./basedao')

module.exports = class ShareDAO extends BaseDAO
{
    constructor(db)
    {
        super(db, "share")
    }

    insert(share)
    {
        return new Promise((resolve, reject) => {
            this.db.query("INSERT INTO share(idusersend, iduserreceive, idlist, modification) VALUES($1, $2, $3, $4) RETURNING ID", [share.idusersend ,share.iduserreceive, share.idlist, share.modification])
                .then(res => resolve(res.rows[0].id))
                .catch(err => reject(err))
        })
    }

    getShareSend(idusersend)
    {
        return new Promise((resolve, reject) => {
            this.db.query("SELECT * FROM share WHERE idusersend = $1", [idusersend])
                .then(res => resolve(res.rows))
                .catch(err => reject(err))
        })
    }

    getShareReceiveBySend(idusersend ,iduserreceive)
    {
        return new Promise((resolve, reject) => {
            this.db.query("SELECT * FROM share WHERE idusersend = $1 AND iduserreceive = $2", [idusersend, iduserreceive])
                .then(res => resolve(res.rows))
                .catch(err => reject(err))
        })
    }

    getShareReceive(iduserreceive)
    {
        return new Promise((resolve, reject) => {
            this.db.query("SELECT * FROM share WHERE iduserreceive = $1", [iduserreceive])
                .then(res => resolve(res.rows))
                .catch(err => reject(err))
        })
    }

    getShareSendByList(idusersend, idlist)
    {
        return new Promise((resolve, reject) => {
            this.db.query("SELECT * FROM share WHERE idlist = $1", [idlist])
                .then(res => resolve(res.rows))
                .catch(err => reject(err))
        })
    }

    checkShareExist(idusersend, iduserreceive, idlist)
    {
        return new Promise((resolve, reject) => {
            this.db.query("SELECT * FROM share WHERE idusersend = $1 AND iduserreceive = $2 AND idlist = $3", [idusersend, iduserreceive, idlist])
                .then(res => resolve(res.rows))
                .catch(err => reject(err))
        })
    }
}