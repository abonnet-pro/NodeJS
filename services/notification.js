const NotificationDAO = require("../datamodel/notificationdao")
const Notification = require("../datamodel/notification")
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

    insertWelcomeNotification(iduserreceive)
    {
        let notification = new Notification()
        notification.idusersend = 1
        notification.iduserreceive = iduserreceive
        notification.title = "Bienvenue !"
        notification.message = "Bonjour, nous vous remercions d'avoir rejoint la plateforme. Nous esperons que votre expérience sera agréable !"
        notification.date = new Date()
        notification.read = false

        return this.dao.insert(notification)
    }

    async insertShareNotification(iduserreceive, shop, user)
    {
        let notification = new Notification()
        notification.idusersend = 1
        notification.iduserreceive = iduserreceive
        notification.title = "Liste modifié !"
        notification.message = `Bonjour, votre liste partagé ${shop} a été modifié par ${user}`
        notification.date = new Date()
        notification.read = false

        return this.dao.insert(notification)
    }

    async insertExpireListNotification(iduserreceive, list)
    {
        let notification = new Notification()
        notification.idusersend = 1
        notification.iduserreceive = iduserreceive
        notification.title = "Liste périmé !"
        notification.message = `Bonjour, votre liste ${list.shop} est arrivé à expiration. Vous pouvez l'archiver ou la supprimé`
        notification.date = new Date()
        notification.read = false

        return this.dao.insert(notification)
    }

    async checkNotificationShareExist(iduserreceive)
    {
        return await this.dao.checkNotificationShareExist(iduserreceive) > 0
    }
}