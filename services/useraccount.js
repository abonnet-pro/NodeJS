const bcrypt = require('bcrypt')
const UserAccountDAO = require('../datamodel/useraccountdao')
const UserAccount = require('../datamodel/useraccount')

module.exports = class UserAccountService
{
    constructor(db)
    {
        this.dao = new UserAccountDAO(db)
    }

    isValid(useraccount)
    {
        useraccount.displayname = useraccount.displayname.trim()
        if (useraccount.displayname === "") return false
        if(useraccount.login == null) return false
        if (useraccount.password == null) return false
        return true
    }

    async isLoginValid(login)
    {
        const user = await this.dao.getByLogin(login.trim())
        return (user === undefined)
    }

    insert(displayname, login, password)
    {
        return this.dao.insert(new UserAccount(displayname, login, this.hashPassword(password)))
    }

    async validatePassword(login, password)
    {
        const user = await this.dao.getByLogin(login.trim())
        return this.comparePassword(password, user.challenge)
    }

    comparePassword(password, hash)
    {
        return bcrypt.compareSync(password, hash)
    }

    hashPassword(password)
    {
        return bcrypt.hashSync(password, 10)  // 10 : cost factor -> + élevé = hash + sûr
    }
}