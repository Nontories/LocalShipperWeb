import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/login";
import UserLayout from "../layouts/UserLayout/userLayout"
import AddOrder from "../pages/AddOrder/addOrder";
import OrderList from "../pages/OrderList/orderList"
import Shipper from "../pages/Shipper/shipper"
import TrackingOrder from "../pages/TrackingOrder/TrackingOrder";

const Router = () => {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/tracking-order" element={<TrackingOrder />} />

      <Route element={<UserLayout />} >

        <Route path="/add-order" element={<AddOrder />} />
        <Route path="/order-list" element={<OrderList />} />
        <Route path="/shipper" element={<Shipper />} />

      </Route>

    </Routes>
  )
};

export default Router;
