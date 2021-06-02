module.exports = (app, notificationService, roleService, jwt) =>
{
    app.post("/notification", jwt.validateJWT,(req, res) => {
        const notification = req.body
        notification.idusersend = req.user.id
        if (!notificationService.isValid(notification))
        {
            return res.status(400).end()
        }

        if(!roleService.isAdmin(req.user.login))
        {
            return res.status(401).end()
        }

        notificationService.sendNotification(notification)

        notificationService.dao.insert(notification)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.post("/notification/reload", jwt.validateJWT, async (req, res) => {
        const notification = req.body

        if(notification.iduserreceive !== req.user.id)
        {
            return res.status(401).end()
        }

        try
        {
            await notificationService.sendNotification(notification)
            res.status(200).end()
        }
        catch(e)
        {
            console.log(e)
            res.status(500).end()
        }
    })

    app.get("/notification/available/:login", jwt.validateJWT, async (req, res) => {
        try
        {
            const notifications = await notificationService.dao.getNotificationsByLogin(req.params.login)
            if(notifications === undefined)
            {
                res.status(404).end()
            }
            return res.json(notifications)
        }
        catch (e)
        {
            res.status(400).end()
        }
    })
}
