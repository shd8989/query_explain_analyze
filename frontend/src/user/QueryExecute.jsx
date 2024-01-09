import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {Selectbox, Selectbox2, Selectbox3} from '../common/Selectbox'

const QueryExecute = () => {
  const [text, setText] = useState('');
  const [multiQueries, setMultiQueries] = useState([]);
  const [dbSeq, setDbSeq] = useState('');
  const [scenario, setScenario] = useState('');

  const execQuery = async () => {
    setText(text => text);
    setDbSeq(dbSeq => dbSeq);
    setScenario(scenario => scenario);
    if(text !== '' && dbSeq !== '' && scenario !== '') {
      await axios.post('/api/v1/exec-single-query', {
        query: text,
        dbSeq: dbSeq,
        scenario: scenario
      })
      .then(response => {
        if(response.status === 200 && response.data === "OK") {
          alert('입력한 쿼리를 저장하였습니다.');
        } else {
          alert('데이터베이스 연결에 실패하였습니다.');
        }
      });
    }
  };

  const fileUpload = async () => {
    setMultiQueries(multiQueries => multiQueries);
    setScenario(scenario => scenario);
    if(multiQueries && dbSeq !== '' && scenario !== '') {
      await axios.post('/api/v1/exec-multi-query', {
        data: multiQueries,
        dbSeq: dbSeq,
        scenario: scenario
      })
      .then(response => {
        if(response.status === 200 && response.data === "OK") {
          alert('파일에 저장된 쿼리를 저장하였습니다.');
        } else {
          alert('데이터베이스 연결에 실패하였습니다.');
        }
      });
    }
  };
  
  const fileChange = useCallback(async (e) => {
    if (e) {
      const file = e[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array", bookVBA: true });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const queries = XLSX.utils.sheet_to_json(sheet);
        queries.forEach((item) => {
          setMultiQueries(multiQueries => [...multiQueries, item.query]);
        });
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const fileDownload = () => {
    fetch("assets/files/multi_query.xlsx")
      .then(res => res.arrayBuffer())
      .then(data => {
        const wb = XLSX.read(data, { type: "array" });
        XLSX.writeFile(wb, "sample.xlsx");
      });
  }

  function textChange(e) {
    setText(e.target.value);
  };

  function scenarioChange(e) {
    setScenario(e.target.value);
  };

  useEffect(() => {
    execQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fileUpload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendDataToParent = useCallback((data) => {
    setDbSeq(data);
  }, []);

  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col">
              <h2 className="mt-4">Execute a single query</h2>
              <Selectbox2 sendDataToParent={sendDataToParent} ordinalNumber={'-1'} scenario={scenario} />
              <div className="form-floating margin10">
                <input className="form-control" onChange={(e) => scenarioChange(e)} id="scenarioSingle" type="text" />
                <label htmlFor="scenarioMulti">Single Scenario</label>
              </div>
              <div className="form-floating margin10">
                <input className="form-control" onChange={(e) => textChange(e)} id="floatingTextarea" type="text" />
                <label htmlFor="scenarioMulti">Query</label>
              </div>
              <div className="col-xl-3 col-md-6">
                <div className="card bg-primary text-white mb-4 mouse_hover">
                  <div className="card-body" onClick={execQuery}>Execute Single Query</div>
                </div>
              </div>
            </div>
            <div className="col">
              <h2 className="mt-4">File upload with query</h2>
              <Selectbox2 sendDataToParent={sendDataToParent} ordinalNumber={'-1'} scenario={scenario} />
              <div className="form-floating margin10">
                <input className="form-control" onChange={(e) => scenarioChange(e)} id="scenarioMulti" type="text" />
                <label htmlFor="scenarioMulti">Multi Scenario</label>
              </div>
              <div className="margin10 flex_align_item">
                <input className="form-control" type="file" id="formFile" onChange={(e) => fileChange(e.target.files)} accept=".xlsx, .xls" />
                <div className="card bg-primary text-white mb-4 mouse_hover btn_download">
                  <div className="card-body" onClick={() => fileDownload()}>샘플 다운로드</div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6">
                <div className="card bg-primary text-white mb-4 mouse_hover">
                  <div className="card-body" onClick={fileUpload}>Execute Multi Queries</div>
                </div>
              </div>
              <div className="warning_font">(Warning) This only reads data from the first sheet.</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default React.memo(QueryExecute);