const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const ItemService = require("./services/item")
const ListService = require("./services/list")
const UserAccountService = require("./services/useraccount")

const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // URLEncoded form data
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('dev')); // toutes les requêtes HTTP dans le log du serveur

const connectionString = "postgres://user1:default@localhost/base1"
const db = new pg.Pool({ connectionString: connectionString })

const itemService = new ItemService(db)
const listService = new ListService(db)
const userAccountService = new UserAccountService(db)
const jwt = require('./jwt')(userAccountService)

require('./api/list')(app, listService, itemService, jwt)
require('./api/item')(app, itemService, listService, jwt)
require('./api/useraccount')(app, userAccountService, jwt)
require('./datamodel/seeder')(userAccountService, itemService, listService)
    .then(_ => app.listen(3333))


