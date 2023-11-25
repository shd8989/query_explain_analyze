import React, { Component } from 'react'

const Contents = () => {
    return (
      <>
        <main>
          <div className="container-fluid px-4">
            <div className="row">
              <div className="col">
                <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                  <option selected>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
              <div className="col">
                <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                  <option selected>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
                <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                  <option selected>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
              <div className="col">
                <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                  <option selected>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
                <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                  <option selected>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="text-nowrap">
                  This text should overflow the parent.
                </div>
              </div>
              <div className="col">
                <div className="text-nowrap">
                  This text should overflow the parent.
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="text-nowrap">
                  This text should overflow the parent.
                </div>
              </div>
              <div className="col">
                <div className="text-nowrap">
                  This text should overflow the parent.
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-3 col-md-6">
                <div className="card bg-primary text-white mb-4">
                  <div className="card-body">Success Card</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
};

export default Contents