import React, { useState } from "react";
import { Form, Table } from "react-bootstrap";
import Loading from "../../Shared/Loading/Loading";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

function ManageOrder() {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const handleFilter = (even) => {
    even.preventDefault();
  };

  const { data: orders, isLoading } = useQuery("orders", () =>
    fetch(
      "https://two-start-manufacturer-backend.vercel.app/orders/manage"
    ).then((res) => res.json())
  );

  const handleViewOrder = (id) => {
    navigate(`vieworder/${id}`);
  };

  return (
    <div>
      <h1 className="my-4 text-center">
        Manage <span className="text-danger"> Order </span>
      </h1>

      <div className="d-flex ">
        <Form
          className="py-3 d-flex justify-content-center"
          onSubmit={handleFilter}
        >
          <Form.Select
            onChange={(e) => setFilterValue(e.target.value)}
            aria-label="Default select example"
          >
            <option value="delivered">Delivered</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="cancel">Cancel</option>
          </Form.Select>
        </Form>
      </div>

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>INVOICE NO</th>
            <th>ORDER TIME</th>
            <th>CUSTOMER NAME</th>
            <th>METHOD</th>
            <th>AMOUNT</th>
            <th>STATUS</th>
            <th>DETAILS</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <Loading></Loading>
          ) : (
            orders
              ?.filter((manageOrder) =>
                manageOrder.status.toLowerCase().includes(filterValue)
              )
              .map((manageOrder) => (
                <tr>
                  <td>5534</td>
                  <td>{manageOrder.orderFormattedDate}</td>
                  <td>{manageOrder.userName}</td>
                  <td>Cash</td>
                  <td>{manageOrder.totalAmount}</td>
                  <td>{manageOrder.status}</td>

                  <td>
                    <button
                      onClick={() => handleViewOrder(manageOrder._id)}
                      className="btn btn-sm btn-primary"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default ManageOrder;
