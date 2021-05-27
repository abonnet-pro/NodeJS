const Item = require('./item')
const List = require('./list')
const UserAccount = require('./useraccount')
const Role = require('./role')

module.exports = (userAccountService, itemService, listService, shareService, roleService) => {
    return new Promise(async (resolve, reject) => {
        try {
            await userAccountService.dao.db.query("CREATE TABLE useraccount(id SERIAL PRIMARY KEY, displayname TEXT NOT NULL, login TEXT NOT NULL, challenge TEXT NOT NULL, active BOOLEAN NOT NULL, confirmation TEXT, confirmationdate TIMESTAMPTZ, reset TEXT, resetdate TIMESTAMPTZ)")
            await listService.dao.db.query("CREATE TABLE list(id SERIAL PRIMARY KEY, iduser INTEGER NOT NULL, shop TEXT NOT NULL, date DATE NOT NULL, archived BOOLEAN NOT NULL, FOREIGN KEY(iduser) REFERENCES useraccount(id) ON DELETE CASCADE)")
            await itemService.dao.db.query("CREATE TABLE item(id SERIAL PRIMARY KEY, idList INTEGER NOT NULL, label TEXT NOT NULL, quantity INTEGER NOT NULL, checked BOOLEAN NOT NULL, FOREIGN KEY(idList) REFERENCES list(id) ON DELETE CASCADE)")
            await shareService.dao.db.query("CREATE TABLE share(id SERIAL PRIMARY KEY, idusersend INTEGER NOT NULL, iduserreceive INTEGER NOT NULL, idlist INTEGER NOT NULL, modification BOOLEAN NOT NULL, FOREIGN KEY(idusersend) REFERENCES useraccount(id) ON DELETE CASCADE, FOREIGN KEY(iduserreceive) REFERENCES useraccount(id) ON DELETE CASCADE)")
            await roleService.dao.db.query("CREATE TABLE role(id SERIAL PRIMARY KEY, iduser INTEGER NOT NULL, role TEXT NOT NULL, FOREIGN KEY(iduser) REFERENCES useraccount(id))")

            const idUser = await userAccountService.dao.insert(new UserAccount("User1", "anthony.bonnet1@orange.fr", userAccountService.hashPassword("1401"), true, null, null))
            const idRole = await roleService.dao.insert(new Role(idUser, "ADMIN"))

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