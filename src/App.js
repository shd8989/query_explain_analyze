import React from 'react';
//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Header from './common/Header';
import LeftSideNav from './common/LeftSideNav';
import Contents from './common/Contents';

function App() {
  return (
    <div className="App">
      <Header />
      <div id="layoutSidenav">
        <LeftSideNav />
        <Contents />
      </div>
    </div>
  );
}

export default App;
