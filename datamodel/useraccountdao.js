const BaseDAO = require('./basedao')

module.exports = class UserAccountDAO extends BaseDAO
{
    constructor(db)
    {
        super(db, "useraccount")
    }

    insert(useraccount)
    {
        return new Promise((resolve, reject) =>
            this.db.query("INSERT INTO useraccount(displayname,login,challenge,active, confirmation, confirmationdate) VALUES ($1,$2,$3,$4,$5,$6) RETURNING ID",
            [useraccount.displayName, useraccount.login, useraccount.challenge, useraccount.active, useraccount.confirmation, useraccount.confirmationDate])
                .then(res => resolve(res.rows[0].id) )
                .catch(e => reject(e)))
    }

    getByLogin(login)
    {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM useraccount WHERE login=$1", [ login ])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }

    getByConfirmation(confirmation)
    {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM useraccount WHERE confirmation=$1", [confirmation])
                .then(res => resolve(res.rows[0]))
                .catch(err => reject(err)))
    }

    getLikeLogin(login, userId)
    {
        return new Promise((resolve, reject) => {
            this.db.query("SELECT id, displayname, login FROM useraccount WHERE (login LIKE $1 || '%' OR displayname LIKE $1 || '%') AND id != $2", [login, userId])
                .then(res => resolve(res.rows))
                .catch(err => reject(err))
        })
    }

    update(useraccount)
    {
        return this.db.query("UPDATE useraccount SET displayname=$1,login=$2,active=$3, confirmation=$4, confirmationdate=$5 WHERE id=$6",
            [useraccount.displayname, useraccount.login, useraccount.active, useraccount.confirmation, useraccount.confirmationdate, useraccount.id])
    }
}