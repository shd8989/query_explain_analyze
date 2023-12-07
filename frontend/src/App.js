import React from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Header from './common/Header';
import LeftSideNav from './common/LeftSideNav';
import Footer from './common/Footer';
import QueryExecute from './user/QueryExecute';
import QueryPlanList from './user/QueryPlanList';
import AnalyzeQuery from './user/AnalyzeQuery';
import DbCreate from './database/DbCreate';
import DbList from './database/DbList';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state={};
  }

  render() {
    return (
      <div className="App">
        <Header />
        <div id="layoutSidenav">
          <LeftSideNav />
          <div id="layoutSidenav_content">
            <Routes>
              <Route path="/db-create" element={<DbCreate />} />
              <Route path="/db-list" element={<DbList />} />
              <Route path="/" exact element={<QueryExecute />} />
              <Route path="/list" element={<QueryPlanList />} />
              <Route path="/analyze" element={<AnalyzeQuery />} />
            </Routes>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

export default React.memo(App);