import React, { Component } from 'react'

const Contents = () => {
/*
  const { Client } = require("pg");
  const client = new Client({
    user: "hdseo",
    host: "127.0.0.1",
    database: "postgres",
    password: "1234",
    port: 5432,
  });
  console.log('before connect');
  client.connect();
  console.log('success connect');
  client.query("SELECT NOW()", (err, res) => {
    console.log(err, res);
    client.end();
  });
*/
    return (
      <>
        <main>
          <div className="container-fluid px-4">
            <div className="row">
              <div className="col">
                <h1 className="mt-4">File upload with query</h1>
                <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                  <option selected>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
                <input className="form-control" type="file" id="formFile" />
                <div className="col-xl-3 col-md-6">
                  <div className="card bg-primary text-white mb-4">
                    <div className="card-body">Success Card</div>
                  </div>
                </div>
              </div>
              <div className="col">
                <h1 className="mt-4">Execute a query</h1>
                <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                  <option selected>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
                <div className="form-floating">
                  <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2"></textarea>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="card bg-primary text-white mb-4">
                    <div className="card-body">Success Card</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
};

export default Contents