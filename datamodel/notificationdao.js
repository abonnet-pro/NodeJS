const BaseDAO = require('./basedao')

module.exports = class NotificationDAO extends BaseDAO
{
    constructor(db)
    {
        super(db, "notification")
    }

    insert(notification)
    {
        return new Promise((resolve, reject) => {
            this.db.query("INSERT INTO notification(idusersend, iduserreceive, title, message, date, read) VALUES($1, $2, $3, $4, $5, $6) RETURNING ID", [notification.idusersend ,notification.iduserreceive, notification.title, notification.message, notification.date, notification.read])
                .then(res => resolve(res.rows[0].id))
                .catch(err => reject(err))
        })
    }

    getNotificationsByLogin(login)
    {
        return new Promise((resolve, reject) => {
            this.db.query("SELECT notification.* FROM notification INNER JOIN useraccount on notification.iduserreceive = useraccount.id WHERE useraccount.login = $1 AND read = false ORDER BY id DESC", [login])
                .then(res => resolve(res.rows))
                .catch(err => reject(err))
        })
    }

    update(notification)
    {
        return this.db.query("UPDATE notification SET idusersend=$2, iduserreceive=$3, title=$4, message=$5, date=$6, read=$7 WHERE id=$1",
            [notification.id, notification.idusersend, notification.iduserreceive, notification.title, notification.message, notification.date, notification.read])
    }
}