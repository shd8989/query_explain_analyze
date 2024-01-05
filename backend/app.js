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
    password: process.env.DB_USER_PW,
    max: 30,
    idleTimeoutMillis: 1000
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

app.get(api_context + '/select-one-query', (req, res) => {
    pool.connect(function(err) {
        if(err) {
            console.log('connection error', err);
        }
        const selectQuery = "SELECT a.test_scenario, b.nickname, a.query_seq, a.query "
            + "FROM tb_result_querytest a "
            + "JOIN tb_database b ON a.db_seq = b.db_seq "
            + "WHERE 1=1 "
        let conditions = '';
        const params = [];
        let cnt = 1;
        if(req.query.test_scenario !== '') {
            conditions += ' AND a.test_scenario = $' + cnt;
            params.push(req.query.test_scenario);
            cnt++;
        }
        if(req.query.db_seq !== '' && req.query.db_seq !== '0') {
            conditions += ' AND b.db_seq = $' + cnt;
            params.push(Number(req.query.db_seq));
            cnt++;
        }
        if(req.query.query_seq !== '' && req.query.query_seq !== '0') {
            conditions += ' AND a.query_seq = $' + cnt;
            params.push(Number(req.query.query_seq));
            cnt++;
        }
        const sql = selectQuery + conditions;
        
        if(req.query.test_scenario !== '' && req.query.db_seq !== '' && req.query.db_seq !== '0' && req.query.query_seq !== '' && req.query.query_seq !== '0') {
            // pool.query(sql, (cnt > 1 ? [params] : ''), (err, response) => {
            pool.query(sql, [req.query.test_scenario, Number(req.query.db_seq), Number(req.query.query_seq)], (err, response) => {
                if(err != null) {
                    console.log(err);
                }
                if(response.rowCount > 0) {
                    data = response.rows;
                    res.send(data);
                } else {
                    res.send('-1');
                }
            });
        }
    });
    pool.on('end', function() {client.end();});
});

app.post(api_context + '/single-query', (req, res) => {
    const {query, dbSeq, scenario} = req.body;
    pool.connect(function(err, client) {
        if(err) {
            console.log('connection error', err);
        }
        const insertQuery = "INSERT INTO tb_result_querytest (db_seq, query, test_scenario, return_data, rst, error_msg, insert_dt) VALUES ($1, $2, $3, $4, $5, $6, now())";
        client.query(query)
        .then((response) => {
            client.query(insertQuery, [dbSeq, query, scenario, Object.values(response.rows[0])[0], 'Success', ''])
            .catch((e) => console.error(e.stack));
            res.send(200);
        })
        .catch((e) => {
            client.query(insertQuery, [dbSeq, query, '', 'Fail', 'Error code: ' + e.code + ":: Hint: " + e.hint])
            .catch((e) => console.error(e.stack));
        });
    });
    pool.on('end', function() {client.end();});
});

app.post(api_context + '/multi-query', (req, res) => {
    const {data, dbSeq, scenario} = req.body;
    pool.connect(function(err, client) {
        if(err) {
            console.log('connection error', err);
        }
        for(var i=0; i<data.length; i++) {
            const insertQuery = "INSERT INTO tb_result_querytest (db_seq, query, test_scenario, return_data, rst, error_msg, insert_dt) VALUES ($1, $2, $3, $4, $5, $6, now())";
            let query = data[i];
            client.query(query)
            .then((response) => {
                if(response.rows.length == 1) {
                    client.query(insertQuery, [dbSeq, query, scenario, Object.values(response.rows[0])[0], 'Success', ''])
                    .catch((e) => console.error(e.stack));
                    res.send(200);
                } else if(response.rows.length > 1) {
                    var multiRes = '';
                    for(var i=0; i<response.rows.length; i++) {
                        if(i < response.rows.length-1 ) {
                            multiRes += Object.values(response.rows[i])[0] + '\n';
                        } else if(i == response.rows.length-1 ) {
                            multiRes += Object.values(response.rows[i])[0];
                        }
                    }
                    client.query(insertQuery, [dbSeq, query, scenario, multiRes, 'Success', ''])
                    .catch((e) => console.error(e.stack));
                    res.send(200);
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

app.get(api_context + '/select-scenario', (req, res) => {
    pool.connect(function(err) {
        if(err) {
            console.log('connection error', err);
        }
        const selectQuery = "SELECT a.test_scenario, array_agg(a.db_seq) as db_seq "
            + "FROM ( "
            + "SELECT test_scenario, db_seq "
            + "FROM tb_result_querytest "
            + "GROUP BY test_scenario, db_seq "
            + "ORDER BY test_scenario asc "
            + ") a "
            + "GROUP BY a.test_scenario"
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

app.get(api_context + '/select-db', (req, res) => {
    pool.connect(function(err) {
        if(err) {
            console.log('connection error', err);
        }
        let selectQuery = '';
        let values = [];
        if(req.query.test_scenario !== '' && req.query.test_scenario !== undefined) {
            selectQuery = "SELECT b.db_seq, b.nickname "
            + "FROM tb_result_querytest a "
            + "JOIN tb_database b ON a.db_seq = b.db_seq "
            + "WHERE a.test_scenario = $1 "
            + "GROUP BY b.db_seq, b.nickname "
            + "ORDER BY nickname asc";
            values.push(req.query.test_scenario);
        } else {
            selectQuery = "SELECT db_seq, nickname "
            + "FROM tb_database "
            + "ORDER BY nickname asc";
        }
        pool.query(selectQuery, (req.query.test_scenario !== '' && req.query.test_scenario !== undefined ? values : []), (err, response) => {
            if(err != null) {
                console.log(err);
            }
            data = response.rows;
            res.send(data);
        });
    });
    pool.on('end', function() {client.end();});
});

app.get(api_context + '/select-query', (req, res) => {
    if(req.query.db_seq !== undefined && req.query.db_seq !== '0'  && req.query.db_seq !== 0) {
        pool.connect(function(err) {
            if(err) {
                console.log('connection error', err);
            }
            const selectQuery = "SELECT query_seq, query "
                + "FROM tb_result_querytest "
                + "WHERE db_seq = $1 "
                + "ORDER BY query_seq desc";
            pool.query(selectQuery, [req.query.db_seq], (err, response) => {
                if(err != null) {
                    console.log(err);
                }
                if(response.rowCount > 0) {
                    data = response.rows;
                    res.send(data);
                } else {
                    res.send('-1');
                }
            });
        });
        pool.on('end', function() {client.end();});
    }
});

app.get(api_context + '/dbconn-list', (req, res) => {
    if(req.query.pDbSeq !== undefined) {
        const arr = req.query.pDbSeq.split(',').map(Number);
        pool.connect(function(err) {
            if(err) {
                console.log('connection error', err);
            }
            const selectQuery = "SELECT * FROM tb_database WHERE db_seq = any($1::int[])";
            // const selectQuery = "SELECT * FROM tb_database WHERE db_seq = $1";
            pool.query(selectQuery, [req.query.pDbSeq[0]], (err, response) => {
                if(err != null) {
                    console.log(err);
                }
                data = response.rows;
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

app.get(api_context + '/query-plan', (req, res) => {
    pool.connect(function(err) {
        if(err) {
            console.log('connection error', err);
        }
        const explainAnalyze = "EXPLAIN ANALYZE ";
        var rst1 = '';
        var rst2 = '';
        pool.query(explainAnalyze + req.query.first_query + '; '
                 + explainAnalyze + req.query.second_query, (err, response) => {
            var multiRes = '';
            const regex = /[A-Z]|\-/;
            var depthMap = new Map;
            var planDepth = 1;
            for(var i=0; i<response[0].rows.length; i++) {
                var line = Object.values(response[0].rows[i])[0];
                var matchLine = line.indexOf(line.match(regex));
                if(i == 0) {
                    multiRes = '[0]' + line + '\n';
                } else if(i < response[0].rows.length-1) {
                    if(i < response[0].rows.length-2) {
                        if(!depthMap.has(matchLine)) {
                            depthMap.set(matchLine, planDepth);
                            multiRes += '[' + planDepth + ']' + line + '\n';
                            planDepth++;
                        } else {
                            multiRes += '[' + depthMap.get(matchLine) + ']' + line + '\n';
                        }
                    } else {
                        multiRes += line + '\n';
                    }
                } else if(i == response[0].rows.length-1) {
                    multiRes += line;
                }
            }
            rst1 = multiRes;
            
            multiRes = '';
            depthMap = new Map;
            planDepth = 1;
            for(var i=0; i<response[1].rows.length; i++) {
                var line = Object.values(response[1].rows[i])[0];
                var matchLine = line.indexOf(line.match(regex));
                if(i == 0) {
                    multiRes = '[0]' + line + '\n';
                } else if(i < response[1].rows.length-1) {
                    if(i < response[1].rows.length-2) {
                        if(!depthMap.has(matchLine)) {
                            depthMap.set(matchLine, planDepth);
                            multiRes += '[' + planDepth + ']' + line + '\n';
                            planDepth++;
                        } else {
                            multiRes += '[' + depthMap.get(matchLine) + ']' + line + '\n';
                        }
                    } else {
                        multiRes += line + '\n';
                    }
                } else if(i == response[1].rows.length-1) {
                    multiRes += line;
                }
            }
            rst2 = multiRes;
            
            res.send({result_first_query:rst1, result_second_query:rst2});
            if(err != null) {
                console.log(err);
            }
        });
    });
    pool.on('end', function() {client.end();});
});