const db = require('../db');

class UserController {


    async getUser(req, res) {
        const id = req.params.id;
        const users = await db.query('SELECT * FROM person JOIN password ON person.id = password.user_id WHERE person.id=$1', [id]);
        res.json(users.rows[0]);
    }

    async getAccountInfo(req, res) {
        const id = req.params.id;
        const account_id = req.params.account_id;

        const accountInfo = await db.query(
            'SELECT * ' +
            'FROM person JOIN account ON person.id = user_id JOIN (SELECT account_id, MIN(date) as opened FROM  ' +
            'history GROUP BY date, account_id) as hist ON account.id = hist.account_id WHERE account.id = $1',
            [account_id]
        );


        res.json(accountInfo.rows[0]);

    }

    async updateBalance(req, res) {
        const { account_id, addition } = req.body;

        const currentBalance = await db.query('SELECT balance FROM account WHERE id = $1', [account_id]);

        if (currentBalance.rows[0].balance + addition >= 0) {
            const newTotal = await db.query('UPDATE account SET balance = $1 WHERE id = $2 RETURNING *',
                [currentBalance.rows[0].balance + addition, account_id]);
            await db.query('INSERT INTO history (operation, date, account_id) VALUES ($1, LOCALTIMESTAMP, $2)',
                [addition, account_id]);

            res.json(newTotal.rows[0]);
        }
        else {
            res.json("Error. Boy, u broke!");
        }
    }

    async checkUserPassword(req, res, next) {
        const password = req.get("password");
        const id = req.params.id;

        const actualPassword = await db.query('SELECT token FROM password WHERE user_id = $1', [id]);


        if (password === actualPassword.rows[0].token) {
            next();
        }
        else {
            res.json("Incorrect password!");
        }

    }

}

module.exports = new UserController();
