const BaseDAO = require('./basedao')

module.exports = class ItemDAO extends BaseDAO
{
    constructor(db)
    {
        super(db, "item")
    }

    insert(item)
    {
        return new Promise((resolve, reject) => {
            this.db.query("INSERT INTO item(idlist, label, quantity, checked) VALUES($1, $2, $3, $4) RETURNING ID", [item.idlist, item.label, item.quantity, item.checked])
                .then(res => resolve(res.rows[0].id))
                .catch(err => reject(err))
        })
    }

    getAll()
    {
        return new Promise((resolve, reject) => {
            this.db.query("SELECT * FROM item")
                .then(res => resolve(res.rows))
                .catch(err => reject(err))
        })
    }

    getAllByList(list)
    {
        return new Promise((resolve, reject) => {
            this.db.query("SELECT * FROM item WHERE item.idlist = $1", [list])
                .then(res => resolve(res.rows))
                .catch(err => reject(err))
        })
    }

    countByList(list)
    {
        return new Promise((resolve, reject) => {
            this.db.query("SELECT count(*) FROM item WHERE item.idlist = $1", [list])
                .then(res => resolve(res.rows[0].count))
                .catch(err => reject(err))
        })
    }

    update(item)
    {
        return this.db.query("UPDATE item SET idlist=$2,label=$3,quantity=$4, checked=$5 WHERE id=$1",
            [item.id, item.idlist, item.label, item.quantity, item.checked])
    }
}