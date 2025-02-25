import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Form, Table } from "react-bootstrap";
import auth from "../../firebase.init";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function AddToCard() {
  document.title = "Add to Card || Two Star Fashion";

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [user] = useAuthState(auth);
  const [myOrders, setMyOrders] = useState([]);

  const today = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = today.toLocaleDateString(undefined, options);

  useEffect(() => {
    const getMyOrders = async () => {
      const url = `https://two-start-manufacturer-backend.vercel.app/addToCard?email=${user?.email}`;
      const { data } = await axios.get(url);
      setMyOrders(data);
    };
    getMyOrders();
  }, [user]);

  const handleDelete = (id) => {
    const proceed = window.confirm("Are you sure?");
    if (proceed) {
      const url = `https://two-start-manufacturer-backend.vercel.app/addToCard/${id}`;
      fetch(url, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          window.location.reload(false);
          toast("Parts Item Delete Successfully!");
        });
    }
  };

  const subTotalAmount = myOrders?.reduce((acc, mO) => acc + mO.amount, 0);
  const totalQuantity = myOrders?.reduce((acc, mO) => acc + mO.userQuantity, 0);

  let shippingFee = 0;
  if (totalQuantity >= 500) {
    shippingFee = totalQuantity * 50;
  } else {
    const extraFee = 500;
    const quantityFee = totalQuantity * 50;
    shippingFee = quantityFee + extraFee;
  }

  const totalAmount = subTotalAmount + shippingFee;

  const onSubmit = async (data) => {
    const confirmOrder = {
      userName: data.userName,
      email: user?.email,
      shippingEmail: data.email,
      phoneNumber: data.phoneNumber,
      userAddress: data.userAddress,
      streetAddress: data.streetAddress,
      airportorShippingPort: data.airportorShippingPort,
      city: data.city,
      country: data.country,
      myOrdersInfo: myOrders,
      status: "Pending",
      shippingFee: shippingFee,
      subTotalAmount: subTotalAmount,
      totalQuantity: totalQuantity,
      totalAmount: totalAmount,
      orderFormattedDate: formattedDate,
    };

    const url = `https://two-start-manufacturer-backend.vercel.app/orders`;
    fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(confirmOrder),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.acknowledged === true) {
          myOrders.map((mOs) => {
            const url = `https://two-start-manufacturer-backend.vercel.app/addToCard/${mOs._id}`;
            fetch(url, {
              method: "DELETE",
            })
              .then((res) => res.json())
              .then((data) => {});
          });
        }
        toast.success(`Your Orders successfully`);
      });
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">
        Shopping <span className="text-danger">Cart</span>
      </h2>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>PRODUCT</th>
            <th>UNIT PRICE</th>
            <th>QUANTITY</th>
            <th>SUBTOTAL</th>
            <th>REMOVE</th>
          </tr>
        </thead>
        <tbody>
          {myOrders.map((myOrder) => (
            <tr key={myOrder._id}>
              <td className="d-flex">
                <img
                  style={{
                    borderRadius: "30px",
                    height: "50px",
                    width: "60px",
                  }}
                  src={myOrder.pImg}
                  alt=""
                />
                <span className="mt-3 mx-2 h6">{myOrder.parts}</span>
              </td>
              <td>{myOrder.pPrice}</td>
              <td>{myOrder.userQuantity}</td>
              <td>{myOrder.amount}</td>
              <td>
                <button
                  onClick={() => handleDelete(myOrder._id)}
                  className="btn btn-sm btn-danger"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* order summary */}
      <div className=" row">
        <div className="col-md-5 my-2">
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <Card.Text>
                <div className="d-flex justify-content-between mt-3">
                  <h6>Items Total</h6>
                  <h6>{subTotalAmount}</h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h6>Shipping Fee</h6>
                  <h6>৳ {shippingFee}</h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h5>Total Payment</h5>
                  <h5>৳ {totalAmount}</h5>
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-7">
          <form
            className="d-flex flex-column"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h4>01. Personal Details</h4>
            {/* user name  and email */}
            <div className="d-flex">
              <Form.Group className="mb-3">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your Name"
                  {...register("userName", { required: "Name is required" })}
                />
                {errors.userName && (
                  <p className="text-danger">{errors.userName?.message}</p>
                )}
              </Form.Group>
              <Form.Group className="mb-3 mx-2">
                <Form.Label>Your Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Your Email"
                  {...register("email", {
                    required: "User Email is required",
                  })}
                />
                {errors.email && (
                  <p className="text-danger">{errors.email?.message}</p>
                )}
              </Form.Group>
            </div>

            {/* Phone Number and address */}
            <div className="d-flex">
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Phone Number"
                  {...register("phoneNumber", {
                    required: "phoneNumber is required",
                  })}
                />
                {errors.phoneNumber && (
                  <p className="text-danger">{errors.phoneNumber?.message}</p>
                )}
              </Form.Group>
              <Form.Group className="mb-3 mx-2">
                <Form.Label>Your Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your Address"
                  {...register("userAddress", {
                    required: "userAddress is required",
                  })}
                />
                {errors.userAddress && (
                  <p className="text-danger">{errors.userAddress?.message}</p>
                )}
              </Form.Group>
            </div>

            <h4>02. Shipping Details</h4>
            {/* streetAddress and airportorShippingPort */}
            <div className="d-flex">
              <Form.Group className="mb-3">
                <Form.Label>Street Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Street Address"
                  {...register("streetAddress", {
                    required: "Street Address is required",
                  })}
                />
                {errors.streetAddress && (
                  <p className="text-danger">{errors.streetAddress?.message}</p>
                )}
              </Form.Group>
              <Form.Group className="mb-3 mx-2">
                <Form.Label>Airport or Shipping Port</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Airport or Shipping Port"
                  {...register("airportorShippingPort", {
                    required: "Airport or Shipping Port is required",
                  })}
                />
                {errors.airportorShippingPort && (
                  <p className="text-danger">
                    {errors.airportorShippingPort?.message}
                  </p>
                )}
              </Form.Group>
            </div>

            {/* city and country */}
            <div className="d-flex">
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="City"
                  {...register("city", {
                    required: "City is required",
                  })}
                />
                {errors.city && (
                  <p className="text-danger">{errors.city?.message}</p>
                )}
              </Form.Group>
              <Form.Group className="mb-3 mx-2">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Country"
                  {...register("country", {
                    required: "Country is required",
                  })}
                />
                {errors.country && (
                  <p className="text-danger">{errors.country?.message}</p>
                )}
              </Form.Group>
            </div>

            <h4>03. Payment Method</h4>

            {errors.exampleRequired && <span>This field is required</span>}

            <input
              className="btn btn-primary w-50"
              value="Confirm Order"
              type="submit"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddToCard;
