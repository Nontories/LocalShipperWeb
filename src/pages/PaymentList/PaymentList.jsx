import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import './styles.scss'

import { UserContext } from '../../context/StoreContext';
import { GetAllTransaction } from '../../api/transaction';

import Helmet from '../../components/shared/Helmet/helmet'
import PaymentTab from '../../components/PaymentTab/PaymentTab';
import PaymentModal from '../../components/modal/PaymentModal/PaymentModal';
import Pagination from '../../components/Pagination/Pagination';

const PaymentList = () => {

    const [transactionList, setTransactionList] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [otpVisible, setOtpVisible] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [modalVisible, setModalVisible] = useState({ paymment: false, type: "" })
    const { store, token } = useContext(UserContext);

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const response = await GetAllTransaction(token)
        if (response?.status === 200) {
            setTransactionList(response?.data)
        } else {
            toast.warning('Tải thông tin giao dịch thât bại');
        }
    }

    const handleSearch = (list, value) => {
        if (value === "") {
            return list
        } else {
            const newFilteredData = list?.filter(item =>
                item.sender.toLowerCase().includes(value) ||
                item.receiver.toLowerCase().includes(value) ||
                String(item.amount).includes(value.toLowerCase())
            );

            return newFilteredData
        }
    }

    const handleFilter = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return transactionList.slice(startIndex, endIndex);
    }

    const hanldeWithdraw = () => {
        setModalVisible({ ...modalVisible, paymment: true, type: "withdraw" })
    }

    const hanldeRechange = () => {
        setModalVisible({ ...modalVisible, paymment: true, type: "rechange" })
    }

    const hanldeCancel = () => {
        setModalVisible({ ...modalVisible, paymment: false, type: "" })
    }

    return (
        <Helmet title={"Payment list | "}>
            <div className="payment_list">
                <div className="header">Danh sách lệnh nạp/rút của hệ thống</div>
                <div className="body">
                    <div className="payment_status">
                        <div className="button_payment" onClick={hanldeWithdraw}>
                            Rút Tiền
                        </div>
                        <div className="button_payment" onClick={hanldeRechange}>
                            Nạp tiền
                        </div>
                        <div className="assign_time">
                            <input
                                type="text"
                                placeholder='Tìm Kiếm...'
                                value={searchValue}
                                onChange={(e) => { setSearchValue(e.target.value) }}
                            />
                        </div>
                    </div>
                    <div className="payment_list">
                        <div className="payment_tab">
                            <div className="tab_id">#</div>
                            <div className="tab_transfer">Người chuyển</div>
                            <div className="tab_receive">Người nhận</div>
                            <div className="tab_level">Mức giao dịch</div>
                            <div className="tab_time">Thời gian</div>
                            <div className="tab_content">Nội dung</div>
                            <div className="tab_collection">Thu hộ cho đơn hàng (Nếu có)</div>
                        </div>
                        {
                            handleSearch(handleFilter(), searchValue)?.map((item, index) => {
                                return (
                                    <PaymentTab item={item} index={index} key={index} />
                                )
                            })
                        }
                    </div>
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        positionLength={handleFilter().length}
                        filterLength={transactionList.length}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
                <PaymentModal
                    visible={modalVisible.paymment}
                    onCancle={hanldeCancel}
                    type={modalVisible.type}
                    otpVisible={otpVisible}
                    setOtpVisible={setOtpVisible}
                />
            </div>
        </Helmet>
    )
}

export default PaymentList
