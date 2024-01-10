import React from 'react';
import axios from 'axios';

const CompareQuery = ({data, sendDataToParent}) => {
  const explainQuery = async () => {
    const response = await axios.get('http://localhost:3001/api/v1/query-plan', {params: {first_query: data.first.query, second_query: data.second.query}});
    sendDataToParent(response.data);
  };

  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <div className="row">
            <div className="query_compare">
              <div className="queryplan_align">
                <div>
                  Scenario : {data.first !== undefined ? data.first.test_scenario : ''}
                </div>
                <div>
                  DB Connection : {data.first !== undefined ? data.first.nickname : ''}
                </div>
                <div>
                  Query Number : {data.first !== undefined ? data.first.query_seq : ''}
                </div>
                <div>
                  {data.first !== undefined ? data.first.query : ''}
                </div>
              </div>
            </div>
            <div className="query_compare">
              <div className="queryplan_align">
                <div>
                  Scenario : {data.second !== undefined ? data.second.test_scenario : ''}
                </div>
                <div>
                  DB Connection : {data.second !== undefined ? data.second.nickname : ''}
                </div>
                <div>
                  Query Number : {data.second !== undefined ? data.second.query_seq : ''}
                </div>
                <div>
                  {data.second !== undefined ? data.second.query : ''}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="card bg-primary text-white mb-4 mouse_hover margin10">
              <div className="card-body" onClick={explainQuery}>Explain Query</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default React.memo(CompareQuery);