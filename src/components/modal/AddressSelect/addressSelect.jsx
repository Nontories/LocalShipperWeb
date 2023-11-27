import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select'
import '../App.css'

const AddressSelected = () => {
    const [provincesList, setProvincesList] = useState([]);
    const [districtsList, setDistrictsList] = useState([]);
    const [wardsList, setWardsList] = useState([])
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [result, setResult] = useState("");

    const apiGetPublicProvinces = async () => {
        try {
            const response = await axios.get('https://vapi.vnappmob.com/api/province/')
            setProvincesList(response.data.results)
        } catch (error) {
            console.log(error.message);
        }
    }

    const apiGetPublicDistrict = async (provinceId) => {
        try {
            const response = await axios.get(`https://vapi.vnappmob.com/api/province/district/${provinceId}`)
            setDistrictsList(response.data.results)
        } catch (error) {
            console.log(error.message);
        }
    }

    const apiGetPublicWard = async (districtId) => {
        try {
            const response = await axios.get(`https://vapi.vnappmob.com/api/province/ward/${districtId}`)
            setWardsList(response.data.results)
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleProvinceChange = (selectedOption) => {
        setSelectedProvince(selectedOption?.value)
        apiGetPublicDistrict(selectedOption?.key)
    }

    const handleDistrictChange = (selectedOption) => {
        setSelectedDistrict(selectedOption?.value)
        apiGetPublicWard(selectedOption?.key)
    }

    const handleWardChange = (selectedOption) => {
        setSelectedWard(selectedOption?.value)
        setResult(selectedProvince + ", " + selectedDistrict + ", " + selectedOption?.value)
    }

    const removeKeywords = (str) => {
        const keywords = ["Thành phố", "Tỉnh", "Huyện", "Xã"];

        const regex = new RegExp(keywords.join("|"), "gi");
        const result = str.replace(regex, "");

        return result.trim();
    }

    useEffect(() => {
        apiGetPublicProvinces()
    }, [])

    return (
        <div className=''>
            <div className="">
                <div className="">
                    {/* <Select
                        isClearable
                        placeholder='Tỉnh/Thành Phố'
                        className='select_option'
                        onChange={handleProvinceChange}
                        options={provincesList.map(province => ({ key: province.province_id, value: (province.province_name), label: removeKeywords(province.province_name) }))}
                    />

                    <Select
                        isClearable
                        placeholder='Quận/Huyện'
                        className={`select_option ${selectedProvince ? '' : 'disabled-select'}`}
                        onChange={handleDistrictChange}
                        options={districtsList.map(district => ({ key: district.district_id, value: (district.district_name), label: removeKeywords(district.district_name) }))}
                        // isDisabled={!selectedProvince}
                    />

                    <Select
                        isClearable
                        placeholder='Phường/Xã'
                        className={`select_option ${selectedProvince && selectedDistrict ? '' : 'disabled-select'}`}
                        onChange={handleWardChange}
                        options={wardsList.map(ward => ({ key: ward.ward_id, value: (ward.ward_name), label: removeKeywords(ward.ward_name) }))}
                        // isDisabled={!selectedProvince || !selectedDistrict} 
                    /> */}
                </div>
            </div>
        </div>
    )

}

export default AddressSelected;
