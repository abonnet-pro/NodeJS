const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const ItemService = require("./services/item")
const ListService = require("./services/list")
const UserAccountService = require("./services/useraccount")
const ShareService = require("./services/share")
const RoleService = require("./services/role")
const NotificationService = require("./services/notification")
const PaymentService = require("./services/payment")

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
const shareService = new ShareService(db)
const roleService = new RoleService(db)
const notificationService = new NotificationService(db)
const paymentService = new PaymentService(db)
const jwt = require('./jwt')(userAccountService)
const dirName = __dirname

require('./api/list')(app, listService, itemService, shareService, userAccountService, jwt)
require('./api/item')(app, itemService, listService, shareService, notificationService, jwt)
require('./api/useraccount')(app, userAccountService, roleService, notificationService, listService,  paymentService, dirName, jwt)
require('./api/share')(app, shareService, jwt)
require('./api/role')(app, roleService, jwt)
require('./api/notification')(app, notificationService, roleService, jwt)
require('./datamodel/seeder')(userAccountService, itemService, listService, shareService, roleService, notificationService, paymentService)
    .then(_ => app.listen(3333))


