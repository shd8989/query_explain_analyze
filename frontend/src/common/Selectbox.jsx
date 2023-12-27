import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Selectbox = ({sendDataToParent, ordinalNumber}) => {
  const [scenario, setScenario] = useState([{
    test_scenario: '',
    db_seq: []
  }]);

  useEffect(() => {
    const scenario_info = async () => {
      const response = await axios.get('/api/v1/select-scenario', {})
      const newData = await response.data.map((rowData) => ({
          test_scenario: rowData.test_scenario,
          db_seq: rowData.db_seq
        })
      )
      return newData;
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
  
  useEffect(() => {
    const db_info = async () => {
      let params = {};
      if(ordinalNumber !== '-1' && scenario !== '') {
        params = {};
      } else {
        params = {params: {test_scenario: scenario}};
      }
      const response = await axios.get('/api/v1/select-db', params)
      const newData = await response.data.map((rowData) => ({
          nickname: rowData.nickname,
          db_seq: rowData.db_seq
        })
      )
      return newData;
    };
    db_info().then(res => setDb(res));
  }, []);

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

  useEffect(() => {
    const query_info = async () => {
      const response = await axios.get('/api/v1/select-query', {params: {db_seq: dbSeq}})
      const newData = await response.data.map((rowData) => ({
          query_seq: rowData.query_seq,
          query: rowData.query
        })
      )
      return newData;
    };
    query_info().then(res => setQuery(res));
  }, [dbSeq]);

  const selectChange = (e) => {
    sendDataToParent(e.target.value, ordinalNumber)
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