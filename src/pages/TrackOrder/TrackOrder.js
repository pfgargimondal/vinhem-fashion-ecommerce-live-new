import Table from "react-bootstrap/Table";
import "./Css/TrackOrder.css";
import { Link } from "react-router-dom";

export const TrackOrder = () => {
  return (
    <div className="track-order-wrapper">
      <div className="lksnkjererr container px-5">
        <div className="fdgfrwtyrt row py-5">
          <div className="col-lg-8 mb-5">
            <div className="odkioowepow">
              <h2 className="order-status-title">Track Your Order</h2>
              
              <div className="dieihiewjr">
                <label className="me-2 mb-2">PLease enter the below details to know about the status of your current order.</label>
                
                <div className="dftgyttredd">
                    <div className="col-lg-8 mb-3">
                        <input className="form-control" placeholder="Order Number *"/>
                    </div>

                    <div className="col-lg-8 mb-3">
                        <input className="form-control" placeholder="Email Id *" />
                    </div>

                    <button className="btn btn-main px-5 py-2">SUBMIT</button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-12 mb-4">
            {/* <div className="dsfghjyrtrew">
              <h2 className="order-status-title">Your Order Status</h2>

              <p className="order-number">
                Order Number: <span>0519cb87e4clf274</span>
              </p>

              <p className="updated-time">Estimated Delivery: Friday, Sep 08</p>

              <div className="track-order-container mb-5">
                <div className="d-flex justify-content-between">
                  <div className="order-tracking completed">
                    <span className="is-complete" />
                    <p>
                      <b>Ordered</b>
                      <br />
                      <span>Mon, June 24</span>
                    </p>
                  </div>
                  <div className="order-tracking completed">
                    <span className="is-complete" />
                    <p>
                      <b>Shipped</b>
                      <br />
                      <span>Tue, June 25</span>
                    </p>
                  </div>
                  <div className="order-tracking">
                    <span className="is-complete" />
                    <p>
                      <b>Delivered</b>
                      <br />
                      <span>Fri, June 28</span>
                    </p>
                  </div>
                </div>
              </div>

              <p className="delivery-status">Your order has been delivered!</p>

              <hr />

              <h4 className="past-history-title">Tracking History</h4>

              <div className="history-item">
                <span className="history-date">27 Sep 23:41</span>Order for{" "}
                <span className="bold-text">ALL YOU NEED IS LESS</span> - LONG
                SLEEVE placed
              </div>

              <div className="history-item">
                <span className="history-date">29 Sep 03:53</span>The campaign
                successfully reached its goal!
              </div>

              <div className="history-item">
                <span className="history-date">29 Sep 04:09</span>The campaign
                has ended and your order is now being printed!
              </div>
            </div> */}

            <div className="dkiejwrnjiowejrwer">
              {/* <h4 className="mb-3">Order Details</h4> */}

              <div className="pkdoewkpoerrr">
                <Table responsive="lg">
                  <thead>
                    <tr>
                      <th>Order ID</th>

                      <th>Dispatched By</th>

                      <th>Order Status</th>

                      <th>Current Status Updated On</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>
                        VF - 2526 - 855964
                      </td>

                      <td>Fedex : <Link>Click Here</Link></td>

                      <td>In - Transit</td>

                      <td>Date : 15/ 12/ 2025 | 6: 27 : 10 - PM</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>

          {/* <div className="col-lg-5">
            <div className="right-box d-none mb-4">
              <p className="mb-0">
                Specific details are hidden for privacy reasons,{" "}
                <a href="/" className="log-in-link">
                  Log in
                </a>{" "}
                to view complete details
              </p>
            </div>            
          </div> */}
        </div>
      </div>
    </div>
  );
};
