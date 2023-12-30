import React from 'react';

const QueryPlanText = ({resultFirst, resultSecond}) => {
  const regex = /\]/;
  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col">
              <div className="text-nowrap">
                <p className="queryplan_align">
                  {
                    resultFirst.split('\n')
                    .map(line => {
                      if(line.substring(0, 1) !== ('P' || 'E')) {
                        return line.replace(line.substring(0, Number(line.lastIndexOf(line.match(regex)))+1), '') + '\n'
                      } else if(line.substring(0, 1) === 'P') {
                        return line + '\n';
                      } else {
                        return line;
                      }
                    })
                  }
                </p>
              </div>
            </div>
            <div className="col">
              <div className="text-nowrap">
                <p className="queryplan_align">
                  {
                    resultSecond.split('\n')
                    .map(line => {
                      if(line.substring(0, 1) !== ('P' || 'E')) {
                        return line.replace(line.substring(0, Number(line.lastIndexOf(line.match(regex)))+1), '') + '\n'
                      } else if(line.substring(0, 1) === 'P') {
                        return line + '\n';
                      } else {
                        return line;
                      }
                    })
                  }
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