module.exports = (app, listService, itemService) =>
{
    app.get("/list", async (req, res) => {
        res.json(await listService.dao.getAll())
    })

    app.get("/list/:id", async (req, res) => {
        try
        {
            const list = await listService.dao.getById(req.params.id)
            if(list === undefined)
            {
                res.status(404).end() // aucun resultat
            }
            return res.json(list) // ok
        }
        catch (e) {
            res.status(400).end() // requete incorrect (parametres)
        }
    })

    app.post("/list", (req, res) => {
        const list = req.body
        if (!listService.isValid(list))
        {
            return res.status(400).end()
        }
        listService.dao.insert(list)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.delete("/list/:id", async (req, res) => {
        try
        {
            const count = await itemService.dao.countByList(req.params.id)
            if(count > 0)
            {
                return res.status(500).end()
            }

            const list = await listService.dao.getById(req.params.id)
            if (list === undefined)
            {
                return res.status(404).end()
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

    app.put("/list", async (req, res) => {
        const list = req.body
        if ((list.id === undefined) || (list.id == null) || (!listService.isValid(list)))
        {
            return res.status(400).end()
        }
        if (await listService.dao.getById(list.id) === undefined)
        {
            return res.status(404).end()
        }
        listService.dao.update(list)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
}
