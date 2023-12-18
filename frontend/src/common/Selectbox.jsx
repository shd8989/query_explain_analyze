import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Selectbox = ({sendDataToParent, id}) => {
  const [data, setData] = useState([{
    db_seq: '',
    db_host: '',
    db_port: '',
    nickname: '',
    db_user: '',
    resultdb_yn: ''
  }]);
  const [scenario, setScenario] = useState([{
    test_scenario: ''
  }]);

  useEffect(() => {
    const scenario = async () => {
      const response = await axios.get('/api/v1/scenario-list', {})
      const newData = await response.data.map((rowData) => ({
        test_scenario: rowData.test_scenario
        })
      )
      return newData;
    };
    scenario().then(res => setScenario(res));
  }, []);

  useEffect(() => {
    const dbConn = async () => {
      const response = await axios.get('/api/v1/dbconn-list', {})
      const newData = await response.data.map((rowData) => ({
          db_seq: rowData.db_seq,
          db_host: rowData.db_host,
          db_port: rowData.db_port,
          nickname: rowData.nickname,
          db_user: rowData.db_user,
          resultdb_yn: rowData.resultdb_yn
        })
      )
      return newData;
    };
    dbConn().then(res => setData(res));
  }, []);

  const selectChange = (e) => {
    if(id === 'dbList') {
      sendDataToParent(e.target.value, 'db');
    } else if(id === 'scenarioList') {
      sendDataToParent(e.target.value, 'scenario')
    }
    
  };
  
  if(id === 'dbList') {
    return (
      <select onChange={selectChange} className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" defaultValue="0">
        <option value="">Database Connection Information</option>
        {data.map(item => (
          <option key={item.db_seq} value={item.db_seq}>{item.nickname}</option>
        ))}
      </select>
    )
  } else if(id === 'scenarioList') {
    return (
      <select onChange={selectChange} className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" defaultValue="0">
        <option value="">Scenario Information</option>
          {scenario.map(item => (
            <option key={item.test_scenario} value={item.test_scenario}>{item.test_scenario}</option>
          ))}
      </select>
    )
  }
}

export default Selectbox