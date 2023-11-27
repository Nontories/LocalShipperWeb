import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from "react-router-dom";
import "./styles.scss"

import SideBarDefault from '../../components/sidebar/SideBarDefault/sideBarDefault';

const UserLayout = () => {
    // const [isAiGenerations, setIsAiGenerations] = useState(false);

    // const location = useLocation();
    // useEffect(() => {
    //     setIsAiGenerations(location.pathname === '/ai-generations');
    // }, [location]);

    return (
        <div className='user-layout'>
            <SideBarDefault />
            <div className='user-layout_content'>
                <Outlet />
            </div>
        </div>
    )
}

export default UserLayout