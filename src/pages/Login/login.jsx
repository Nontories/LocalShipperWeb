import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { UserContext } from '../../context/StoreContext';
import './styles.scss'

import { signIn, getStoreInfor } from '../../api/auth'
import { GetStore } from '../../api/store';

import Helmet from '../../components/shared/Helmet/helmet'
import { ACCOUNT } from '../../constants/account';

const Login = () => {

    const [form, setForm] = useState({ email: "", password: "" })
    const { store, token, updateStore, updateToken } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            loadStoreData()
        }
    }, [])

    const handleEmail = (event) => {
        setForm({ ...form, email: event.target.value })
    }

    const handlePassword = (event) => {
        setForm({ ...form, password: event.target.value })
    }

    const loadStoreData = async () => {
        const response = await getStoreInfor(token)
        if (response?.status === 200) {
            await getStoreData(response?.data?.accountId, token)
            navigate("/add-order");
        }
    }

    const handleSignin = async () => {
        const response = await signIn(form)
        if (response?.status === 200) {
            await updateToken(response?.data?.accessToken)
            localStorage.setItem('token', JSON.stringify(response?.data?.accessToken))
            if (response?.data?.role === ACCOUNT.STORE.value) {
                await updateToken(response?.data?.accessToken)
                localStorage.setItem('token', JSON.stringify(response?.data?.accessToken))
                await getStoreData(response?.data?.id, response?.data?.accessToken)
                navigate("/add-order");
            } else if (response?.data?.role === ACCOUNT.STAFF.value) {
                navigate("/zone-list");
            } else {
                toast.warning('Bạn không được cấp quyền vào hệ thông này');
            }
        } else {
            toast.warning('Sai email hoặc mật khẩu.');
        }
    }

    const getStoreData = async (id, token) => {
        const data = {
            accountId: id
        }
        const response = await GetStore(data, token)
        if (response?.status === 200) {
            await updateStore(response?.data[0])
            localStorage.setItem('store', JSON.stringify(response?.data[0]))
        }
    }

    return (
        <Helmet title={"Login | "}>
            <div className="login">
                <div className="left">
                    <div className="form">
                        <div className="title">
                            Sign In
                        </div>
                        <div className="input_group">
                            <label className="input_label" htmlFor="email">Email</label>
                            <input
                                className="input_bar"
                                id="email" type="text"
                                value={form.email}
                                onChange={handleEmail}
                            // placeholder="abc@gmail.com"
                            />
                        </div>

                        <div className="input_group">
                            <label className="input_label" htmlFor="password">Password</label>
                            <input
                                className="input_bar"
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={handlePassword}
                            // placeholder="******"
                            />
                        </div>

                        <div className="button" onClick={() => { handleSignin() }}>
                            ĐĂNG NHẬP
                        </div>

                        <div className="navigate">
                            <div className="signup">
                                Chưa có tài khoản Local Shipper? <span className="signup_nav">Đăng kí ngay</span>
                            </div>
                            <div className="forgot">
                                Quên mật khẩu?
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div className="content">

                    </div>
                </div>
            </div>
        </Helmet>
    )
}

export default Login
