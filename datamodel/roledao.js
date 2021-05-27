const BaseDAO = require('./basedao')

module.exports = class RoleDAO extends BaseDAO
{
    constructor(db)
    {
        super(db, "role")
    }

    insert(role)
    {
        return new Promise((resolve, reject) =>
            this.db.query("INSERT INTO role(iduser, role) VALUES ($1,$2) RETURNING ID",
                [role.iduser, role.role])
                .then(res => resolve(res.rows[0].id) )
                .catch(e => reject(e)))
    }

    getRolesByLogin(login)
    {
        return new Promise((resolve, reject) => {
            this.db.query("SELECT role.* FROM role INNER JOIN useraccount ON role.iduser = useraccount.id WHERE useraccount.login = $1", [login])
                .then(res => resolve(res.rows))
                .catch(err => reject(err))
        })
    }
}