import React from 'react'

const LeftSideNav = () => {
    return (
      <>
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">DATABASE</div>
                <a className="nav-link" href="dbconn_create">
                  <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt" /></div>
                  DB Connection Create
                </a>
                <a className="nav-link" href="dbconn_list">
                  <div className="sb-nav-link-icon"><i className="fas fa-columns" /></div>
                  DB Connection List
                </a>
              </div>
              <div className="nav">
                <div className="sb-sidenav-menu-heading">MENU</div>
                <a className="nav-link" href="query_execute">
                  <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt" /></div>
                  Query Execute
                </a>
                <a className="nav-link" href="query_plan_list">
                  <div className="sb-nav-link-icon"><i className="fas fa-columns" /></div>
                  Query Plan List
                </a>
                <a className="nav-link" href="analyze_query">
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