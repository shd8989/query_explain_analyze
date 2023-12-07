import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Selectbox from '../common/Selectbox'

const QueryExecute = () => {
  const [text, setText] = useState('');
  const [multiQueries, setMultiQueries] = useState([]);
  const [dbSeq, setDbSeq] = useState('');

  const execQuery = async () => {
    setText(text => text);
    setDbSeq(dbSeq => dbSeq);
    if(text !== '' && dbSeq !== '') {
      await axios.post('/api/v1/single-query', {
        query: text,
        dbSeq: dbSeq
      })
      .then(response => {console.log(response);});
    }
  };

  const fileUpload = async () => {
    setMultiQueries(multiQueries => multiQueries);
    if(multiQueries && dbSeq !== '') {
      await axios.post('/api/v1/multi-query', {
        data: multiQueries,
        dbSeq: dbSeq
      })
      .then(response => {console.log(response);});
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

  function textChange(e) {
    setText(e.target.value);
  };

  useEffect(() => {
    execQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fileUpload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendDataToParent = useCallback((item) => {
    setDbSeq(item);
  }, []);

  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col">
              <h1 className="mt-4">File upload with query</h1>
              <Selectbox sendDataToParent={sendDataToParent} />
              <input className="form-control" type="file" id="formFile" onChange={(e) => fileChange(e.target.files)} accept=".xlsx, .xls" />
              <div className="warning_font">(Warning) This only reads data from the first sheet.</div>
              <div className="col-xl-3 col-md-6">
                <div className="card bg-primary text-white mb-4">
                  <div className="card-body" onClick={fileUpload}>Execute Multi Queries</div>
                </div>
              </div>
            </div>
            <div className="col">
              <h1 className="mt-4">Execute a query</h1>
              <Selectbox sendDataToParent={sendDataToParent} />
              <div className="form-floating">
                <textarea className="form-control" onChange={(e) => textChange(e)} id="floatingTextarea"></textarea>
              </div>
              <div className="col-xl-3 col-md-6">
                <div className="card bg-primary text-white mb-4">
                  <div className="card-body" onClick={execQuery}>Execute Single Query</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default React.memo(QueryExecute);