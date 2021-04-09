module.exports = class UserAccount
{
    constructor(displayName, login, challenge, active, confirmation)
    {
        this.id = null
        this.displayName = displayName
        this.login = login
        this.challenge = challenge
        this.active = active
        this.confirmation = confirmation
    }
}