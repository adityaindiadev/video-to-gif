import React from 'react'
import './UploadContainer.scss';

function VideoToGifIndicatorContainer({ icon, text }) {
    return (<div className="videoIconText">
        <img src={icon} className="icon"></img>
        <div className="text">{text}</div>
    </div>)

}

const UploadGround = () => {

    return <button className="uploadGround">
        <img src={require('../../assets/New/ic_upload.png')} className="uploadIcon">

        </img>
    </button>
}

function VideoDetailsCard() {
    return (
        <div className="videoDetailsCard">
            <div className="iconFileDetailsContainer">
                <img src={require('../../assets/New/ic_file_video.png')} alt="videoDetailsIcon" className="videoDetailsIcon" />
                <div className="fileNameDateContainer">
                    <div className="fileName">
                        Games.mp4
                    </div>
                    <div className="dateTimeSize">
                        7/19/2023, 1:18:31 PM · 1.47 GB
                    </div>
                </div>
            </div>
            <button style={{ border: 'none', textAlign: 'center', textDecoration: 'none', backgroundColor: 'white', cursor: 'pointer' }}>
                <img src={require('../../assets/New/ic_close.png')} alt="closeIcon" className="closeIcon" />
            </button>
        </div>
    )
}


function UploadContainer() {


    return (
        <div className="uploadContainer">

            <div className="uploadTitle">
                Upload video file
            </div>

            {/* <UploadGround /> */}

            <VideoDetailsCard />


            <div className="videoToGifIndicatorContainer">
                <VideoToGifIndicatorContainer icon={require('../../assets/New/ic_video.png')} text={'Video'} />

                <img src={require('../../assets/New/ic_arrow.png')} alt="arrowImg" className="arrowImg" />
                <VideoToGifIndicatorContainer icon={require('../../assets/New/ic_gif.png')} text={'Gif'} />
            </div>


            <button className='convertNowBtn'>
Convert Now
            </button>




        </div>
    )
}

export default UploadContainer