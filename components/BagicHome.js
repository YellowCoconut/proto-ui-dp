import logo from "/public/images/image.png";
import Image from 'next/image';
import { useRouter } from "next/router";


export default function BagicHome() {
    const router = useRouter();
    return (
    <div class="flex flex-row justify-center items-center rounded-3xl">
    <div>
      <h1 class="text-4xl text-red-300"><span class="text-5xl text text-red-600 font-medium italic" >Dive</span> into The Dynamic <br></br>
        Of Jigsaw <span class="text-5xl text text-red-600 font-medium italic">Puzzle</span>
      </h1>
      <h4 class="text-xl pt-5 pb-5">
        Show your favorite Youtube, Tiktok, personal video to the other Player
      </h4>
        <button onClick={() => router.push('/play')} class="text-2xl py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
        Play Game -&gt;
      </button>
    </div>
    <Image
      src={logo}
      width={300}
      height={50}
      />
    </div>
    )
}