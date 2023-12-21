const express = require('express');
const fs = require('fs');
const readline = require('readline');
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const api_context = '/api/v1'
const filename = '.env'

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

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_USER_PW
});

app.get('/', (req, res) => {
    res.send('Hello, Express');
});

app.get(api_context + '/db-conn', (req, res) => {
    pool.connect(function(err) {
        if(err) {
            console.log('connection error', err);
        }
        const selectQuery = "SELECT * FROM tb_result_querytest";
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

// analyze query
app.get(api_context + '/query-list', (req, res) => {
    pool.connect(function(err) {
        if(err) {
            console.log('connection error', err);
        }
        const selectQuery = "SELECT * FROM tb_result_querytest ";
        const conditions = "WHERE db_seq = $1 ";
        const orderQuery = "ORDER BY query_seq desc";
        const sql = selectQuery + (req.query.dbSeq !== '' ? conditions : '') + orderQuery;
        pool.query(sql, (req.query.dbSeq !== '' ? [req.query.dbSeq] : ''), (err, response) => {
            if(err != null) {
                console.log(err);
            }
            data = response.rows;
            res.send(data);
        });
    });
    pool.on('end', function() {client.end();});
});

app.get(api_context + '/query-list2', (req, res) => {
    // if(req.query.querySeq !== '' && req.query.querySeq !== undefined) {
    //     pool.connect(function(err) {
    //         if(err) {
    //             console.log('connection error', err);
    //         }
    //         const selectQuery = "SELECT * FROM tb_result_querytest WHERE db_seq = $1 ORDER BY query_seq desc";
    //         pool.query(selectQuery, [req.query.dbSeq], (err, response) => {
    //             if(err != null) {
    //                 console.log(err);
    //             }
    //             data = response.rows;
    //             res.send(data);
    //         });
    //     });
    //     pool.on('end', function() {client.end();}); 
    // } else if(req.query.querySeq === undefined) {
        pool.connect(function(err) {
            if(err) {
                console.log('connection error', err);
            }
            const selectQuery = "SELECT array_agg(a.query_seq) as query_seq, a.test_scenario, array_agg(a.db_seq) as db_seq "
                + "FROM ( "
                + "SELECT min(query_seq) as query_seq, test_scenario, db_seq "
                + "FROM tb_result_querytest "
                + "GROUP BY test_scenario, db_seq "
                + "ORDER BY test_scenario "
                + ") a "
                + "GROUP BY a.test_scenario;";
            pool.query(selectQuery, (err, response) => {
                if(err != null) {
                    console.log(err);
                }
                data = response.rows;
                res.send(data);
            });
        });
        pool.on('end', function() {client.end();});
    // }
});

app.post(api_context + '/single-query', (req) => {
    const {query, dbSeq, scenario} = req.body;
    pool.connect(function(err, client) {
        if(err) {
            console.log('connection error', err);
        }
        const insertQuery = "INSERT INTO tb_result_querytest (db_seq, query, test_scenario, return_data, rst, error_msg, insert_dt) VALUES ($1, $2, $3, $4, $5, $6, now())";
        client.query(query)
        .then((res) => {
            client.query(insertQuery, [dbSeq, query, scenario, Object.values(res.rows[0])[0], 'Success', ''])
            .catch((e) => console.error(e.stack));
        })
        .catch((e) => {
            client.query(insertQuery, [dbSeq, query, '', 'Fail', 'Error code: ' + e.code + ":: Hint: " + e.hint])
            .catch((e) => console.error(e.stack));
        });
    });
    pool.on('end', function() {client.end();});
});

app.post(api_context + '/multi-query', (req) => {
    const {data, dbSeq, scenario} = req.body;
    pool.connect(function(err, client) {
        if(err) {
            console.log('connection error', err);
        }
        for(var i=0; i<data.length; i++) {
            const insertQuery = "INSERT INTO tb_result_querytest (db_seq, query, test_scenario, return_data, rst, error_msg, insert_dt) VALUES ($1, $2, $3, $4, $5, $6, now())";
            let query = data[i];
            client.query(query)
            .then((res) => {
                if(res.rows.length == 1) {
                    client.query(insertQuery, [dbSeq, query, scenario, Object.values(res.rows[0])[0], 'Success', ''])
                    .catch((e) => console.error(e.stack));
                } else if(res.rows.length > 1) {
                    var multiRes = '';
                    for(var i=0; i<res.rows.length; i++) {
                        if(i < res.rows.length-1 ) {
                            multiRes += Object.values(res.rows[i])[0] + '\n';
                        } else if(i == res.rows.length-1 ) {
                            multiRes += Object.values(res.rows[i])[0];
                        }
                    }
                    client.query(insertQuery, [dbSeq, query, scenario, multiRes, 'Success', ''])
                    .catch((e) => console.error(e.stack));
                }
            })
            .catch((e) => {
                client.query(insertQuery, [dbSeq, query, scenario, '', 'Fail', 'Error code: ' + e.code + ":: Hint: " + e.hint])
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
        const selectQuery = "SELECT * FROM tb_database ORDER BY db_seq desc";
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

// database
app.post(api_context + '/createdb', (req) => {
    const {nickname, dbHost, dbPort, dbName, dbUser, dbUserPw, resultDbYn} = req.body;
    if(resultDbYn === 'T') {
        pool.connect(function(err, client) {
            if(err) {
                console.log('connection error', err);
            }
            const insertQuery = "INSERT INTO tb_database (nickname, db_host, db_port, db_name, db_user, db_user_pw, resultdb_yn) VALUES ($1, $2, $3, $4, $5, $6, $7)";
            client.query(insertQuery, [nickname, dbHost, dbPort, dbName, dbUser, dbUserPw, resultDbYn])
            .then((res) => {
                console.log('success insert database information');
            })
            .catch((e) => {
                console.error(e.stack);
            });
        });
        pool.on('end', function() {client.end();});
    } else if(resultDbYn === 'S') {
        try {
            var fileContents = 'DB_HOST=' + dbHost + '\n';
                fileContents = fileContents + 'DB_PORT=' + dbPort + '\n';
                fileContents = fileContents + 'DB_NAME=' + dbName + '\n';
                fileContents = fileContents + 'DB_USER=' + dbUser + '\n';
                fileContents = fileContents + 'DB_USER_PW=' + dbUserPw;
            fs.writeFileSync(filename, fileContents);
        } catch (err) {
            console.log(err);
        }
    }
});

app.get(api_context + '/dbconn-list', (req, res) => {
    if(req.query.dbSeq !== undefined) {
        const arr = req.query.dbSeq.split(',').map(Number);
        pool.connect(function(err) {
            if(err) {
                console.log('connection error', err);
            }
            const selectQuery = "SELECT * FROM tb_database WHERE db_seq = any($1)";
            pool.query(selectQuery, [arr], (err, response) => {
                if(err != null) {
                    console.log(err);
                }
                data = response.rows;
                console.log(data)
                res.send(data);
            });
        });
        pool.on('end', function() {client.end();});
    } else {
        pool.connect(function(err) {
            if(err) {
                console.log('connection error', err);
            }
            const selectQuery = "SELECT * FROM tb_database";
            pool.query(selectQuery, (err, response) => {
                if(err != null) {
                    console.log(err);
                }
                data = response.rows;
                res.send(data);
            });
        });
        pool.on('end', function() {client.end();});
    }
});