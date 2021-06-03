const NotificationDAO = require("../datamodel/notificationdao")
const notifier = require('node-notifier')

module.exports = class NotificationService
{
    constructor(db)
    {
        this.dao = new NotificationDAO(db)
    }

    isValid(notification)
    {
        if (notification.idusersend === null) return false
        if(notification.iduserreceive === null) return false
        if (notification.message === null) return false
        if (notification.title === null) return false
        if (notification.date != null) {
            if (notification.date instanceof String) {
                notification.date = new Date(notification.date)
            }
            if (notification.date >= new Date()) return false
        }
        return true
    }

    sendNotification(notification)
    {
        notifier.notify({
            title: notification.title,
            message: notification.message,
            sound: false,
            wait : false,
            actions: ['OK', 'ANNULER']
        },
            async function (err, response, metadata) {
                if(response === "ok")
                {
                    notification.read = true
                    console.log(notification)
                    console.log(this.dao)
                    await this.dao.update(notification)
                }
            })
    }
}