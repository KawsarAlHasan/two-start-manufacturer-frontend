import React, { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../../images/20230722_163020.png";

function ViewOrder() {
  const { orderId } = useParams();

  const [orderProducts, setOrderProducts] = useState({});
  useEffect(() => {
    const url = `https://two-start-manufacturer-backend.vercel.app/orders/${orderId}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setOrderProducts(data));
  }, []);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (updateData) => {
    const urlLink = `https://two-start-manufacturer-backend.vercel.app/orders/manage/${orderId}`;
    fetch(urlLink, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(updateData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("success", data);
        window.location.reload(false);
        toast("Status Updated Successfully!");
      });
  };

  const ordersInfo = orderProducts.myOrdersInfo;

  return (
    <div className="">
      <div
        style={{ background: "#EEF2FF" }}
        className="d-flex justify-content-between p-3"
      >
        <div>
          <h4>INVOICE</h4>
          <h6>
            Status :<span className="text-primary">{orderProducts.status}</span>
          </h6>
          <div className="d-block d-md-none">
            <h6>DATE</h6>
            <p>{orderProducts?.orderFormattedDate}</p>
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
          <p>{orderProducts?.orderFormattedDate}</p>
        </div>
        <div>
          <h6>Shipping</h6>
          <p>{orderProducts.streetAddress}</p>
          <p>{orderProducts.airportorShippingPort}</p>
          <p>{orderProducts.city}</p>
          <p>{orderProducts.country}</p>
        </div>
        <div>
          <h6 style={{ textAlign: "right" }}>INVOICE TO.</h6>
          <p style={{ textAlign: "right" }}>{orderProducts.userName}</p>
          <p style={{ textAlign: "right" }}>{orderProducts.shippingEmail}</p>
          <p style={{ textAlign: "right" }}>{orderProducts.phoneNumber}</p>
          <p style={{ textAlign: "right" }}>{orderProducts.userAddress}</p>
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
      <div className="row pt-3 container" style={{ background: "#ECFDF5" }}>
        <div className="col-md-3">
          <div>
            <h6>PAYMENT METHOD</h6>
            <p>Cash</p>
          </div>
        </div>

        <div className="col-md-3">
          <div>
            <h6>TOTAL QUANTITY</h6>
            <p>৳{orderProducts.totalQuantity}</p>
          </div>
        </div>

        <div className="col-md-3">
          <div>
            <h6>SHIPPING COST</h6>
            <p>৳{orderProducts.shippingFee}</p>
          </div>
        </div>

        <div className="col-md-3">
          <div>
            <h6>TOTAL AMOUNT</h6>
            <h5 className="text-primary">৳{orderProducts.totalAmount}</h5>
          </div>
        </div>
      </div>
      <form
        className="d-flex flex-column my-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="d-flex ">
          <Form.Select
            {...register("status")}
            aria-label="Default select example"
          >
            <option value="Delivered">Delivered</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Cancel">Cancel</option>
          </Form.Select>
          <input
            className="btn btn-primary"
            value="Update Status"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}

export default ViewOrder;
