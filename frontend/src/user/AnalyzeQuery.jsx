import React, {useCallback, useState} from 'react'
import CompareQuery from './CompareQuery';
import QueryPlanText from './QueryPlanText';
import QueryPlanView from './QueryPlanView';
import Selectbox from '../common/Selectbox2';

const AnalyzeQuery = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  // const [scenario, setScenario] = useState('');
  const [selectType, setSelectType] = useState('');
  let scenario2 = '';

  const handleTab1 = () => {
      setActiveTab("tab1");
  };
  const handleTab2 = () => {
      setActiveTab("tab2");
  };
  const handleTab3 = () => {
      setActiveTab("tab3");
  };

  const sendDataToParent = useCallback((item, selectType) => {
    // setDbSeq(item);
    console.log(item, selectType);
    if(item !== '' && selectType === 'db') {
      // setScenario(100); // 9
      scenario2 = item;
      setSelectType('dbList');
      // selectQuery(item);
      console.log(scenario2);
      sendDataToParent2(item, selectType);
    }
  }, []);

  // const testFunc = ()=>{
  //   setScenario(100); // 9
  //   console.log(scenario)
  // }
  const sendDataToParent2 = useCallback((item, selectType) => {
    // setDbSeq(item);
    console.log(item, selectType);
    setSelectType('dbList');
    if(item !== '' && selectType === 'scenario') {
      // setScenario(item);
      // selectQuery(item);
      // console.log(scenario)
    }
  }, []);

  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <div className="row">
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
          <div className="row">
            <div className="col">
              <Selectbox sendDataToParent={sendDataToParent} selectType={''} val={''} />
            </div>
            <div className="col">
              <Selectbox sendDataToParent={sendDataToParent2} selectType={selectType} val={scenario2} />
              <Selectbox sendDataToParent={sendDataToParent2} selectType={selectType} val={scenario2} />
            </div>
            <div className="col">
              <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" defaultValue="0">
                <option value="0">Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
              <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" defaultValue="0">
                <option value="0">Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
          </div>
        </div>
        {activeTab === "tab1" ? <CompareQuery /> : activeTab === "tab2" ? <QueryPlanText /> : <QueryPlanView /> }
      </main>
    </>
  );
};

export default AnalyzeQuery