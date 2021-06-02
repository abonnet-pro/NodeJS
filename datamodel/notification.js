module.exports = class Notification
{
    constructor(idusersend, iduserreceive, title, message, date)
    {
        this.id = null
        this.idusersend = idusersend
        this.iduserreceive = iduserreceive
        this.title = title
        this.message = message
        this.date = date
    }
}