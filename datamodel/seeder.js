const Item = require('./item')
const List = require('./list')

module.exports = (itemService, listService) => {
    return new Promise(async (resolve, reject) => {
        try {
            await listService.dao.db.query("CREATE TABLE list(id SERIAL PRIMARY KEY, shop TEXT NOT NULL, date DATE NOT NULL, archived BOOLEAN NOT NULL)")
            await itemService.dao.db.query("CREATE TABLE item(id SERIAL PRIMARY KEY, idList INTEGER NOT NULL, label TEXT NOT NULL, quantity INTEGER NOT NULL, checked BOOLEAN NOT NULL, FOREIGN KEY(idList) REFERENCES list(id))")

            for (let i = 0; i < 2; i++) {
                const idList = await listService.dao.insert(new List("Course" + i, new Date()))
                for(let j = 1; j <= 5; j++)
                {
                    await itemService.dao.insert(new Item(idList, "produit" + j, j))
                }
            }
            resolve()
        }
        catch (e)
        {
            if (e.code === "42P07")
            { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
                resolve()
            }
            else
            {
                reject(e)
            }
            return
        }
    })
}