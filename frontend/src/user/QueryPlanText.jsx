import React, {useEffect, useState} from 'react';
import axios from 'axios';

const QueryPlanText = (data) => {
  console.log(data);
  const [queryPlan, setQueryPlan] = useState({
    first_plan: '',
    second_plan: ''
  });

  useEffect(() => {
    const query_plan_info = async () => {
      let params = {};
      if(data.data.first !== undefined) {
        params = {params: {query: data.data.first.query}};
        const response = await axios.get('/api/v1/query-plan', params)
        const newData = await response.data.map((rowData) => ({
            first_plan: rowData.first_plan
          })
        )
        setQueryPlan((preQueryPlan) => ({
          ...preQueryPlan,
          first: {
            first_plan: newData[0].first_plan
          }
        }));
        return newData;
      } else if(data.data.second !== undefined) {
        params = {params: {query: data.data.second.query}};
        const response = await axios.get('/api/v1/query-plan', params)
        const newData = await response.data.map((rowData) => ({
            second_plan: rowData.second_plan
          })
        )
        setQueryPlan((preQueryPlan) => ({
          ...preQueryPlan,
          second: {
            second_plan: newData[0].second_plan
          }
        }));
      }
      
      // if(params.params !== undefined && (data.data.first.query !== '' || data.data.first.query !== '')) {
      //   const response = await axios.get('/api/v1/query-plan', params)
      //   const newData = await response.data.map((rowData) => ({
      //       test_scenario: rowData.test_scenario,
      //       nickname: rowData.nickname,
      //       query_seq: rowData.query_seq,
      //       query: rowData.query
      //     })
      //   )
      //   return newData;
      // };
    }
    query_plan_info();
  }, [queryPlan]);
  console.log(queryPlan)

  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col">
              <div className="text-nowrap">
                Query Plan(Text)
              </div>
            </div>
            <div className="col">
              <div className="text-nowrap">
                Query Plan(Text)
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default React.memo(QueryPlanText);