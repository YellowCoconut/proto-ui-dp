import logo from "/public/images/image.png";
import Image from 'next/image';
import { useRouter } from "next/router";



export default function BagicHome() {
    const router = useRouter();
  return (
    <div className="flex flex-row p-8 justify-center items-center rounded-3xl">
    <div>
      <h1 className="text-4xl text-red-300"><span className="text-5xl text text-red-600 font-medium italic" >Dive</span> into The Dynamic <br></br>
        Of Jigsaw <span className="text-5xl text text-red-600 font-medium italic">Puzzle</span>
      </h1>
      <h4 className="text-xl pt-5 pb-5">
        Show your favorite Youtube, Tiktok, personal video <br></br>to the other Player
      </h4>
        <button onClick={() => router.push('/ready')} className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
        Play Game -&gt;
      </button>
    </div>
    <Image
          src={logo}
          alt = "logo"
      width={300}
      height={50}
      />
    </div>
    )
}