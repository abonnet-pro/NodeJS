const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const ItemService = require("./services/item")
const ListService = require("./services/list")

const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // URLEncoded form data
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('dev')); // toutes les requêtes HTTP dans le log du serveur

const connectionString = "postgres://user1:default@localhost/base1"
const db = new pg.Pool({ connectionString: connectionString })

const itemService = new ItemService(db)
const listService = new ListService(db)

require('./api/list')(app, listService)
require('./datamodel/seeder')(itemService, listService)
    .then(_ => app.listen(3333))


