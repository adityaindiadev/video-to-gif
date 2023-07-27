import React, { useState, useEffect } from 'react';
// import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
// import background from './assets/turntable-1337986_1280.jpg'
import background from './assets/stars_space_darkness_night_black_sky_background_hd_space-1366x768.jpg'
import dummyGif from './assets/original.webp'
import { BallTriangle } from 'react-loader-spinner';
import { AiOutlineCloudUpload } from "react-icons/ai";
import MainPage from './components/MainPageNew/MainPage';
import MainPageOld from './components/Old/MainPageOld';

const ffmpeg = createFFmpeg({ log: true });


function App() {




  return (
  
    <>

    

      <MainPage/>
    </>
  )
}

export default App;
