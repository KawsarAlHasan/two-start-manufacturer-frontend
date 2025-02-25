import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../firebase.init";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MyOrders = (props) => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [myOrders, setMyOrders] = useState([]);
  useEffect(() => {
    const getMyOrders = async () => {
      const url = `https://two-start-manufacturer-backend.vercel.app/orders?email=${user.email}`;
      const { data } = await axios.get(url);
      setMyOrders(data);
    };
    getMyOrders();
  }, [user]);

  const navigateOrder = (id) => {
    navigate(`/myOrder/${id}`);
  };

  return (
    <div>
      <h1 className="my-4 text-center">
        My <span className="text-danger"> Orders </span>
      </h1>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>ORDER TIME</th>
            <th>STATUS</th>
            <th>TOTAL</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {myOrders?.map((myOrder) => (
            <tr key={myOrder._id}>
              <td>5534</td>
              <td>{myOrder.orderFormattedDate}</td>
              <td>{myOrder.status}</td>
              <td>{myOrder.totalAmount}</td>
              <td>
                <button
                  onClick={() => navigateOrder(myOrder._id)}
                  className="btn btn-sm btn-primary"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default MyOrders;
