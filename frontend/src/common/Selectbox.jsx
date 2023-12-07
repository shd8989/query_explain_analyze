import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Selectbox = ({ sendDataToParent }) => {
  const [data, setData] = useState([{
    db_seq: '',
    db_host: '',
    db_port: '',
    nickname: '',
    db_user: '',
    resultdb_yn: ''
  }]);

  useEffect(() => {
    const dbConn = async () => {
      const response = await axios.get('/api/v1/db-conn-info', {})
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
    sendDataToParent(e.target.value);
  };
  
  return (
    <select onChange={selectChange} className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" defaultValue="0">
      <option value="0">Database Connection Information</option>
      {data.map(item => (
        <option key={item.db_seq} value={item.db_seq}>{item.nickname}</option>
      ))}
    </select>
  )
}

export default Selectbox