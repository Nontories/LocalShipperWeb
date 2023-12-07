import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import './styles.scss'

import { UserContext } from '../../context/StoreContext';
import { GetAllTransaction } from '../../api/transaction';

import Helmet from '../../components/shared/Helmet/helmet'
import PaymentTab from '../../components/PaymentTab/PaymentTab';
import PaymentModal from '../../components/modal/PaymentModal/PaymentModal';

const PaymentList = () => {

    const [transactionList, setTransactionList] = useState([])
    const [searchValue, setSearchValue] = useState("")
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
                // item.name.toLowerCase().includes(value) ||
                // item.email.toLowerCase().includes(value) ||
                String(item.amount).includes(value.toLowerCase())
            );

            return newFilteredData
        }
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
                            handleSearch(transactionList, searchValue)?.map((item, index) => {
                                return (
                                    <PaymentTab item={item} index={index} key={index} />
                                )
                            })
                        }
                    </div>
                </div>
                <PaymentModal visible={modalVisible.paymment} onCancle={hanldeCancel} type={modalVisible.type} />
            </div>
        </Helmet>
    )
}

export default PaymentList
