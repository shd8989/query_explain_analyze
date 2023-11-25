import React, { Component } from 'react'

const LeftSideNav = () => {
    return (
      <>
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">MENU</div>
                <a className="nav-link" href="index.html">
                  <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt" /></div>
                  Query Execute
                </a>
                <a className="nav-link" href="index.html">
                  <div className="sb-nav-link-icon"><i className="fas fa-columns" /></div>
                  Query Plan List
                </a>
                <a className="nav-link" href="index.html">
                  <div className="sb-nav-link-icon"><i className="fas fa-book-open" /></div>
                  Analyze Query
                </a>
              </div>
            </div>
            <div className="sb-sidenav-footer">
              <div className="small">Logged in as:</div>
              Hyundong
            </div>
          </nav>
        </div>
      </>
    );
};

export default LeftSideNav