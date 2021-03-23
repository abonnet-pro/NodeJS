const Item = require('./item')

module.exports = (itemService, listService) => {
    return new Promise(async (resolve, reject) => {
        try {
            await listService.dao.db.query("CREATE TABLE list(id SERIAL PRIMARY KEY, shop TEXT NOT NULL, date DATE NOT NULL, archived BOOLEAN NOT NULL)")
            await itemService.dao.db.query("CREATE TABLE item(id SERIAL PRIMARY KEY, idList INTEGER NOT NULL, label TEXT NOT NULL, quantity INTEGER NOT NULL, checked BOOLEAN NOT NULL, FOREIGN KEY(idList) REFERENCES list(id))")
            // INSERTs


            resolve()
        } catch (e) {
            if (e.code === "42P07") { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
                resolve()
            } else {
                reject(e)
            }
            return
        }
    })
}