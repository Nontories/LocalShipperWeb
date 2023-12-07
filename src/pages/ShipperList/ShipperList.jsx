import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import './styles.scss'

import { UserContext } from '../../context/StoreContext';
import { GetAllShipper } from '../../api/account';
import { ActiveShipper, DeactiveShipper } from "../../api/shipper"
import { SHIPPERSTATUS } from '../../constants/shipper';

import Helmet from '../../components/shared/Helmet/helmet'
import ShipperStaffTab from '../../components/ShipperStaffTab/ShipperStaffTab';
import ConfirmModal from "../../components/modal/ConfirmModal/ConfirmModal"
import ChooseZone from '../../components/modal/ChooseZone/ChooseZone';
import { GetAllZone } from '../../api/zone';

const shipperType = [
    {
        value: true,
        name: "Đã đăng ký",
    },
    {
        value: false,
        name: "Chưa đăng ký",
    }
]

const ShipperList = () => {

    const [shipperList, setShipperList] = useState([])
    const [zoneList, setZoneList] = useState([])
    const [filterValue, setFilterValue] = useState(true)
    const [focusShipper, setFocusShipper] = useState({})
    const [choosedZone, setChoosedZone] = useState()
    const [searchValue, setSearchValue] = useState("")
    const [modalVisible, setModalVisible] = useState({ chooseZone: false, confirmDeactive: false, viewShipper: false })
    const { store, token } = useContext(UserContext);

    useEffect(() => {
        loadShipperData()
        loadZoneData()
    }, [])

    const loadShipperData = async () => {
        const response = await GetAllShipper(token)
        if (response?.status === 200) {
            // console.log(response?.data);
            setShipperList(response?.data)
        } else {
            toast.warning('Tải thông tin shipper thất bại');
        }
    }

    const loadZoneData = async () => {
        const response = await GetAllZone(token)
        if (response?.status === 200) {
            setZoneList(response?.data)
        } else {
            toast.warning('Tải thông tin khu vực thất bại');
        }
    }

    const handleFilter = (value) => {
        return shipperList?.filter(item => item?.active === value)
    }

    const handleSearch = (list, value) => {
        if (value === "") {
            return list
        } else {
            const newFilteredData = list?.filter(item =>
                item?.fullName?.toLowerCase().includes(value.toLowerCase()) ||
                item?.email?.toLowerCase().includes(value.toLowerCase()) ||
                String(item?.phone)?.includes(value.toLowerCase())
            );
            return newFilteredData
        }
    }

    const handleDeactiveShipper = async () => {
        const response = await DeactiveShipper(focusShipper?.id, token)
        if (response?.status === 200) {
            toast.success("Vô hiệu hoá thành công")
            loadShipperData()
        } else {
            toast.error("Vô hiệu hoá Thất bại")
        }
        setModalVisible({ ...modalVisible, confirmDeactive: false })
    }

    const handleActiveShipper = async () => {
        const response = await ActiveShipper(focusShipper?.id, choosedZone, token)
        console.log(focusShipper?.id, choosedZone);
        if (response?.status === 200) {
            toast.success("Kích hoạt thành công")
            loadShipperData()
        } else {
            toast.error("Kích hoạt Thất bại")
        }
        setModalVisible({ ...modalVisible, chooseZone: false })
    }

    const handleCloseChooseZone = () => {
        setModalVisible({ ...modalVisible, chooseZone: false })
    }

    return (
        <Helmet title={"Shipper list | "}>
            <div className="shipper_list">
                <div className="header">Danh sách tài xế của hệ thống</div>
                <div className="body">
                    <div className="shipper_status">
                        {shipperType.map((item, key) => {
                            return (
                                <div className={`type_button ${filterValue == item.value && "button_active"}`} onClick={() => { setFilterValue(item.value) }} key={key} >{item.name}</div>
                            )
                        })}
                        <div className="assign_time">
                            <input
                                type="text"
                                placeholder='Tìm Kiếm...'
                                value={searchValue}
                                onChange={(e) => { setSearchValue(e.target.value) }}
                            />
                        </div>
                    </div>
                    <div className="shipper_list">
                        <div className="shipper_staff_tab">
                            <div className="tab_name">Họ và tên</div>
                            <div className="tab_phone">Số điện thoại</div>
                            <div className="tab_mail">Email</div>
                            <div className="tab_date_assign">Ngày đăng ký</div>
                            <div className="tab_status">Trạng thái</div>
                            <div className="tab_button"></div>
                        </div>
                        {
                            handleSearch(handleFilter(filterValue), searchValue)?.map((item, key) => {
                                return (
                                    <ShipperStaffTab item={item} setFocusShipper={setFocusShipper} parentModal={modalVisible} setParentModal={setModalVisible} key={key} />
                                )
                            })
                        }
                    </div>
                </div>
                <ConfirmModal
                    visible={modalVisible.confirmDeactive}
                    setVisible={() => { setModalVisible({ ...modalVisible, confirmDeactive: false }) }}
                    title="Xác nhận vô hiệu quá tài khoản"
                    content={`Vô hiệu hoá shipper ${focusShipper.fullname}`}
                    onConfirm={handleDeactiveShipper}
                    onCancle={() => { setModalVisible({ ...modalVisible, confirmDeactive: false }) }}
                />
                <ChooseZone
                    visible={modalVisible.chooseZone}
                    zone={choosedZone}
                    setZone={setChoosedZone}
                    zoneList={zoneList}
                    onSubmit={handleActiveShipper}
                    onCancle={handleCloseChooseZone}
                />
            </div>
        </Helmet>
    )
}

export default ShipperList
