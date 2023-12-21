import React from 'react'

const CompareQuery = () => {
    return (
      <>
        <main>
          <div className="container-fluid px-4">
            <div className="row">
              <div className="col">
                <div className="text-nowrap">
                  This text should overflow the parent.
                </div>
              </div>
              <div className="col">
                <div className="text-nowrap">
                  This text should overflow the parent.
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="text-nowrap">
                  This text should overflow the parent.
                </div>
              </div>
              <div className="col">
                <div className="text-nowrap">
                  This text should overflow the parent.
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-3 col-md-6">
                <div className="card bg-primary text-white mb-4">
                  <div className="card-body">Success Card</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
};

export default CompareQuery