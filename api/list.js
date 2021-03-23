module.exports = (app, listService) =>
{
    app.get("/list", async (req, res) => {
        res.json(await listService.dao.getAll(req.user))
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
}
