import React from 'react';

const Admin = () => {
  return (
    <>
      <main>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="card shadow-lg border-0 rounded-lg mt-5">
                <div className="card-header">
                  <h3 className="text-center font-weight-light my-4">
                    Login Database
                  </h3>
                </div>
                <div className="card-body">
                  <form>
                    <div className="form-floating mb-3">
                      <input className="form-control" id="inputDbNickname" type="email" placeholder="Enter DB nickname" />
                      <label htmlFor="inputDbNickname">DB Nickname</label>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3 mb-md-0">
                          <input className="form-control" id="inputDbHost" type="text" placeholder="Enter DB host" />
                          <label htmlFor="inputDbHost">DB host</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input className="form-control" id="inputDbPort" type="text" placeholder="Enter DB port" />
                          <label htmlFor="inputDbPort">DB port</label>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3 mb-md-0">
                          <input className="form-control" id="inputDbUser" type="email" placeholder="Enter DB user" />
                          <label htmlFor="inputDbUser">DB User</label>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3 mb-md-0">
                          <input className="form-control" id="inputPassword" type="password" placeholder="Create a password" />
                          <label htmlFor="inputPassword">Password</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating mb-3 mb-md-0">
                          <input className="form-control" id="inputPasswordConfirm" type="password" placeholder="Confirm password" />
                          <label htmlFor="inputPasswordConfirm">
                            Confirm Password
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 mb-0">
                      <div className="d-grid">
                        <a className="btn btn-primary btn-block" href="/">Login</a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default React.memo(Admin);