import React from 'react';
import ReactPlayer from 'react-player'

export default function Play() {
    return(
        <div class = "bg-black p-20 flex flex-row justify-evenly items-center h-screen">
            <div class="flex flex-col justify-evenly items-center rounded-3xl">
                <div class = "mb-5 text-3xl text-white">
                    Player1
                </div>
                <div class= "box-border h-32 w-32 mb-5 border-4 text-white text-center">
                    두두두둥장
                </div>
                <div class= "container bg-black pr-10">
                    <ReactPlayer url='https://youtu.be/60RaggLgggE'/>
                </div>
            </div>
            <div class="flex flex-col justify-evenly items-center rounded-3xl">
                <div class = "mb-5 text-3xl text-white">
                    Player2
                </div>
                <div class= "box-border h-32 w-32 mb-5 border-4  text-white text-center">
                    성현식
                </div>
                <div>
                    <ReactPlayer url='https://youtu.be/sE5xyyULyjQ'/>
                </div>
            </div>
        </div>
    )
}