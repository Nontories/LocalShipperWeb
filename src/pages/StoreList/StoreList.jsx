import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import './styles.scss'

import { UserContext } from '../../context/StoreContext';
import { GetStore } from '../../api/store';
import { GetAllZone } from '../../api/zone';
import { STORE } from "../../constants/store"
import { UpdateStore } from '../../api/store';

import StoreTab from "../../components/StoreTab/StoreTab"
import Helmet from '../../components/shared/Helmet/helmet'
import AddStore from '../../components/modal/AddStore/AddStore';
import ConfirmModal from "../../components/modal/ConfirmModal/ConfirmModal"
import Pagination from '../../components/Pagination/Pagination';
import StoreDetail from '../../components/StoreDetail/StoreDetail';
import UpdateStoreModal from '../../components/modal/UpdateStore/UpdateStore';

const StoreList = () => {

    const [storeList, setStoreList] = useState([])
    const [zoneList, setZoneList] = useState([])
    const [focusStore, setFocusStore] = useState({})
    const [searchValue, setSearchValue] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [modalVisible, setModalVisible] = useState({ chooseZone: false, confirmDeactive: false, viewStore: false, addStore: false, editStore: false })
    const { store, token } = useContext(UserContext);

    useEffect(() => {
        loadStoreData()
        loadZoneData()
    }, [])

    const loadStoreData = async () => {
        const response = await GetStore({}, token)
        if (response?.status === 200) {
            const filterArray = response?.data?.filter(item => item?.status !== STORE.DELETE.value)
            setStoreList(filterArray?.reverse())
        } else {
            toast.warning("Tải thông tin của hàng thất bại")
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

    const handleExceptFilter = (value) => {
        const displayList = storeList?.filter(item => item?.status !== value)
        // console.log(storeList?.filter(item => item?.active === value));

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return displayList.slice(startIndex, endIndex);
    }

    const getFilterLength = (value) => {
        return storeList?.filter(item => item?.active !== value).length
    }

    const handleSearch = (list, value) => {
        if (value === "") {
            return list
        } else {
            const newFilteredData = list?.filter(item =>
                item?.storeName?.toLowerCase().includes(value.toLowerCase()) ||
                item?.storeEmail?.toLowerCase().includes(value.toLowerCase()) ||
                String(item?.storePhone)?.includes(value.toLowerCase())
            );
            return newFilteredData
        }
    }

    const handleConfirmStoreDeactive = async () => {
        console.log(focusStore?.id, " value", STORE.DELETE.value);
        const response = await UpdateStore(focusStore?.id, STORE.DELETE.value, token)
        if (response?.status === 200) {
            await loadStoreData()
            toast.success("Xoá cửa hàng thành công")
            setModalVisible({ ...modalVisible, confirmDeactive: false, viewStore: false })
        } else {
            toast.warning("Xoá cửa hàng thất bại")
        }
    }

    const handleCancleAddStore = () => {
        setModalVisible({ ...modalVisible, addStore: false })
    }

    const handleCancleStoreDeactive = () => {
        setModalVisible({ ...modalVisible, confirmDeactive: false })
    }

    return (
        <Helmet title={"Store list | "}>
            <div className="store_list">
                <div className="header">Danh sách cửa hàng của hệ thống</div>
                <div className="body">
                    <div className="store_status">
                        <div className="assign_time">
                            <input
                                type="text"
                                placeholder='Tìm Kiếm...'
                                value={searchValue}
                                onChange={(e) => { setSearchValue(e.target.value) }}
                            />
                        </div>
                        <div className="add_store_button" onClick={() => setModalVisible({ ...modalVisible, addStore: true })}>
                            + Cửa hàng
                        </div>
                    </div>
                    <div className="store_list">
                        <div className="store_tab">
                            <div className="tab_name">Tên của hàng</div>
                            <div className="tab_phone">Số điện thoại</div>
                            <div className="tab_mail">Email</div>
                            <div className="tab_address">Địa chỉ</div>
                            <div className="tab_time">Thời gian đóng/mở của</div>
                            <div className="tab_zone">Khu vực</div>
                            <div className="tab_button"></div>
                        </div>
                        {
                            handleSearch(handleExceptFilter(STORE.DELETE.value), searchValue)?.map((item, key) => {
                                return (
                                    <StoreTab item={item} setFocusStore={setFocusStore} parentModal={modalVisible} setParentModal={setModalVisible} key={key} />
                                )
                            })
                        }
                    </div>
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        positionLength={handleExceptFilter(STORE.DELETE.value).length}
                        filterLength={getFilterLength(STORE.DELETE.value)}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
                <StoreDetail
                    focusStore={focusStore}
                    parentModal={modalVisible}
                    setParentModal={setModalVisible}
                    visible={modalVisible.viewStore}
                    onCancle={() => setModalVisible({ ...modalVisible, viewStore: false })}
                />
                <UpdateStoreModal
                    visible={modalVisible.editStore}
                    focusStore={focusStore}
                    onCancle={() => setModalVisible({ ...modalVisible, editStore: false })}
                    reLoad={loadStoreData}
                />
                <AddStore
                    visible={modalVisible.addStore}
                    onCancle={handleCancleAddStore}
                    zoneList={zoneList}
                    reload={loadStoreData}
                />
                <ConfirmModal
                    visible={modalVisible.confirmDeactive}
                    setVisible={handleCancleStoreDeactive}
                    title={"Xác nhận xoá cửa hàng"}
                    content={`Xác nhận xoá cửa hàng ${focusStore?.storeName}`}
                    onCancle={handleCancleStoreDeactive}
                    onConfirm={handleConfirmStoreDeactive}
                />
            </div>
        </Helmet>
    )
}

export default StoreList
