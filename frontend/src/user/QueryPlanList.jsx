import React, {useEffect, useState} from 'react'
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
  const [queryData, setQueryData] = useState([{
    query_seq: '',
    error_msg: '',
    execute_time: '',
    insert_dt: '',
    query: '',
    return_data: '',
    rst: ''
  }]);

  useEffect(() => {
    const selectQuery = async () => {
      const response = await axios.get('/api/v1/query-list', {})
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
//    selectQuery().then(res => setQueryData(queryData.concat(res)));
    selectQuery().then(res => setQueryData(res));
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = queryData.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(queryData.length / recordsPerPage)

  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col">
              <Selectbox />
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

export default QueryPlanList