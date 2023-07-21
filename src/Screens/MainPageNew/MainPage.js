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
                <img src={require('../../assets/New/left-graphic.png')} alt="leftGraphicImg" className="leftGraphicImg" />

                <div className="uploadContainer">

                    <div className="uploadTitle">
                        Upload video file
                    </div>

                    <div className="uploadGround">
                        <img src={require('../../assets/New/ic_upload.png')} className="uploadIcon">

                        </img>
                    </div>

                    <div className="videoToGifIndicatorContainer">
                        <div className="videoIconText">
                            <img src={require('../../assets/New/ic_video.png')} className="icon"></img>
                            <div className="text"></div>
                        </div>
                    </div>

                </div>
            </div>



        </div>
    )
}

export default MainPage