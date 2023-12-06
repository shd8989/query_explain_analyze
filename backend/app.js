const express = require('express');

const app = express();
const api_context = '/api/v1'

app.set('port', process.env.PORT || 3001);

app.use(express.json());
app.use(
    express.urlencoded({
    extended: true,
  })
);
// app.use(cors());

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기 중')
});

const { Pool } = require("pg");
const pool = new Pool({
    user: "hdseo",
    host: "127.0.0.1",
    database: "postgres",
    password: "1234",
    port: 5430,
});

app.get('/', (req, res) => {
    res.send('Hello, Express');
});

app.get(api_context + '/query-list', (req, res) => {
    pool.connect(function(err) {
        if(err) {
            console.log('connection error', err);
        }
        const selectQuery = "SELECT * FROM result_functional_test OFFSET 0 LIMIT 10";
        pool.query(selectQuery, (err, response) => {
            if(err != null) {
                console.log(err);
            }
            data = response.rows;
            res.send(data);
        });
    });
    pool.on('end', function() {client.end();});
});

app.post(api_context + '/single-query', (req) => {
    const {query} = req.body;
    pool.connect(function(err, client) {
        if(err) {
            console.log('connection error', err);
        }
        const insertQuery = "INSERT INTO result_functional_test (query, return_data, rst, error_msg, insert_dt) VALUES ($1, $2, $3, $4, now())";
        client.query(query)
        .then((res) => {
            client.query(insertQuery, [query, Object.values(res.rows[0])[0], 'Success', ''])
            .catch((e) => console.error(e.stack));
        })
        .catch((e) => {
            client.query(insertQuery, [query, '', 'Fail', 'Error code: ' + e.code + ":: Hint: " + e.hint])
            .catch((e) => console.error(e.stack));
        });
    });
    pool.on('end', function() {client.end();});
});

app.post(api_context + '/multi-query', (req) => {
    const {queries} = req.body.data;
    pool.connect(function(err, client) {
        if(err) {
            console.log('connection error', err);
        }
        for(var i=0; i<Object.values(queries).length; i++) {
            const insertQuery = "INSERT INTO result_functional_test (query, return_data, rst, error_msg, insert_dt) VALUES ($1, $2, $3, $4, now())";
            let query = Object.values(Object.values(queries)[i])[0];
            client.query(query)
            .then((res) => {
                client.query(insertQuery, [query, Object.values(res.rows[0])[0], 'Success', ''])
                .catch((e) => console.error(e.stack));
            })
            .catch((e) => {
                client.query(insertQuery, [query, '', 'Fail', 'Error code: ' + e.code + ":: Hint: " + e.hint])
                .catch((e) => console.error(e.stack));
            });
        }
    });
    pool.on('end', function() {client.end();});
});

app.get(api_context + '/db-list', (req, res) => {
    pool.connect(function(err) {
        if(err) {
            console.log('connection error', err);
        }
        const selectQuery = "SELECT * FROM tb_databse ORDER BY db_seq desc";
        pool.query(selectQuery, (err, response) => {
            if(err != null) {
                console.log(err);
            }
            data = response.rows;
            res.send(data);
        });
    });
    pool.on('end', function() {client.end();});
});

app.post(api_context + '/createdb', (req) => {
    const {nickname, dbHost, dbPort, dbName, dbUser, dbUserPw, resultDbYn} = req.body;
    const newPool = new Pool({
        host: dbHost,
        port: dbPort,
        database: dbName,
        user: dbUser,
        password: dbUserPw
    });
    newPool.connect(function(err, client) {
        if(err) {
            console.log('connection error', err);
        }
        const insertQuery = "INSERT INTO tb_databse (nickname, db_host, db_port, db_name, db_user, db_user_pw, resultdb_yn) VALUES ($1, $2, $3, $4, $5, $6, $7)";
        client.query(insertQuery, [nickname, dbHost, dbPort, dbName, dbUser, dbUserPw, resultDbYn])
        .then((res) => {
            console.log('success insert database information');
        })
        .catch((e) => {
            console.error(e.stack);
        });
    });
    newPool.on('end', function() {client.end();});
});

app.get(api_context + '/db-conn-info', (req, res) => {
    pool.connect(function(err) {
        if(err) {
            console.log('connection error', err);
        }
        const selectQuery = "SELECT * FROM tb_databse";
        pool.query(selectQuery, (err, response) => {
            if(err != null) {
                console.log(err);
            }
            data = response.rows;
            res.send(data);
        });
    });
    pool.on('end', function() {client.end();});
});