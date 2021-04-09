const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer")
const UserAccountDAO = require('../datamodel/useraccountdao')
const UserAccount = require('../datamodel/useraccount')
const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

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
        return this.dao.insert(new UserAccount(displayname, login, this.hashPassword(password), false, this.generateConfirmation()))
    }

    async validatePassword(login, password)
    {
        const user = await this.dao.getByLogin(login.trim())
        if(user === undefined) return false
        return this.comparePassword(password, user.challenge)
    }

    async validateEmail(login)
    {
        const user = await this.dao.getByLogin(login)
        if(user.active === false) return false
        return true
    }

    comparePassword(password, hash)
    {
        return bcrypt.compareSync(password, hash)
    }

    hashPassword(password)
    {
        return bcrypt.hashSync(password, 10)  // 10 : cost factor -> + élevé = hash + sûr
    }

    generateConfirmation()
    {
        let confirmation = '';
        for (let i = 0; i < 25; i++)
        {
            confirmation += characters[Math.floor(Math.random() * characters.length )];
        }

        return confirmation
    }

    sendConfirmationEmail(user)
    {
        const transport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "abonnet84000@gmail.com",
                pass: "franck121997!",
            }
        })

        transport.sendMail({
            from: "abonnet84000@gmail.com",
            to: user.login,
            subject: "Veuillez confirmer votre compte",
            html: `<h1>Email de confirmation</h1>
                   <h2>Bonjour ${user.displayname}</h2>
                   <p>Nous vous remercions de votre inscription. Merci de verifier votre email en cliquant sur le lien ci-dessous</p>
                    <a href=http://localhost:3333/useraccount/confirm/${user.confirmation}> Cliquer ici</a>`
        }).catch(err => console.log(err))
    }
}