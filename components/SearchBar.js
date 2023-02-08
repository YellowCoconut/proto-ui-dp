import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

export default function SearchBar() {
    const [videos, setVideos] = useState();
    const [input, setInput] = useState();
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { result } = await (
                await fetch(
                    'http://localhost:3000/api/ytParse', {
                        method: 'POST',
                        body: JSON.stringify({"input" : "하니"}),
                    }
                )
            ).json()
            setVideos(result)
        })()
    }, [])

    const getVideos = async () => {
        const res = await fetch('http://localhost:3000/api/ytParse', {
            method: 'POST',
            body: JSON.stringify({input}),
        })
        const { result } = await res.json()
        setVideos(result)
    }

    const sendVideo = (id) => {
        router.push(
            {
                pathname: '/video',
                query: {
                    id,
                }
            },
            '/video'
        )
    }

    return (
        <>
            <div className='flex flex-row justify-evenly items-center mb-5'>
                <div className='flex basis-1/3'>
                <input className='flex basis-5/6 border-solid text-3xl border rounded-l-full border-red-800 justify-center text-center'
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="검색어를 입력하세요"></input>
                    <button className='flex basis-1/6 justify-center items-center border border-black rounded-r-full font-bold bg-blue-300 bg-opacity-50' onClick={getVideos}>
                    <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </button>
                    
                </div>
            </div>
            <div className='flex flex-row justify-evenly items-center'>
            <div className='flex basis-1/2 flex-col justify-evenly items-center '>
            {!videos && <h4>Loading...</h4>}
            {videos?.map((video) => (
                <div className= "flex flex-row container" key={video.id}>
                    <img className= "flex basis-3/5 grow-0 border border-black rounded-2xl" src={video.thumbnails[0].url}></img>
                    <div className= "flex basis-2/5 justify-center items-center p-5 text-blue-700 border border-black rounded-2xl" onClick={() => { sendVideo(video.id) }}>{video.title}</div>
                </div>
            ))}
            </div>
            
            </div>
            

        </>
    )

}