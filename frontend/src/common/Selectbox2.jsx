import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';

const Selectbox = ({sendDataToParent, selectType, val}) => {
  // const [dbSeq, setDbSeq] = useState('');
  let dbSeq = '';
  const [dbData, setDbData] = useState([{
    db_seq: '',
    db_host: '',
    db_port: '',
    nickname: '',
    db_user: '',
    resultdb_yn: ''
  }]);

  const [queryData, setQueryData] = useState([{
    query_seq: '',
    db_seq: [],
    test_scenario: '',
    error_msg: '',
    execute_time: '',
    insert_dt: '',
    query: '',
    return_data: '',
    rst: ''
  }]);

  const db_info = async () => {
    console.log('----------------')
    console.log(dbSeq)
    const response = await axios.get('/api/v1/dbconn-list', {params: {dbSeq:dbSeq}});
    console.log(response)
    const newDbData = await response.data.map((rowData) => ({
        db_seq: rowData.db_seq,
        db_host: rowData.db_host,
        db_port: rowData.db_port,
        nickname: rowData.nickname,
        db_user: rowData.db_user,
        resultdb_yn: rowData.resultdb_yn
      })
    );
    console.log(newDbData);
    setDbData(newDbData);
    // setDbData(dbData.concat(newDbData));
    // setDbData(...dbData, newDbData)
    // setQueryData([...queryData, queryDataTemp])
    console.log(dbData);
    return newDbData;
  };

  const query_info = async (item) => {
    console.log(item)
    const response = await axios.get('/api/v1/query-list2', /*{params: {dbSeq:item}}*/)
    const newQueryData = await response.data.map((rowData) => ({
        query_seq: rowData.query_seq,
        db_seq: rowData.db_seq,
        test_scenario: rowData.test_scenario,
        error_msg: rowData.error_msg,
        execute_time: rowData.execute_time,
        insert_dt: rowData.insert_dt,
        query: rowData.query,
        return_data: rowData.return_data,
        rst: rowData.rst
      })
    );
    console.log(newQueryData);
    // setQueryData(newQueryData => newQueryData);
    setQueryData(newQueryData);
    console.log(queryData);
    return newQueryData;
  };

  // useEffect(() => {
  //   db_info().then(res => {
  //     setDbData(res => res);
  //     console.log('useEffect db');
  //     console.log(dbData);
  //   });
  // }, [dbData]);

  useEffect(() => {
      db_info();
    }, [dbData]);

  useEffect(() => {
    query_info().then(res => {
      setQueryData(res => res);
      console.log('useEffect query');
      console.log(queryData);
    });
  }, [queryData]);

  const selectChange = (e) => {
    if(selectType === '') {
      console.log('change scenario');
      console.log(e.target.value)
      dbSeq = e.target.value;
      console.log(dbSeq)
      db_info().then(res => setDbData(res));
      // db_info(e.target.value).then(res => setDbData(res));
      sendDataToParent(e.target.value, 'db');
      // query_info(e.target.value).then(res => setQueryData(res));
      // sendDataToParent(e.target.value, 'scenario');
    } else if(selectType === 'dbList') {
      console.log('change db');
      db_info(e.target.value).then(res => setDbData(res));
      sendDataToParent(e.target.value, 'db');
    }
  };
  
  if(selectType === 'dbList') {
    console.log('dbList')
    console.log(dbData)
    return (
      <select onChange={selectChange} className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" defaultValue="0">
        <option value="">Database Connection Information</option>
        {dbData.map(item => (
          <option key={item.db_seq} value={item.db_seq}>{item.nickname}</option>
        ))}
      </select>
    )
  } else if(selectType === '') {
    console.log('scenarioList')
    return (
      <select onChange={selectChange} className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" defaultValue="0">
        <option value="">Scenario Information</option>
        {queryData.map(item => (
          <option key={item.query_seq} value={item.db_seq}>{item.test_scenario}</option>
        ))}
      </select>
    )
  }
}

export default Selectbox