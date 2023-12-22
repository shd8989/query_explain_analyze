import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import CompareQuery from './CompareQuery';
import QueryPlanText from './QueryPlanText';
import QueryPlanView from './QueryPlanView';
import Selectbox from '../common/Selectbox';

const AnalyzeQuery = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [compareQuery, setCompareQuery] = useState(
    {
      first: {
      test_scenario: '',
      nickname: '',
      query_seq: 0,
      query: ''
    },
    second: {
      test_scenario: '',
      nickname: '',
      query_seq: 0,
      query: ''
    }
  });
  const [scenario1, setScenario1] = useState('');
  const [scenario2, setScenario2] = useState('');
  const [dbSeq1, setDbSeq1] = useState(0);
  const [querySeq1, setQuerySeq1] = useState(0);
  const [dbSeq2, setDbSeq2] = useState(0);
  const [querySeq2, setQuerySeq2] = useState(0);
  const [odnNumber, setOdnNumber] = useState('');

  const handleTab1 = () => {
    setActiveTab("tab1");
  };
  const handleTab2 = () => {
    setActiveTab("tab2");
  };
  const handleTab3 = () => {
    setActiveTab("tab3");
  };

  const sendDataToParent = useCallback((data, selectType, ordinalNumber) => {
    if(ordinalNumber === 'first') {
      setScenario1(preScenario => data);
      setOdnNumber(ordinalNumber);
    } else if(ordinalNumber === 'second') {
      setScenario2(preScenario => data);
      setOdnNumber(ordinalNumber);
    }
  }, [scenario1, scenario2]);

  const sendDataToParent2 = useCallback((data, selectType, ordinalNumber) => {
    if(ordinalNumber === 'first') {
      setDbSeq1(preDbSeq => data);
      setOdnNumber(ordinalNumber);
    } else if(ordinalNumber === 'second') {
      setDbSeq2(preDbSeq => data);
      setOdnNumber(ordinalNumber);
    }
  }, [dbSeq1, dbSeq2]);

  const sendDataToParent3 = useCallback((data, selectType, ordinalNumber) => {
    if(ordinalNumber === 'first') {
      setQuerySeq1(preQuerySeq => data);
      setOdnNumber(ordinalNumber);
    } else if(ordinalNumber === 'second') {
      setQuerySeq2(preDbSeq => data);
      setOdnNumber(ordinalNumber);
    }
  }, [querySeq1, querySeq2]);

  useEffect(() => {
    const query_info = async () => {
      let params = {};
      if(odnNumber === 'first') {
        params = {params: {test_scenario: scenario1, db_seq: dbSeq1, query_seq: querySeq1}};
      } else if(odnNumber === 'second') {
        params = {params: {test_scenario: scenario2, db_seq: dbSeq2, query_seq: querySeq2}};
      }
      
      if(params.params !== undefined && (params.params.test_scenario !== '' && params.params.db_seq !== 0 && params.params.query_seq !== 0)) {
        const response = await axios.get('/api/v1/select-one-query', params)
        const newData = await response.data.map((rowData) => ({
            test_scenario: rowData.test_scenario,
            nickname: rowData.nickname,
            query_seq: rowData.query_seq,
            query: rowData.query
          })
        )
        
        if(odnNumber === 'first') {
            setCompareQuery((preCompareQuery) => ({
              ...preCompareQuery,
              first: {
                test_scenario: newData[0].test_scenario,
                nickname: newData[0].nickname,
                query_seq: newData[0].query_seq,
                query: newData[0].query
              }
            }));
          } else if(odnNumber === 'second') {
            setCompareQuery((preCompareQuery) => ({
              ...preCompareQuery,
              second: {
                test_scenario: newData[0].test_scenario,
                nickname: newData[0].nickname,
                query_seq: newData[0].query_seq,
                query: newData[0].query
              }
            }));
          }
        return newData;
      };
    }
    query_info();
  }, [scenario1, dbSeq1, querySeq1, scenario2, dbSeq2, querySeq2, odnNumber]);

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
              <Selectbox sendDataToParent={sendDataToParent} selectType={'scenario'} ordinalNumber={'first'} />
              <Selectbox sendDataToParent={sendDataToParent} selectType={'scenario'} ordinalNumber={'second'} />
            </div>
            <div className="col">
              <Selectbox sendDataToParent={sendDataToParent2} selectType={'db'} ordinalNumber={'first'} />
              <Selectbox sendDataToParent={sendDataToParent2} selectType={'db'} ordinalNumber={'second'} />
            </div>
            <div className="col">
              <Selectbox sendDataToParent={sendDataToParent3} selectType={'query'} ordinalNumber={'first'} />
              <Selectbox sendDataToParent={sendDataToParent3} selectType={'query'} ordinalNumber={'second'} />
            </div>
          </div>
        </div>
        {
          activeTab === "tab1" ? <CompareQuery data={compareQuery} /> : 
          activeTab === "tab2" ? <QueryPlanText data={compareQuery} /> : 
          <QueryPlanView data={compareQuery} />
        }
      </main>
    </>
  );
};

export default React.memo(AnalyzeQuery);