import React, { useState } from 'react'
import CompareQuery from './CompareQuery';
import QueryPlanText from './QueryPlanText';
import QueryPlanView from './QueryPlanView';

const AnalyzeQuery = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTab1 = () => {
      setActiveTab("tab1");
  };
  const handleTab2 = () => {
      setActiveTab("tab2");
  };
  const handleTab3 = () => {
      setActiveTab("tab3");
  };

  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <ul className="nav nav-pills">
            <li className={activeTab === "tab1" ? "nav-item active" : ""} onClick={handleTab1}>
              <a className={activeTab === "tab1" ? "nav-link active" : ""} aria-current="page" href="#">Compare Queries</a>
            </li>
            <li className={activeTab === "tab2" ? "nav-item active" : ""} onClick={handleTab2}>
              <a className={activeTab === "tab2" ? "nav-link active" : ""} href="#">Query Plan(Text)</a>
            </li>
            <li className={activeTab === "tab3" ? "nav-item active" : ""} onClick={handleTab3}>
              <a className={activeTab === "tab3" ? "nav-link active" : ""} href="#">Query Plan(View)</a>
            </li>
          </ul>
        </div>
        {activeTab === "tab1" ? <CompareQuery /> : activeTab === "tab2" ? <QueryPlanText /> : <QueryPlanView /> }
      </main>
    </>
  );
};

export default AnalyzeQuery