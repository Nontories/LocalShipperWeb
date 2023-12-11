import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { UserContext } from "../context/StoreContext";

import { ACCOUNT } from "../constants/account";

import Login from "../pages/Login/login";
import UserLayout from "../layouts/UserLayout/userLayout"
import TrackingOrder from "../pages/TrackingOrder/TrackingOrder";

//store
import AddOrder from "../pages/AddOrder/addOrder";
import OrderList from "../pages/OrderList/orderList"
import Shipper from "../pages/Shipper/shipper"
import TransactionList from "../pages/TransactionList/TransactionList";

//staff
import ZoneList from "../pages/ZoneList/ZoneList"
import StoreList from "../pages/StoreList/StoreList"
import ShipperList from "../pages/ShipperList/ShipperList";
import PaymentList from "../pages/PaymentList/PaymentList"

//Admin
import AccountList from "../pages/AccountList/AccountList";

const Router = () => {

  const { role } = useContext(UserContext);

  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/tracking-order" element={<TrackingOrder />} />

      <Route element={<UserLayout />}>
        {
          role === ACCOUNT.STAFF.role &&

          <>
            <Route path="/zone-list" element={<ZoneList />} />
            <Route path="/store-list" element={<StoreList />} />
            <Route path="/shipper-list" element={<ShipperList />} />
            <Route path="/payment-list" element={<PaymentList />} />
          </>

        }
        {
          role === ACCOUNT.STORE.role &&
          <>
            <Route path="/add-order" element={<AddOrder />} />
            <Route path="/order-list" element={<OrderList />} />
            <Route path="/shipper" element={<Shipper />} />
            <Route path="/transaction" element={<TransactionList />} />
          </>
        }
        {
          role === ACCOUNT.ADMIN.role &&
          <>
            <Route path="/account-list" element={<AccountList />} />
          </>
        }
      </Route>
    </Routes>
  )
};

export default Router;
