const db = require('../db');

class AdminController {

    async createUser(req, res) {
        const {first_name, middle_name, last_name, passport, tin, password} = req.body;

        const newUser = await db.query(
            'INSERT INTO person (first_name, middle_name, last_name, passport, tin) ' +
            'VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [first_name, middle_name, last_name, passport, tin]
        );

        const personId = await db.query('SELECT MAX(id) FROM person');

        await db.query('INSERT INTO password (token, user_id) VALUES ($1, $2)', [password, personId.rows[0].max]);

        const info = await db.query('SELECT * FROM person JOIN password ON person.id = password.user_id WHERE person.id = $1', [personId.rows[0].max]);

        res.json(info.rows[0]);

    }

    async createAccount(req, res) {
        const {balance, currency, user_id} = req.body;

        const newAccount = await db.query(
            'INSERT INTO account (balance, currency, user_id) VALUES ($1, $2, $3) RETURNING *',
            [balance, currency, user_id]
        );

        const accountId = await db.query('SELECT MAX(id) FROM account');

        const updateBalance = await db.query(
            'INSERT INTO history (operation, date, account_id) VALUES ($1, LOCALTIMESTAMP, $2) RETURNING *',
            [balance, (accountId.rows[0].max) ? accountId.rows[0].max : 1]
        );

        res.json(newAccount.rows[0]);
    }

    async checkAdminPassword(req, res, next) {

        const token = req.get("password");
        const adminPassword = await db.query('SELECT token FROM password WHERE user_id = 1');


        if (token !== adminPassword.rows[0].token) {
            res.json("You are not an admin!");
        } else {
            next();
        }


    }
}


module.exports = new AdminController();
