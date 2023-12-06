import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import './styles.scss'

import { UserContext } from '../../../context/StoreContext';

import { ACCOUNT } from '../../../constants/account';

import ConfirmModal from '../../modal/ConfirmModal/ConfirmModal';

import Logo from "../../../assets/Logo.svg"
import navIcon from "../../../assets/sidebar/threeLine.svg"
import addIcon from "../../../assets/sidebar/addCircle.svg"
import orderIcon from "../../../assets/sidebar/order.svg"
import shipperIcon from "../../../assets/sidebar/shipper.svg"
import signoutIcon from "../../../assets/sidebar/Sign_out.svg"

const itemList = [
  {
    className: "logo defautl_icon",
    role: ACCOUNT.STORE.value,
    name: "Thêm đơn hàng",
    img: addIcon,
    action: "/add-order"
  },
  {
    className: "logo defautl_icon",
    role: ACCOUNT.STORE.value,
    name: "Danh sách đơn hàng",
    img: orderIcon,
    action: "/order-list"
  },
  {
    className: "logo defautl_icon",
    role: ACCOUNT.STORE.value,
    name: "Danh sách shipper",
    img: shipperIcon,
    action: "/shipper"
  },
  {
    className: "logo defautl_icon",
    role: ACCOUNT.STAFF.value,
    name: "Danh sách khu vực",
    img: shipperIcon,
    action: "/zone-list"
  },
  {
    className: "logo defautl_icon",
    role: ACCOUNT.STAFF.value,
    name: "Danh sách cửa hàng",
    img: shipperIcon,
    action: "/store-list"
  },
  {
    className: "logo defautl_icon",
    role: ACCOUNT.STAFF.value,
    name: "Danh sách shipper",
    img: shipperIcon,
    action: "/shipper-list"
  },
  {
    className: "logo defautl_icon",
    role: ACCOUNT.STAFF.value,
    name: "Các thanh toán",
    img: shipperIcon,
    action: "/payment-list"
  },
]

const SideBarDefault = () => {

  const [activeKey, setActiveKey] = useState(0);
  const [sideBarWide, setSideBarWide] = useState(false)
  const [logoutModal, setLogoutModal] = useState(false)
  const { store, token, role, updateStore, updateToken } = useContext(UserContext);
  const navigate = useNavigate();

  const handleItemClick = (item, key) => {
    setActiveKey(key);
    navigate(item?.action);
  };

  const handleConfirmLogout = async () => {
    await updateStore(null)
    await updateToken(null)
    navigate("/")
  }

  const getNavList = () => {
    if (role === ACCOUNT.STAFF.value) {
      return itemList.filter(item => item.role === ACCOUNT.STAFF.value);
    } else {
      return itemList.filter(item => item.role !== ACCOUNT.STAFF.value);
    }
  };

  return (
    <div className={`side-bar-default ${sideBarWide ? "side-bar-wide" : ""}`} style={{ overflow: logoutModal ? "visible" : "hidden" }}>
      <div className="logo_icon">
        <img
          className={`logo`}
          src={Logo}
          alt={"Logo"}
          draggable="false"
        // onClick={() => handleItemClick(item, key)}
        />
      </div>

      <div className="nav_icon_div">
        <img
          className={`nav_icon defautl_icon`}
          src={navIcon}
          alt={"nav_icon"}
          draggable="false"
          onClick={() => setSideBarWide(!sideBarWide)}
        />
      </div>

      <div className="item_list">
        {
          getNavList().map((item, key) => {
            return (
              <div className={`nav_button  ${sideBarWide ? "nav_button-wide" : ""}`} onClick={() => handleItemClick(item, key)} key={key}>
                <img
                  className={`${item.className} icon `}
                  src={item.img}
                  alt={item.className}
                  draggable="false"
                />
                <div className={`nav_button_name ${!sideBarWide ? "hidden" : ""}`}>{item.name}</div>
              </div>
            )
          })
        }
        <div className={`background_active ${sideBarWide ? "wide" : ""}`} style={{ position: 'absolute', top: ((45 * activeKey) + (20 * activeKey)) }}></div>
      </div>

      <div className="sign_out" onClick={() => { setLogoutModal(true) }}>
        <img src={signoutIcon} alt="" />
        <div className={`sign_out-text ${!sideBarWide ? "hidden" : ""}`}>Đăng xuất</div>
      </div>

      <ConfirmModal visible={logoutModal} setVisible={setLogoutModal} title={"Đăng xuất"} content={"Xác nhận đăng xuất"} onConfirm={handleConfirmLogout} onCancle={() => { setLogoutModal(false) }} />
    </div>
  )
}

export default SideBarDefault
