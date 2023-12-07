import React, {useEffect, useState} from 'react'
import axios from 'axios';
import Selectbox from '../common/Selectbox'

function QueryRow({seq, query, rst, extime}) {
  return (
    <>
      <tr>
        <th scope="row">{seq}</th>
        <td>{extime}</td>
        <td>{rst}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
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
  }, [])

  const QueryRowList = queryData.map(data => (
    <QueryRow key={data.query_seq} seq={data.query_seq} query={data.query} rst={data.rst} extime={data.execute_time} />
  ));

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
                {QueryRowList}
              </tbody>
            </table>
          </div>
          <div className="col">
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className="page-item">
                  <a className="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">«</span>
                    <span className="sr-only">Previous</span>
                  </a>
                </li>
                <li className="page-item"><a className="page-link" href="#">1</a></li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item">
                  <a className="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">»</span>
                    <span className="sr-only">Next</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </main>
    </>
  );
};

export default QueryPlanList