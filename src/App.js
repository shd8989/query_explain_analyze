import React from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Header from './common/Header';
import LeftSideNav from './common/LeftSideNav';
import Contents from './common/Contents';
import Contents2 from './common/Contents2';
import Contents3 from './common/Contents3';

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
          <Routes>
            <Route path="/" exact element={<Contents />} />
            <Route path="/list" element={<Contents2 />} />
            <Route path="/analyze" element={<Contents3 />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;