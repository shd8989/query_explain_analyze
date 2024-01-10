import React, {useCallback, useEffect, useState} from 'react'
import axios from 'axios';
import {Selectbox, Selectbox2, Selectbox3} from '../common/Selectbox';
import Pagination from '../common/Pagination';
import * as XLSX from 'xlsx';

function QueryRow({data}) {
  return (
    <>
      {data.map(item => (
        <tr key={item.first_seq}>
          <td>{item.first_query_seq}</td>
          <td>{item.first_is_success}</td>
          <td>{item.first_exec_time !== '' && Number(item.first_exec_time) >= 10 ? Number(item.first_exec_time).toFixed(1) : item.first_exec_time}</td>
          <td>{item.second_query_seq}</td>
          <td>{item.second_is_success}</td>
          <td>{item.second_exec_time !== '' && Number(item.second_exec_time) >= 10 ? Number(item.second_exec_time).toFixed(1) : item.second_exec_time}</td>
          <td>{
            item.first_is_success === 'Success' && item.second_is_success === 'Success' && Number(item.first_exec_time) < Number(item.second_exec_time) ? item.first_nickname
            : item.first_is_success === 'Success' && item.second_is_success === 'Success' && Number(item.first_exec_time) > Number(item.second_exec_time) ? item.second_nickname
            : item.first_is_success === 'Success' && item.second_is_success === 'Success' && item.first_exec_time === item.second_exec_time ? '동일'
            : item.first_is_success === 'Success' && item.second_is_success === 'Fail' ? item.first_nickname
            : item.first_is_success === 'Fail' && item.second_is_success === 'Success' ? item.second_nickname
            : item.first_is_success === 'Fail' && item.second_is_success === 'Fail' ? '측정 불가' : ''
          }</td>
          <td>{
            item.first_is_success === 'Success' && item.second_is_success === 'Success' && Number(item.first_exec_time) < Number(item.second_exec_time) ? (item.second_exec_time / item.first_exec_time).toFixed(2)
            : item.first_is_success === 'Success' && item.second_is_success === 'Success' && Number(item.first_exec_time) > Number(item.second_exec_time) ? (item.first_exec_time / item.second_exec_time).toFixed(2)
            : item.first_is_success === 'Success' && item.second_is_success === 'Success' && item.first_exec_time === item.second_exec_time ? '동일'
            : item.first_is_success === 'Success' && item.second_is_success === 'Fail' ? item.first_nickname
            : item.first_is_success === 'Fail' && item.second_is_success === 'Success' ? item.second_nickname
            : item.first_is_success === 'Fail' && item.second_is_success === 'Fail' ? '측정 불가' : ''
          }</td>
        </tr>
      ))}
    </>
  )
}

const QueryPlanList = () => {
  const [queryData, setQueryData] = useState([{
    first_seq: '',
    first_scenario: '',
    first_nickname: '',
    first_query_seq: '',
    first_is_success: '',
    first_exec_time: '',
    second_seq: '',
    second_scenario: '',
    second_nickname: '',
    second_query_seq: '',
    second_is_success: '',
    second_exec_time: ''
  }]);
  const [scenario1, setScenario1] = useState('');
  const [scenario2, setScenario2] = useState('');
  const [dbSeq1, setDbSeq1] = useState(0);
  const [dbSeq2, setDbSeq2] = useState(0);

  const selectQuery = async () => {
    setDbSeq1(dbSeq1 => dbSeq1);
    setScenario1(scenario1 => scenario1);
    let params = {};
    if(scenario1 !== '' && dbSeq1 !== 0 && dbSeq1 !== '' && scenario2 !== '' && dbSeq2 !== 0 && dbSeq1 !== '') {
      params = {params:{first_scenario: scenario1, first_db_seq: dbSeq1, second_scenario: scenario2, second_db_seq: dbSeq2}};
      const response = await axios.get('http://localhost:3001/api/v1/query-plan-list', params);
      const newQueryData = await response.data.map((rowData) => ({
          first_seq: rowData.first_seq,
          first_scenario: rowData.first_scenario,
          first_nickname: rowData.first_nickname,
          first_query_seq: rowData.first_query_seq,
          first_is_success: rowData.first_is_success,
          first_exec_time: rowData.first_exec_time,
          second_seq: rowData.second_seq,
          second_scenario: rowData.second_scenario,
          second_nickname: rowData.second_nickname,
          second_query_seq: rowData.second_query_seq,
          second_is_success: rowData.second_is_success,
          second_exec_time: rowData.second_exec_time
        })
      );
      setQueryData(newQueryData);
    }
  };

  useEffect(() => {
    selectQuery();
  }, [dbSeq1, dbSeq2]);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = queryData.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(queryData.length / recordsPerPage);

  const sendDataToParent = useCallback((data, ordinalNumber) => {
    if(ordinalNumber === 'first') {
      setScenario1(preScenario => data);
    } else if(ordinalNumber === 'second') {
      setScenario2(preScenario => data);
    }
  }, [scenario1, scenario2]);

  const sendDataToParent2 = useCallback((data, ordinalNumber) => {
    if(ordinalNumber === 'first') {
      setDbSeq1(preDbSeq => data);
    } else if(ordinalNumber === 'second') {
      setDbSeq2(preDbSeq => data);
    }
  }, [dbSeq1, dbSeq2]);

  const excelDownload = (excelData) => {
    if(excelData.length > 0) {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, "result.xlsx");
    } else {
      alert('엑셀에 저장할 데이터가 없습니다.');
    }
  }

  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col">
              <div className="form-select-lg mb-3">DB1</div>
              <div className="form-select-lg mb-3">DB2</div>
            </div>
            <div className="col">
              <Selectbox sendDataToParent={sendDataToParent} ordinalNumber={'first'} />
              <Selectbox sendDataToParent={sendDataToParent} ordinalNumber={'second'} />
            </div>
            <div className="col">
              <Selectbox2 sendDataToParent={sendDataToParent2} ordinalNumber={'first'} scenario={scenario1} />
              <Selectbox2 sendDataToParent={sendDataToParent2} ordinalNumber={'second'} scenario={scenario2} />
            </div>
          </div>
          <div className="margin10 flex_align_item">
            <div></div>
            <div className="card bg-primary text-white mb-4 mouse_hover btn_download btn_wrap">
              <div className="card-body" onClick={() => excelDownload(queryData)}>엑셀 다운로드</div>
            </div>
          </div>
          <div className="row">
            <table className="table">
              <thead>
                <tr>
                  <th colSpan="3">Database1</th>
                  <th colSpan="3">Database2</th>
                  <th rowSpan="2" className='header_rowspan'>Faster</th>
                  <th rowSpan="2" className='header_rowspan'>Rate</th>
                </tr>
                <tr>
                  <th scope="col">Query No</th>
                  <th scope="col">Success</th>
                  <th scope="col">Exec Time(ms)</th>
                  <th scope="col">Query No</th>
                  <th scope="col">Success</th>
                  <th scope="col">Exec Time(ms)</th>
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