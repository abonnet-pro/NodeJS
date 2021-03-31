module.exports = (app, itemService, listService, jwt) =>
{
    app.get("/item", jwt.validateJWT, async (req, res) => {
        res.json(await itemService.dao.getAll())
    })

    app.get("/item/:id", jwt.validateJWT, async (req, res) => {
        try
        {
            const item = await itemService.dao.getById(req.params.id)

            if(item === undefined)
            {
                res.status(404).end() // aucun resultat
            }
            const list = await listService.dao.getById(item.idlist)
            if (list.iduser !== req.user.id) {
                return res.status(403).end()
            }
            return res.json(item) // ok
        }
        catch (e) {
            res.status(400).end() // requete incorrect (parametres)
        }
    })

    app.get("/item/list/:id", jwt.validateJWT, async (req, res) => {
        try
        {
            const item = await itemService.dao.getAllByList(req.params.id)
            if(item === undefined)
            {
                res.status(404).end()
            }
            const list = await listService.dao.getById(item[0].idlist)
            if (list.iduser !== req.user.id) {
                return res.status(403).end()
            }
            return res.json(item)
        }
        catch (e) {
            res.status(400).end()
        }
    })

    app.post("/item", jwt.validateJWT, async (req, res) => {
        const item = req.body
        if (!itemService.isValid(item))
        {
            return res.status(400).end()
        }
        const list = await listService.dao.getById(item.idList)
        if (list.iduser !== req.user.id) {
            return res.status(403).end()
        }
        itemService.dao.insert(item)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.delete("/item/:id", jwt.validateJWT, async (req, res) => {
        try
        {
            const item = await itemService.dao.getById(req.params.id)
            if (item === undefined)
            {
                return res.status(404).end()
            }
            const list = await listService.dao.getById(item.idlist)
            if (list.iduser !== req.user.id) {
                return res.status(403).end()
            }
            itemService.dao.delete(req.params.id)
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

    app.put("/item", jwt.validateJWT,async (req, res) => {
        const item = req.body
        if ((item.id === undefined) || (item.id == null) || (!itemService.isValid(item)))
        {
            return res.status(400).end()
        }
        if (await itemService.dao.getById(item.id) === undefined)
        {
            return res.status(404).end()
        }
        const list = await listService.dao.getById(item.idlist)
        if (list.iduser !== req.user.id) {
            return res.status(403).end()
        }
        itemService.dao.update(item)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
}