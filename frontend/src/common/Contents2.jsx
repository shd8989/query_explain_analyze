import React from 'react'

const Contents2 = () => {
    return (
      <>
        <main>
          <div className="container-fluid px-4">
            <div className="row">
              <div className="col">
                <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" defaultValue="0">
                  <option value="0">Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
              <div className="col">
                <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" defaultValue="0">
                  <option value="0">Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
                <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" defaultValue="0">
                  <option value="0">Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
            </div>
            <div className="row">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Query No</th>
                    <th scope="col">Database1</th>
                    <th scope="col">Query No</th>
                    <th scope="col">Database2</th>
                    <th scope="col">Faster</th>
                    <th scope="col">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>Otto</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>Otto</td>
                    <td>Otto</td>
                    <td>@fat</td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>Otto</td>
                    <td>Otto</td>
                    <td>Otto</td>
                    <td>Otto</td>
                    <td>@twitter</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col">
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">«</span>
                      <span className="sr-only">Previous</span>
                    </a>
                  </li>
                  <li className="page-item"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><a className="page-link" href="#">3</a></li>
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">»</span>
                      <span className="sr-only">Next</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </main>
      </>
    );
};

export default Contents2