import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Admin = () => {
  // const [formData, setFormData] = useState([{
  //   nickname: '',
  //   host: '',
  //   port: '',
  //   dbname: '',
  //   dbuser: '',
  //   dbuserpw: '',
  //   rst: ''
  // }]);
  const [nickname, setNickname] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState(5432);
  const [dbname, setDbname] = useState('postgres');
  const [dbuser, setDbuser] = useState('');
  const [dbuserpw, setDbuserpw] = useState('');

  const createDb = async () => {
    if(host !== '') {
      await axios.post('/api/v1/createdb', {
        host: host,
        port: port,
        dbname: dbname,
        dbuser: dbuser,
        dbuserpw: dbuserpw
      })
      .then(response => {console.log(response);});
    }
  };

  function onChange(e) {
    if(e.target.id === 'inputDbNickname') {
      setNickname(e.target.value)
    } else if(e.target.id === 'inputDbHost') {
      setHost(e.target.value)
    } else if(e.target.id === 'inputDbPort') {
      setPort(e.target.value)
    } else if(e.target.id === 'inputDbName') {
      setDbname(e.target.value)
    } else if(e.target.id === 'inputDbUser') {
      setDbuser(e.target.value)
    } else if(e.target.id === 'inputPassword') {
      setDbuserpw(e.target.value)
    }
  };

  useEffect(() => {
    createDb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                      <input className="form-control" id="inputDbNickname" type="text" placeholder="Enter DB nickname" onChange={onChange} />
                      <label htmlFor="inputDbNickname">DB Nickname</label>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3 mb-md-0">
                          <input className="form-control" id="inputDbHost" type="text" placeholder="Enter DB host" onChange={onChange} />
                          <label htmlFor="inputDbHost">DB host</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input className="form-control" id="inputDbPort" type="text" placeholder="Enter DB port" onChange={onChange} />
                          <label htmlFor="inputDbPort">DB port</label>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3 mb-md-0">
                          <input className="form-control" id="inputDbName" type="text" placeholder="Enter DB name" onChange={onChange} />
                          <label htmlFor="inputDbName">DB Name</label>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3 mb-md-0">
                          <input className="form-control" id="inputDbUser" type="text" placeholder="Enter DB user" onChange={onChange} />
                          <label htmlFor="inputDbUser">DB User</label>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3 mb-md-0">
                          <input className="form-control" id="inputPassword" type="password" placeholder="Create a password" onChange={onChange} />
                          <label htmlFor="inputPassword">Password</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating mb-3 mb-md-0">
                          <input className="form-control" id="inputPasswordConfirm" type="password" placeholder="Confirm password" onChange={onChange} />
                          <label htmlFor="inputPasswordConfirm">
                            Confirm Password
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 mb-0">
                      <div className="card bg-primary text-white mb-4">
                        <div className="card-body" onClick={createDb}>Create Database</div>
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