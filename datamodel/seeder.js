const Item = require('./item')
const List = require('./list')

module.exports = (userAccountService, itemService, listService, shareService) => {
    return new Promise(async (resolve, reject) => {
        try {
            await userAccountService.dao.db.query("CREATE TABLE useraccount(id SERIAL PRIMARY KEY, displayname TEXT NOT NULL, login TEXT NOT NULL, challenge TEXT NOT NULL)")
            await listService.dao.db.query("CREATE TABLE list(id SERIAL PRIMARY KEY, iduser INTEGER NOT NULL, shop TEXT NOT NULL, date DATE NOT NULL, archived BOOLEAN NOT NULL, FOREIGN KEY(iduser) REFERENCES useraccount(id) ON DELETE CASCADE)")
            await itemService.dao.db.query("CREATE TABLE item(id SERIAL PRIMARY KEY, idList INTEGER NOT NULL, label TEXT NOT NULL, quantity INTEGER NOT NULL, checked BOOLEAN NOT NULL, FOREIGN KEY(idList) REFERENCES list(id) ON DELETE CASCADE)")
            await shareService.dao.db.query("CREATE TABLE share(id SERIAL PRIMARY KEY, idusersend INTEGER NOT NULL, iduserreceive INTEGER NOT NULL, idlist INTEGER NOT NULL, modification BOOLEAN NOT NULL, FOREIGN KEY(idusersend) REFERENCES useraccount(id) ON DELETE CASCADE, FOREIGN KEY(iduserreceive) REFERENCES useraccount(id) ON DELETE CASCADE)")

            /*const idUser1 = await userAccountService.insert("User1", "user1@example.com", "azerty")
            for (let i = 0; i < 2; i++)
            {
                const idList = await listService.dao.insert(new List("Course" + i, new Date(), idUser1))
                for(let j = 1; j <= 5; j++)
                {
                    await itemService.dao.insert(new Item(idList, "produit" + j, j))
                }
            }

            const idUser2 = await userAccountService.insert("User2", "user2@example.com", "ytreza")
            for (let i = 2; i < 4; i++)
            {
                const idList = await listService.dao.insert(new List("Course" + i, new Date(), idUser2))
                for(let j = 6; j <= 10; j++)
                {
                    await itemService.dao.insert(new Item(idList, "produit" + j, j))
                }
            }*/

            resolve()
        }
        catch (e)
        {
            if (e.code === "42P07")
            {
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