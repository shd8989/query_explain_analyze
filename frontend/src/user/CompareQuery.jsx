import React from 'react';

const CompareQuery = (data) => {
  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col">
              <div className="text-nowrap">
                <div>
                  Scenario : {data.data.first !== undefined ? data.data.first.test_scenario : ''}
                </div>
                <div>
                  DB Connection : {data.data.first !== undefined ? data.data.first.nickname : ''}
                </div>
                <div>
                  Query Number : {data.data.first !== undefined ? data.data.first.query_seq : ''}
                </div>
              </div>
            </div>
            <div className="col">
              <div className="text-nowrap">
                <div>
                  Scenario : {data.data.second !== undefined ? data.data.second.test_scenario : ''}
                </div>
                <div>
                  DB Connection : {data.data.second !== undefined ? data.data.second.nickname : ''}
                </div>
                <div>
                  Query Number : {data.data.second !== undefined ? data.data.second.query_seq : ''}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="text-nowrap">
                <div>
                  {data.data.first !== undefined ? data.data.first.query : ''}
                </div>
              </div>
            </div>
            <div className="col">
              <div className="text-nowrap">
                <div>
                  {data.data.second !== undefined ? data.data.second.query : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default React.memo(CompareQuery);