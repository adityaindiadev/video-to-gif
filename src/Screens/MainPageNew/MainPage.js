import React from 'react'
import './MainPage.scss'
import Header from './Header'
import TitleTagline from './TitleTagline'



function MainPage() {
    return (
        <div className='container'>

            <img src={require('../../assets/New/bg-graphic.png')} alt="backImg" className='backImg' />

            <Header />

            <TitleTagline />

            <div className="uploadVideoSection">
                <img src={require('../../assets/New/left-graphic.png')} alt="" className="leftGraphicImgleftGraphicImg" />
            </div>



        </div>
    )
}

export default MainPage