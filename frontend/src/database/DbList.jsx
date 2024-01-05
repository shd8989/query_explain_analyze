import React, {useEffect, useState} from 'react'
import axios from 'axios';
import Pagination from '../common/Pagination';

function QueryRow({data}) {
  return (
    <>
      {data.map(item => (
        <tr key={item.db_seq}>
          <td>{item.db_seq}</td>
          <td>{item.nickname}</td>
          <td>{item.db_host}</td>
          <td>{item.db_port}</td>
          <td>{item.db_name}</td>
          <td>{item.db_user}</td>
          <td>{item.resultdb_yn === 'T' ? 'Test' : 'Basic'}</td>
          <td>{item.insert_dt.replace('T', ' ').split(".")[0]}</td>
        </tr>
      ))}
    </>
  )
}

const DbList = () => {
  const [queryData, setQueryData] = useState([{
    db_seq: '',
    nickname: '',
    db_host: '',
    db_port: '',
    db_name: '',
    db_user: '',
    db_user_pw: '',
    resultdb_yn: '',
    insert_dt: ''
  }]);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = queryData.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(queryData.length / recordsPerPage)

  useEffect(() => {
    const selectQuery = async () => {
      const response = await axios.get('/api/v1/dbconn-list', {});
      const newQueryData = await response.data.map((rowData) => ({
          db_seq: rowData.db_seq,
          nickname: rowData.nickname,
          db_host: rowData.db_host,
          db_port: rowData.db_port,
          db_name: rowData.db_name,
          db_user: rowData.db_user,
          db_user_pw: rowData.db_user_pw,
          resultdb_yn: rowData.resultdb_yn,
          insert_dt: rowData.insert_dt
        })
      )
      return newQueryData;
    };
    selectQuery().then(res => setQueryData(res));
  }, []);

  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <div className="row">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">DB Nickname</th>
                  <th scope="col">Host</th>
                  <th scope="col">Port</th>
                  <th scope="col">DB Name</th>
                  <th scope="col">DB User</th>
                  <th scope="col">Type</th>
                  <th scope="col">Insert Date</th>
                </tr>
              </thead>
              <tbody>
                <QueryRow data={currentRecords} key={currentRecords.db_seq} />
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

export default DbList