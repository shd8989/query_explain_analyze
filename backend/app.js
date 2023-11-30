const express = require('express');

const app = express();
const api_context = '/api/v1'

app.set('port', process.env.PORT || 3001);

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기 중')
});

app.get('/', (req, res) => {
    res.send('Hello, Express');
});

app.get('/test', (req, res) => {
    res.send('test page');
});

const { Pool } = require("pg");
const pool = new Pool({
    user: "hdseo",
    host: "127.0.0.1",
    database: "postgres",
    password: "1234",
    port: 5430,
});

// app.get(api_context + '/query-list', (req, res) => {
//     pool.connect();
//     var sql = "SELECT * FROM tb_test WHERE tb_id = $1";
//     var values = ['200']
//     client.query(sql, values, (err, res) => {
// //        res.send({data: res.rows});
//         data = res.rows;
//         console.log('succcess connection');
//         console.log(res.rows);
//     });
// });

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
        })
        .finally(() => {client.end();});
    });
});