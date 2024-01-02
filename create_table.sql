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


CREATE TABLE tb_team AS
SELECT a.team_no, a.dept_no, 
CASE WHEN dept_no = 0 then 'Liverpool'
WHEN dept_no = 1 then 'Aston Villa'
WHEN dept_no = 2 then 'Manchester City'
WHEN dept_no = 3 then 'Arsenal'
WHEN dept_no = 4 then 'Tottenham Hotspur'
WHEN dept_no = 5 then 'West Ham United'
WHEN dept_no = 6 then 'Manchester United'
WHEN dept_no = 7 then 'Brighton And Hove Albion'
WHEN dept_no = 8 then 'Newcastle United'
WHEN dept_no = 9 then 'Chelsea'
WHEN dept_no = 10 then 'Wolverhampton Wanderers'
WHEN dept_no = 11 then 'Bournemouth'
WHEN dept_no = 12 then 'Fulham'
WHEN dept_no = 13 then 'Crystal palace'
WHEN dept_no = 14 then 'Nottingham Forest'
WHEN dept_no = 15 then 'Brentford'
WHEN dept_no = 16 then 'Everton'
WHEN dept_no = 17 then 'Luton Town'
WHEN dept_no = 18 then 'Burnley'
WHEN dept_no = 19 then 'Sheffield United'
END as team_name
FROM (SELECT team_no, team_no % 20 AS dept_no
FROM generate_series(1, 1000) AS team_no) a;

CREATE TABLE tb_user AS
SELECT user_no, user_no % 20 as dept_no, now() as created_at
FROM generate_series(1, 50000) AS user_no;

CREATE TABLE tb_product AS
SELECT substring(md5(random()::text), 0, 3) as prod_no, user_no, to_char(gs, 'YYYYMMDD') as log_date
FROM generate_series(1, 50000) AS user_no,
generate_series('2024-01-01 00:00:00'::timestamp, '2024-12-31 23:59:59'::timestamp, '1 days') AS gs;

CREATE INDEX idx_user_department_no ON users (department_no);

CREATE INDEX idx_user_dept_no ON tb_user (dept_no);
CREATE INDEX idx_user_user_no ON tb_user (user_no);
CREATE INDEX idx_prod_prod_no ON tb_product (prod_no);

SELECT *
FROM tb_team a
JOIN tb_user b ON a.dept_no = b.dept_no
JOIN tb_product c ON b.user_no = c.user_no
WHERE b.dept_no < 9
AND a.team_name != 'Bournemouth'
AND c.log_date < '20240401';

SELECT c.prod_no, string_agg(a.dept_no::text, ',') AS dept_no
FROM tb_team a
JOIN tb_user b ON a.dept_no = b.dept_no
JOIN tb_product c ON b.user_no = c.user_no
WHERE b.user_no <= 10000
AND a.team_name not in ('Arsenal', 'Wolverhampton Wanderers', 'Everton', 'Tottenham Hotspur')
GROUP BY c.prod_no;