import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Contents = () => {
  const [text, setText] = useState('');

  const execQuery = async () => {
    setText(text => text);
    if(text !== '') {
      await axios.post('/api/v1/single-query', {
        query: text
      })
      .then(response => {console.log(response);});
    }
  };

  function onChange(e) {
    setText(e.target.value);
  }

  useEffect(() => {
    execQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col">
              <h1 className="mt-4">File upload with query</h1>
              <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" defaultValue="0">
                <option value="0">Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
              <input className="form-control" type="file" id="formFile" />
              <div className="col-xl-3 col-md-6">
                <div className="card bg-primary text-white mb-4">
                  <div className="card-body">Success Card</div>
                </div>
              </div>
            </div>
            <div className="col">
              <h1 className="mt-4">Execute a query</h1>
              <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" defaultValue="0">
                <option value="0">Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
              <div className="form-floating">
                <textarea className="form-control" onChange={onChange} id="floatingTextarea"></textarea>
              </div>
              <div className="col-xl-3 col-md-6">
                <div className="card bg-primary text-white mb-4">
                  <div className="card-body" onClick={execQuery}>Execute</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default React.memo(Contents);