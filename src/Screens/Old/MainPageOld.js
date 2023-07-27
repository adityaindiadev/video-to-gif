import React, { useState, useEffect } from 'react';
// import './MainPageOld.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
// import background from './assets/turntable-1337986_1280.jpg'
import background from '../../assets/stars_space_darkness_night_black_sky_background_hd_space-1366x768.jpg'
import dummyGif from '../../assets/original.webp'
import { BallTriangle } from 'react-loader-spinner';
import { AiOutlineCloudUpload } from "react-icons/ai";
const ffmpeg = createFFmpeg({ log: true });


function MainPageOld() {

  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, [])

  const convertToGif = async () => {
    setReady(false);
    // Write the file to memory 
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    // Run the FFMpeg command
    await ffmpeg.run('-i', 'test.mp4', '-t', '9.5', '-ss', '0.0', '-f', 'gif', 'out.gif');

    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');

    // Create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setReady(true);
    setGif(url)
  }

  return ready ? (

    <div className="App" style={{ backgroundImage: `url(${background})`, backgroundRepeat: 'repeat', backgroundSize: 'contain' }}>



      <div className="card" >

        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
          {/* Upload Button */}
          <label htmlFor="file-upload" className="custom-file-upload">
            <i style={{ fontSize: 30, marginTop: 5 }}><AiOutlineCloudUpload /> </i>
            &nbsp;  Upload
          </label>
          <input type="file" id='file-upload' onChange={(e) => setVideo(e.target.files?.item(0))} />



          {video ? <video
            // controls
            width={500}
            src={URL.createObjectURL(video)}
            autoPlay
            style={{ borderRadius: 10 }}>

          </video>
            :
            <img src={dummyGif} width={500} style={{ borderRadius: 10, opacity: 0.5 }} alt='dummyGif'/>
          }
        </div>


        {video && !gif &&
          <>


            <button className='custom-file-upload' style={{ border: 'none', marginTop: 100 }} onClick={convertToGif}>Convert</button>

          </>
        }
        {gif && <> <h3>Result</h3><img src={gif} width="500" alt='gif' /></>}

      </div>


    </div>
  )
    :
    (
      <div className="App" style={{ backgroundColor: 'black' }}>
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#4fa94d"
          ariaLabel="ball-triangle-loading"
          wrapperClass={{}}
          wrapperStyle=""
          visible={true}
        />
      </div>
    );
}

export default MainPageOld;
