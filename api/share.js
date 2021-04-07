module.exports = (app, shareService, jwt) =>
{
    app.post("/share", jwt.validateJWT,(req, res) => {
        const share = req.body
        console.log(share)
        share.idusersend = req.user.id
        if (!shareService.isValid(share))
        {
            return res.status(400).end()
        }

        shareService.dao.insert(share)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.get("/share/:id", jwt.validateJWT, async (req, res) => {
        try
        {
            const share = await shareService.dao.getById(req.params.id)
            if(share === undefined)
            {
                res.status(404).end()
            }
            if (share.idusersend !== req.user.id && !await shareService.isListShare(share.idusersend, req.user.id)) {
                return res.status(403).end()
            }
            return res.json(share)
        }
        catch (e)
        {
            res.status(400).end()
        }
    })

    app.get("/share/send/:id", jwt.validateJWT,async (req, res) => {
        try
        {
            const shares = await shareService.dao.getShareSendByList(req.user.id, req.params.id)
            if(shares === undefined)
            {
                res.status(404).end()
            }
            return res.json(shares)
        }
        catch (e) {
            res.status(400).end()
        }
    })

    app.get("/share/check/:idreceive/:idlist", jwt.validateJWT,async (req, res) => {
        try
        {
            const shares = await shareService.dao.checkShareExist(req.user.id, req.params.idreceive, req.params.idlist)
            if(shares === undefined)
            {
                res.status(404).end()
            }
            return res.json(shares)
        }
        catch (e) {
            res.status(400).end()
        }
    })

    app.delete("/share/:id", jwt.validateJWT, async (req, res) => {
        try
        {
            const share = await shareService.dao.getById(req.params.id)
            if (share === undefined)
            {
                return res.status(404).end()
            }

            if (share.idusersend !== req.user.id && !await shareService.isListShare(share.idusersend, req.user.id)) {
                return res.status(403).end()
            }
            shareService.dao.delete(req.params.id)
                .then(res.status(200).end())
                .catch(e => {
                    console.log(e)
                    res.status(500).end()
                })
        }
        catch(e)
        {
            console.log(e)
            return res.status(400).end()
        }
    })
}
