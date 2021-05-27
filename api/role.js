module.exports = (app, svc, jwt) => {
    app.get("/role/roles/:login", jwt.validateJWT, async (req, res) => {
        try
        {
            const roles = await svc.dao.getRolesByLogin(req.params.login)
            if(roles === undefined)
            {
                res.status(404).end()
            }
            return res.json(roles)
        }
        catch(e)
        {
            res.status(400).end()
        }
    })


}