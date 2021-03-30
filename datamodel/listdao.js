const BaseDAO = require('./basedao')

module.exports = class ListDAO extends BaseDAO
{
    constructor(db)
    {
        super(db, "list")
    }

    insert(list)
    {
        return new Promise((resolve, reject) => {
            this.db.query("INSERT INTO list(iduser, shop, date, archived) VALUES($1, $2, $3, $4) RETURNING ID", [list.idUser ,list.shop, list.date, list.archived])
                .then(res => resolve(res.rows[0].id))
                .catch(err => reject(err))
        })
    }

    getAll(user)
    {
        return new Promise((resolve, reject) => {
            this.db.query("SELECT * FROM list WHERE iduser = $1 AND archived = false", [user.id])
                .then(res => resolve(res.rows))
                .catch(err => reject(err))
        })
    }

    getAllArchivedList(user)
    {
        return new Promise((resolve, reject) => {
            this.db.query("SELECT * FROM list WHERE iduser = $1 AND archived = true", [user.id])
                .then(res => resolve(res.rows))
                .catch(err => reject(err))
        })
    }

    update(list)
    {
        return this.db.query("UPDATE list SET shop=$2,date=$3,archived=$4 WHERE id=$1",
            [list.id, list.shop, list.date, list.archived])
    }
}