-- init
-- create a result table
CREATE TABLE IF NOT EXISTS tb_result_querytest(query_seq bigserial, db_seq integer, test_scenario varchar(100), query varchar(500), return_data text, rst varchar(7), error_msg varchar(500), execute_time varchar(20), insert_dt timestamp);
-- rename a sequence of the table
ALTER SEQUENCE tb_result_querytest_query_seq_seq RENAME TO tb_result_querytest_seq;

-- create a table about database information
CREATE TABLE IF NOT EXISTS tb_database(db_seq serial, nickname varchar(50), db_name varchar(30), db_host varchar(15), db_port int, db_user varchar(30), db_user_pw varchar(200), resultdb_yn char(1), insert_dt timestamp default now());
-- rename a sequence of the table
ALTER SEQUENCE tb_database_db_seq_seq RENAME TO tb_database_seq;
-- sample insert
INSERT INTO tb_database(nickname, db_name, db_host, db_port, db_user, db_user_pw, resultdb_yn) values('abc', 'postgres', '127.0.0.1', 5430, 'hdseo', '1234', 'S'), ('testdb1', 'postgres', '127.0.0.1', 15431, 'pg', '1234', 'T'), ('testdb2', 'postgres', '127.0.0.1', 25432, 'user', '1234', 'T');

-- test explain analyze query
EXPLAIN ANALYZE
SELECT a.nickname, substring(b.query, 0, 20) AS query, b.rst, b.return_data, b.error_msg
FROM tb_database a
JOIN tb_result_querytest b ON a.db_seq = b.db_seq;


CREATE TABLE team AS
SELECT team_no, team_no % 100 AS department_no
FROM generate_series(1, 50000) AS team_no;

CREATE TABLE users AS
SELECT user_no, user_no % 20000 as department_no, now() as created_at
FROM generate_series(1, 5000000) AS user_no;

CREATE INDEX idx_user_department_no ON users (department_no);

SELECT *
FROM team JOIN users on team.department_no = users.department_no
where team.department_no between 51 and 90;