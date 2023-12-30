import React from 'react';

const QueryPlanText = ({resultFirst, resultSecond}) => {
  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col">
              <div className="text-nowrap">
                <p className="queryplan_align">
                  {resultFirst}
                </p>
              </div>
            </div>
            <div className="col">
              <div className="text-nowrap">
                <p className="queryplan_align">
                  {resultSecond}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default React.memo(QueryPlanText);