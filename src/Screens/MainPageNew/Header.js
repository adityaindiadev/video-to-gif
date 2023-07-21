import React from 'react'
import './Header.scss'


function Header() {
    return (
        <div className="header">
            <div className="logoImgContainer">
                <img src={require('../../assets/New/v2g-logo.png')} alt="logoImg" className="logoImg" />
            </div>
        </div>
    )
}

export default Header