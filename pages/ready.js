import Image from 'next/image'
import tlogo from "/public/images/tlogo.png";
import ReadyScreen from '@/components/ReadyScreen';
import { useEffect } from 'react';

export default function Ready() {
    const [videos, setVideos] = useState();
    useEffect(() => {
        (async () => {
            const { results } = await (
                await fetch(
                    'https://tiktok-video-no-watermark2.p.rapidapi.com/?url=https%3A%2F%2Fwww.tiktok.com%2F%40tiktok%2Fvideo%2F7106658991907802411&hd=0'
                )
            ).json();
            setVideos(results);
        })();
    }, []);
    
    return (
        <>
            <title>Ready</title>
            <div>
                <ReadyScreen />
            </div>
            <div>

            </div>
        </>
    )
}   