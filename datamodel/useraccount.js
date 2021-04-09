module.exports = class UserAccount
{
    constructor(displayName, login, challenge, active, confirmation, confirmationDate)
    {
        this.id = null
        this.displayName = displayName
        this.login = login
        this.challenge = challenge
        this.active = active
        this.confirmation = confirmation
        this.confirmationDate = confirmationDate
    }
}