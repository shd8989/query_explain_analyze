import React, {useCallback, useEffect, useState} from 'react'
import axios from 'axios';
import Selectbox from '../common/Selectbox';
import Pagination from '../common/Pagination';

function QueryRow({data}) {
  return (
    <>
      {data.map(item => (
        <tr key={item.query_seq}>
          <th scope="row">{item.query_seq}</th>
          <td>{item.extime}</td>
          <td>{item.rst}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      ))}
    </>
  )
}

const QueryPlanList = () => {
  const [dbSeq, setDbSeq] = useState('');
  const [testScenario, setTestScenario] = useState('');
  const [queryData, setQueryData] = useState([{
    query_seq: '',
    error_msg: '',
    execute_time: '',
    insert_dt: '',
    query: '',
    return_data: '',
    rst: ''
  }]);

  const selectQuery = async (test_scenario, db_seq) => {
    setDbSeq(dbSeq => dbSeq);
    setTestScenario(testScenario => testScenario);
    const response = await axios.get('/api/v1/query-plan-list', {params: {test_scenario: test_scenario, db_seq: db_seq}})
    const newQueryData = await response.data.map((rowData) => ({
        query_seq: rowData.query_seq,
        error_msg: rowData.error_msg,
        execute_time: rowData.execute_time,
        insert_dt: rowData.insert_dt,
        query: rowData.query,
        return_data: rowData.return_data,
        rst: rowData.rst
      })
    )
    // setQueryData(queryData.concat(newQueryData))
    // setQueryData([...queryData, queryDataTemp]);
    return newQueryData;
  };

  useEffect(() => {
    // const selectQuery = async (param1) => {
    //   const response = await axios.get('/api/v1/query-list', {})
    //   const newQueryData = await response.data.map((rowData) => ({
    //       query_seq: rowData.query_seq,
    //       error_msg: rowData.error_msg,
    //       execute_time: rowData.execute_time,
    //       insert_dt: rowData.insert_dt,
    //       query: rowData.query,
    //       return_data: rowData.return_data,
    //       rst: rowData.rst
    //     })
    //   )
    //   // setQueryData(queryData.concat(newQueryData))
    //   // setQueryData([...queryData, queryDataTemp]);
    //   return newQueryData;
    // };
//    selectQuery().then(res => setQueryData(queryData.concat(res)));
    selectQuery('', '').then(res => setQueryData(res));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = queryData.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(queryData.length / recordsPerPage);

  const sendDataToParent = useCallback((item, selectType) => {
    if(selectType === 'scenario') {
      setTestScenario(item);
      // db_seq와 test_scenario가 set 되어야하는데 안됨
      selectQuery(item, '').then(res => setQueryData(res));
    } else if(selectType === 'db') {
      setDbSeq(item);
      selectQuery('', item).then(res => setQueryData(res));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col">
              <Selectbox sendDataToParent={sendDataToParent} id={'scenarioList'} />
            </div>
            <div className="col">
              <Selectbox sendDataToParent={sendDataToParent} id={'dbList'} />
              <Selectbox sendDataToParent={sendDataToParent} id={'dbList'} />
            </div>
          </div>
          <div className="row">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Query No</th>
                  <th scope="col">Database1</th>
                  <th scope="col">Success</th>
                  <th scope="col">Query No</th>
                  <th scope="col">Database2</th>
                  <th scope="col">Success</th>
                  <th scope="col">Faster</th>
                  <th scope="col">Rate</th>
                </tr>
              </thead>
              <tbody>
                <QueryRow data={currentRecords} key={currentRecords.query_seq} />
              </tbody>
            </table>
          </div>
          <Pagination
            nPages={nPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </main>
    </>
  );
};

export default React.memo(QueryPlanList);