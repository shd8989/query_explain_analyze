import React, {useState} from 'react';
import axios from 'axios';

const Admin = () => {
  const [nickname, setNickname] = useState('');
  const [dbHost, setDbHost] = useState('');
  const [dbPort, setDbPort] = useState(5432);
  const [dbName, setDbName] = useState('postgres');
  const [dbUser, setDbUser] = useState('');
  const [dbUserPw, setDbUserPw] = useState('');
  const [dbUserPwConfirm, setDbUserPwConfirm] = useState('');
  const [resultDbYn, setResultDbYn] = useState('T');


  const createDb = async () => {
    setNickname(nickname => nickname);
    setDbHost(dbHost => dbHost);
    setDbPort(dbPort => dbPort);
    setDbName(dbName => dbName);
    setDbUser(dbUser => dbUser);
    setDbUserPw(dbUserPw => dbUserPw);
    setDbUserPwConfirm(dbUserPwConfirm => dbUserPwConfirm);
    setResultDbYn(resultDbYn => resultDbYn);

    if(dbHost !== '' && dbPort !== '' && dbName !== '' && dbUser !=='' && dbUserPw !== '') {
      await axios.post('/api/v1/createdb', {
        nickname: nickname,
        dbHost: dbHost,
        dbPort: dbPort,
        dbName: dbName,
        dbUser: dbUser,
        dbUserPw: dbUserPw,
        resultDbYn: resultDbYn
      })
      .then(response => {console.log(response);});
    }
  };

  function handleChange(e) {
    if(e.target.id === 'inputDbNickname') {
      setNickname(e.target.value)
    } else if(e.target.id === 'inputDbHost') {
      setDbHost(e.target.value)
    } else if(e.target.id === 'inputDbPort') {
      setDbPort(e.target.value)
    } else if(e.target.id === 'inputDbName') {
      setDbName(e.target.value)
    } else if(e.target.id === 'inputDbUser') {
      setDbUser(e.target.value)
    } else if(e.target.id === 'inputPasswd') {
      setDbUserPw(e.target.value)
    } else if(e.target.id === 'flexRadioDefault1' || e.target.id === 'flexRadioDefault2') {
      setResultDbYn(e.target.value)
    }
  };

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
                      <input className="form-control" id="inputDbNickname" type="text" placeholder="Enter DB nickname" onChange={handleChange} value={nickname} />
                      <label htmlFor="inputDbNickname">DB Nickname</label>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3 mb-md-0">
                          <input className="form-control" id="inputDbHost" type="text" placeholder="Enter DB host" onChange={handleChange} value={dbHost} />
                          <label htmlFor="inputDbHost">DB host</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input className="form-control" id="inputDbPort" type="text" placeholder="Enter DB port" onChange={handleChange} value={dbPort} />
                          <label htmlFor="inputDbPort">DB port</label>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3 mb-md-0">
                          <input className="form-control" id="inputDbName" type="text" placeholder="Enter DB name" onChange={handleChange} value={dbName} />
                          <label htmlFor="inputDbName">DB Name</label>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3 mb-md-0">
                          <input className="form-control" id="inputDbUser" type="text" placeholder="Enter DB user" onChange={handleChange} value={dbUser} />
                          <label htmlFor="inputDbUser">DB User</label>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="form-floating mb-3 mb-md-0">
                          <input className="form-control" id="inputPasswd" type="password" placeholder="Create a password" onChange={handleChange} value={dbUserPw} />
                          <label htmlFor="inputPasswd">Password</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating mb-3 mb-md-0">
                          <input className="form-control" id="inputPasswdConfirm" type="password" placeholder="Confirm password" onChange={handleChange} value={dbUserPw !== dbUserPwConfirm ? "비밀번호가 일치하지 않음" : dbUserPwConfirm} />
                          <label htmlFor="inputPasswdConfirm">
                            Confirm Password
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 radio_btn">
                      <div className="form-check col-md-6">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="T" onChange={handleChange} defaultChecked />
                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                          Database for testing
                        </label>
                      </div>
                      <div className="form-check col-md-6">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="S" onChange={handleChange} />
                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                          Database for saving a result of test
                        </label>
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