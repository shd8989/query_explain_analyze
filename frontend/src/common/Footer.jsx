import React from 'react'

const Footer = () => {
    return (
      <>
        <footer className="py-4 bg-light mt-auto">
          <div className="container-fluid px-4">
            <div className="d-flex align-items-center justify-content-between small">
              <div className="text-muted">Copyright © Hyundong's Website 2024</div>
              <div>
                <a href="https://github.com/shd8989/query_explain_analyze/issues">Register issue</a>
              </div>
            </div>
          </div>
        </footer>
      </>
    );
};

export default Footer