import React from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Header from './common/Header';
import LeftSideNav from './common/LeftSideNav';
import Footer from './common/Footer';
import Contents from './user/Contents';
import Contents2 from './user/Contents2';
import Contents3 from './user/Contents3';

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
              <Route path="/" exact element={<Contents />} />
              <Route path="/list" element={<Contents2 />} />
              <Route path="/analyze" element={<Contents3 />} />
            </Routes>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

export default React.memo(App);