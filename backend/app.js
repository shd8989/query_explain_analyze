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

// database
app.post(api_context + '/create-dbconn', (req, res) => {
    const {nickname, dbHost, dbPort, dbName, dbUser, dbUserPw, resultDbYn} = req.body;
    if(resultDbYn === 'T') {
        pool.connect(function(err, client) {
            if(err) {
                console.log('connection error', err);
            }
            const insertQuery = "INSERT INTO tb_database (nickname, db_host, db_port, db_name, db_user, db_user_pw, resultdb_yn) VALUES ($1, $2, $3, $4, $5, $6, $7)";
            client.query(insertQuery, [nickname, dbHost, dbPort, dbName, dbUser, dbUserPw, resultDbYn])
            .then((response) => {
                res.send(200);
                console.log('success insert database information');
            })
            .catch((e) => {
                console.error(e.stack);
            });
        });
        pool.on('end', function() {client.end();});
    } else if(resultDbYn === 'S') {
        try {
            var fileContents = 'NICKNAME=' + nickname + '\n';
                fileContents = fileContents + 'DB_HOST=' + dbHost + '\n';
                fileContents = fileContents + 'DB_PORT=' + dbPort + '\n';
                fileContents = fileContents + 'DB_NAME=' + dbName + '\n';
                fileContents = fileContents + 'DB_USER=' + dbUser + '\n';
                fileContents = fileContents + 'DB_USER_PW=' + dbUserPw;
            fs.writeFileSync(filename, fileContents);

            pool.connect(function(err, client) {
                if(err) {
                    console.log('connection error', err);
                }
                const insertQuery = "INSERT INTO tb_database (nickname, db_host, db_port, db_name, db_user, db_user_pw, resultdb_yn) VALUES ($1, $2, $3, $4, $5, $6, $7)";
                client.query(insertQuery, [nickname, dbHost, dbPort, dbName, dbUser, dbUserPw, resultDbYn])
                .then((response) => {
                    res.send(200);
                    console.log('success insert database information');
                })
                .catch((e) => {
                    console.error(e.stack);
                });
            });
            pool.on('end', function() {client.end();});
        } catch (err) {
            console.log(err);
        }
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

// query execute
app.post(api_context + '/exec-single-query', (req, res) => {
    const {query, dbSeq, scenario} = req.body;
    pool.connect(function(err, client) {
        if(err) {
            console.log('connection error', err);
        }
        var execTime = '';
        pool.query("EXPLAIN ANALYZE " + query, (err, response) => {
            execTime = Object.values(response.rows[response.rows.length-1])[0].split(":")[1].trim();

            const insertQuery = "INSERT INTO tb_result_querytest (db_seq, query, test_scenario, return_data, is_success, error_msg, execute_time, insert_dt) VALUES ($1, $2, $3, $4, $5, $6, $7, now())";
            pool.query(query)
            .then((response2) => {
                client.query(insertQuery, [dbSeq, query, scenario, Object.values(response2.rows[0])[0], 'Success', '', execTime.substring(0, execTime.length-2)])
                .catch((e) => console.error(e.stack));
                res.send(200);
            })
            .catch((e) => {
                client.query(insertQuery, [dbSeq, query, '', 'Fail', 'Error code: ' + e.code + ":: Hint: " + e.hint, ''])
                .catch((e) => console.error(e.stack));
            });
        });
    });
    pool.on('end', function() {client.end();});
});

app.post(api_context + '/exec-multi-query', (req, res) => {
    const {data, dbSeq, scenario} = req.body;
    pool.connect(function(err, client) {
        if(err) {
            console.log('connection error', err);
        }
        for(var i=0; i<data.length; i++) {
            const insertQuery = "INSERT INTO tb_result_querytest (db_seq, query, test_scenario, return_data, is_success, error_msg, execute_time, insert_dt) VALUES ($1, $2, $3, $4, $5, $6, $7, now())";
            let query = data[i];
            pool.query("EXPLAIN ANALYZE " + query, (err, response) => {
                client.query(query)
                .then((response2) => {
                    var execTime = '';
                    if(response2.rows.length == 1) {
                        execTime = Object.values(response.rows[response.rows.length-1])[0].split(":")[1].trim();
                        client.query(insertQuery, [dbSeq, query, scenario, Object.values(response2.rows[0])[0], 'Success', '', execTime.substring(0, execTime.length-2)])
                        .catch((e) => console.error(e.stack));
                        res.send(200);
                    } else if(response2.rows.length > 1) {
                        var multiRes = '';
                        for(var i=0; i<response2.rows.length; i++) {
                            if(i < response2.rows.length-1 ) {
                                multiRes += Object.values(response2.rows[i])[0] + '\n';
                            } else if(i == response2.rows.length-1 ) {
                                multiRes += Object.values(response2.rows[i])[0];
                            }
                        }
                        execTime = Object.values(response2.rows[response2.rows.length-1])[0].split(":")[1].trim();
                        client.query(insertQuery, [dbSeq, query, scenario, multiRes, 'Success', '', execTime.substring(0, execTime.length-2)])
                        .catch((e) => console.error(e.stack));
                        res.send(200);
                    }
                })
                .catch((e) => {
                    client.query(insertQuery, [dbSeq, query, scenario, '', 'Fail', 'Error code: ' + e.code + ":: Hint: " + e.hint, ''])
                    .catch((e) => console.error(e.stack));
                });
            });
        }
    });
    pool.on('end', function() {client.end();});
});

// common - selectbox
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
            + "WHERE resultdb_yn = 'T'"
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
                + "AND is_success = 'Success' "
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

// analyze query
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

// compare query
app.get(api_context + '/query-plan', (req, res) => {
    pool.connect(function(err) {
        if(err) {
            console.log('connection error', err);
        }
        const explainAnalyze = "EXPLAIN ANALYZE ";
        var result1 = '';
        var result2 = '';
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
            result1 = multiRes;
            
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
            result2 = multiRes;
            
            res.send({result_first_query:result1, result_second_query:result2});
            if(err != null) {
                console.log(err);
            }
        });
    });
    pool.on('end', function() {client.end();});
});

// query plan list
app.get(api_context + '/query-plan-list', (req, res) => {
    pool.connect(function(err) {
        if(err) {
            console.log('connection error', err);
        }
        const selectQuery = "SELECT e.seq AS first_seq, e.test_scenario AS first_scenario, e.nickname AS first_nickname, e.query_seq AS first_query_seq, e.is_success AS first_is_success, e.execute_time AS first_exec_time, "
            + "    f.seq AS second_seq, f.test_scenario AS second_scenario, f.nickname AS second_nickname, f.query_seq AS second_query_seq, f.is_success AS second_is_success, f.execute_time AS second_exec_time "
            + "FROM (SELECT row_number() over (ORDER BY a.query_seq DESC) AS seq, a.test_scenario, b.nickname, a.query_seq, a.is_success, a.execute_time "
            + "    FROM tb_result_querytest a "
            + "    JOIN tb_database b ON a.db_seq = b.db_seq "
            + "    WHERE a.test_scenario = $1 AND a.db_seq = $2) AS e "
            + "FULL OUTER JOIN (SELECT row_number() over (ORDER BY c.query_seq DESC) AS seq, c.test_scenario, d.nickname, c.query_seq, c.is_success, c.execute_time "
            + "    FROM tb_result_querytest c "
            + "    JOIN tb_database d ON c.db_seq = d.db_seq "
            + "    WHERE c.test_scenario = $3 AND c.db_seq = $4) AS f "
            + "ON e.seq = f.seq";
        var values = [req.query.first_scenario, req.query.first_db_seq, req.query.second_scenario, req.query.second_db_seq]
        pool.query(selectQuery, values, (err, response) => {
            if(err != null) {
                console.log(err);
            }
            data = response.rows;
            res.send(data);
        });
    });
    pool.on('end', function() {client.end();});
});