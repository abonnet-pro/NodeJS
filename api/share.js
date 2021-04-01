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
}
