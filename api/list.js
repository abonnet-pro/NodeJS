module.exports = (app, listService, itemService, jwt) =>
{
    app.get("/list/", jwt.validateJWT, async (req, res) => {
        try
        {
            const list = await listService.dao.getAll(req.user)
            if(list === undefined)
            {
                res.status(404).end()
            }
            return res.json(list)
        }
        catch (e) {
            res.status(400).end()
        }
    })

    app.get("/list/archived", jwt.validateJWT,async (req, res) => {
        try
        {
            const list = await listService.dao.getAllArchivedList(req.user)
            if(list === undefined)
            {
                res.status(404).end()
            }
            return res.json(list)
        }
        catch (e) {
            res.status(400).end()
        }
    })

    app.get("/list/:id", jwt.validateJWT,async (req, res) => {
        try
        {
            const list = await listService.dao.getById(req.params.id)
            if(list === undefined)
            {
                res.status(404).end()
            }
            if (list.iduser !== req.user.id) {
                return res.status(403).end()
            }
            return res.json(list)
        }
        catch (e)
        {
            res.status(400).end()
        }
    })

    app.post("/list", jwt.validateJWT,(req, res) => {
        const list = req.body
        if (!listService.isValid(list))
        {
            return res.status(400).end()
        }

        list.idUser = req.user.id
        listService.dao.insert(list)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.delete("/list/:id", jwt.validateJWT, async (req, res) => {
        try
        {
            const list = await listService.dao.getById(req.params.id)
            if (list === undefined)
            {
                return res.status(404).end()
            }
            if (list.iduser !== req.user.id) {
                return res.status(403).end()
            }

            listService.dao.delete(req.params.id)
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

    app.put("/list", jwt.validateJWT, async (req, res) => {
        const list = req.body
        if ((list.id === undefined) || (list.id == null) || (!listService.isValid(list)))
        {
            return res.status(400).end()
        }
        const prevList = await listService.dao.getById(list.id)
        if (prevList === undefined)
        {
            return res.status(404).end()
        }
        if(prevList.iduser !== req.user.id)
        {
            return res.status(403).end()
        }

        listService.dao.update(list)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
}
