import React, { useEffect, useState } from "react";
import logo from "../../../images/20230722_163020.png";
import { useParams } from "react-router-dom";
import { Table } from "react-bootstrap";

function MyOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState({});

  useEffect(() => {
    const url = `https://two-start-manufacturer-backend.vercel.app/orders/${orderId}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setOrder(data));
  }, [orderId]);

  const ordersInfo = order.myOrdersInfo;

  return (
    <div className="container">
      <h5 style={{ background: "#BAEDBE" }} className="p-3">
        Thank you {order.userName}, Your order have been received !
      </h5>
      <div
        style={{ background: "#EEF2FF" }}
        className="d-flex justify-content-between p-3"
      >
        <div>
          <h4>INVOICE</h4>
          <h6>
            Status : <span className="text-primary">{order.status}</span>
          </h6>
          <div className="d-block d-md-none">
            <h6>DATE</h6>
            <p>{order?.orderFormattedDate}</p>
          </div>
        </div>
        <div>
          <img src={logo} alt="" style={{ width: "120px" }} />
          <h6>Dhaka, Bangladesh</h6>
        </div>
      </div>
      <div
        style={{ background: "#EEF2FF" }}
        className="d-flex mt-2 p-3 justify-content-between"
      >
        <div className="d-none d-md-block">
          <h6>DATE</h6>
          <p>{order?.orderFormattedDate}</p>
        </div>
        <div>
          <h6>Shipping</h6>
          <p>{order.streetAddress}</p>
          <p>{order.airportorShippingPort}</p>
          <p>{order.city}</p>
          <p>{order.country}</p>
        </div>
        <div>
          <h6 style={{ textAlign: "right" }}>INVOICE TO.</h6>
          <p style={{ textAlign: "right" }}>{order.userName}</p>
          <p style={{ textAlign: "right" }}>{order.shippingEmail}</p>
          <p style={{ textAlign: "right" }}>{order.phoneNumber}</p>
          <p style={{ textAlign: "right" }}>{order.userAddress}</p>
        </div>
      </div>

      <Table responsive striped bordered size="sm" className="mt-2">
        <thead>
          <tr>
            <th>SR.</th>
            <th>PRODUCT NAME</th>
            <th>QUANTITY</th>
            <th>ITEM PRICE</th>
            <th>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {ordersInfo?.map((myOrder, i) => (
            <tr key={myOrder._id}>
              <td>{i + 1}</td>
              <td className="d-flex">
                <img
                  style={{
                    borderRadius: "30px",
                    height: "40px",
                    width: "48px",
                  }}
                  src={myOrder.pImg}
                  alt=""
                />
                <span className="mt-2 mx-2 h6">{myOrder.parts}</span>
              </td>
              <td>{myOrder.userQuantity}</td>
              <td>{myOrder.pPrice}</td>
              <td>{myOrder.amount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className=" row pt-3" style={{ background: "#ECFDF5" }}>
        <div className="col-md-3">
          <div>
            <h6>PAYMENT METHOD</h6>
            <p>Cash</p>
          </div>
        </div>

        <div className="col-md-3">
          <div>
            <h6>TOTAL QUANTITY</h6>
            <p>৳{order.totalQuantity}</p>
          </div>
        </div>

        <div className="col-md-3">
          <div>
            <h6>SHIPPING COST</h6>
            <p>৳{order.shippingFee}</p>
          </div>
        </div>

        <div className="col-md-3">
          <div>
            <h6>TOTAL AMOUNT</h6>
            <h5 className="text-primary">৳{order.totalAmount}</h5>
          </div>
        </div>
      </div>
      <div className="d-flex d-flex justify-content-between my-2">
        <button className="btn btn-primary">Download Invoice</button>
        <button className="btn btn-secondary mx-2">Print Invoice</button>
      </div>
    </div>
  );
}

export default MyOrder;
