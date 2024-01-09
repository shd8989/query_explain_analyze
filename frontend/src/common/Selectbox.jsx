import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router";

const Selectbox = ({sendDataToParent, ordinalNumber}) => {
  const [scenario, setScenario] = useState([{
    test_scenario: '',
    db_seq: []
  }]);
  const navigate = useNavigate();

  useEffect(() => {
    const scenario_info = async () => {
      const response = await axios.get('/api/v1/select-scenario', {});
      if(response.data === 'ECONNREFUSED') {
        alert('데이터베이스 연결 에러입니다.');
        navigate("/dbconn_create");
      } else {
        const newData = await response.data.map((rowData) => ({
            test_scenario: rowData.test_scenario,
            db_seq: rowData.db_seq
          })
        );
        return newData;
      }
    };
    scenario_info().then(res => setScenario(res));
  }, []);

  const selectChange = (e) => {
    sendDataToParent(e.target.value, ordinalNumber)
  };

  return (
    <select onChange={selectChange} className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" defaultValue="0">
      <option value="">Scenario Information</option>
        {scenario.map(item => (
          <option key={item.test_scenario} value={item.test_scenario}>{item.test_scenario}</option>
        ))}
    </select>
  )
}

const Selectbox2 = ({sendDataToParent, ordinalNumber, scenario}) => {
  const [db, setDb] = useState([{
    nickname: '',
    db_seq: ''
  }]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const db_info = async () => {
      let params = {};
      if((ordinalNumber === 'first' || ordinalNumber === 'second') && scenario !== '') {
        params = {params: {test_scenario: scenario}};
      } else {
        params = {};
      }
      const response = await axios.get('/api/v1/select-db', params);
      if(response.data === 'ECONNREFUSED') {
        alert('데이터베이스 연결 에러입니다.');
        navigate("/dbconn_create");
      } else {
        const newData = await response.data.map((rowData) => ({
            nickname: rowData.nickname,
            db_seq: rowData.db_seq
          })
        );
        return newData;
      }
    };
    db_info().then(res => setDb(res));
  }, [scenario]);

  const selectChange = (e) => {
    sendDataToParent(e.target.value, ordinalNumber);
  };
  
  return (
    <select onChange={selectChange} className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" defaultValue="0">
      <option value="">Database Connection Information</option>
      {db.map(item => (
        <option key={item.db_seq} value={item.db_seq}>{item.nickname}</option>
      ))}
    </select>
  )
}

const Selectbox3 = ({sendDataToParent, ordinalNumber, dbSeq}) => {
  const [query, setQuery] = useState([{
    query_seq: '',
    query: ''
  }]);

  const query_info = async () => {
    let params = {};
    if(ordinalNumber !== '-1' && dbSeq !== '') {
      params = {params: {db_seq: dbSeq}};
    } else {
      params = {};
    }
    const response = await axios.get('/api/v1/select-query', params);
    const newData = await response.data.map((rowData) => ({
        query_seq: rowData.query_seq,
        query: rowData.query
      })
    );
    return newData;
  };

  useEffect(() => {
    query_info().then(res => setQuery(res));
  }, [dbSeq]);

  const selectChange = (e) => {
    sendDataToParent(e.target.value, ordinalNumber);
  };

  return (
    <select onChange={selectChange} className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" defaultValue="0">
      <option value="">Query Information</option>
        {query.map(item => (
          <option key={item.query_seq} value={item.query_seq}>{item.query}</option>
        ))}
    </select>
  )
}

export default React.memo(Selectbox);
export {Selectbox, Selectbox2, Selectbox3};