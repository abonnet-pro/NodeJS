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
        return this.dao.insert(new UserAccount(displayname, login, this.hashPassword(password), false, null, null))
    }

    async update(user)
    {
        let prevUser = await this.dao.getById(user.id)

        if(!this.comparePassword(user.challenge, prevUser.challenge) && user.challenge !== prevUser.challenge)
        {
            user.challenge = this.hashPassword(user.challenge)
        }
        else
        {
            user.challenge = prevUser.challenge
        }

        return this.dao.update(user)
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

    async isActive(login)
    {
        const user = await this.dao.getByLogin(login)
        if (user.active === true && user.confirmation === null) return true
        return false
    }

    comparePassword(password, hash)
    {
        return bcrypt.compareSync(password, hash)
    }

    hashPassword(password)
    {
        return bcrypt.hashSync(password, 10)  // 10 : cost factor -> + élevé = hash + sûr
    }

    generateLink()
    {
        let link = '';
        for (let i = 0; i < 25; i++)
        {
            link += characters[Math.floor(Math.random() * characters.length )];
        }

        return link
    }

    sendResetPasswordEmail(user)
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
            subject: "Reinitialisation de votre mot de passe",
            html: `<h1>Email de reinitialisation</h1>
                   <h2>Bonjour ${user.displayname}</h2>
                   <p>Afin de réinitialiser votre mot de passe veuillez cliquer sur le lien ci-dessous</p>
                   <a href=http://localhost:63342/JS-Front/reset.html?${user.reset}>Cliquez ici</a>
                   <p>http://localhost:63342/JS-Front/reset.html?${user.reset}</p>`
        }).catch(err => console.log(err))
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
                    <a href=http://localhost:3333/useraccount/confirm/${user.confirmation}> Cliquez ici</a>`
        }).catch(err => console.log(err))
    }

    getHoursDifference(date)
    {
        const milliseconds = new Date().getTime() - date.getTime()
        const seconds = milliseconds / 1000
        const minuts = seconds / 60
        return Math.trunc(minuts / 60)
    }

    getMinutsDifference(date)
    {
        const milliseconds = new Date().getTime() - date.getTime()
        const seconds = milliseconds / 1000
        return Math.trunc(seconds / 60)
    }
}