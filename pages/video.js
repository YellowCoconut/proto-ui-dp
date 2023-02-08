import Router from 'next/router';
import { useRouter } from 'next/router';
import ReactPlayer from 'react-player'

export default function videoscreen() {
    
    const router = useRouter();
    const id = router.query.id

    var url = `https://youtube.com/watch?v=${id}`

    return (
        <div>
            <ReactPlayer url={url} />
        </div>
    )
}