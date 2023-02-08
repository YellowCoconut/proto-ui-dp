import Image from 'next/image'
import tlogo from "/public/images/tlogo.png";
import ylogo from "/public/images/ylogo.png";
import plogo from "/public/images/plogo.png";

export default function ReadyBar() {
    return (
        <div className="flex flex-col justify-center items-center rounded-3xl">
            <div className='mt-10 text-3xl text-bold'>Select Video</div>
            <div className="p-10 flex flex-row justify-evenly">
                <Image
                    alt = "ylogo"
                    className="mr-10"
                    src={ylogo}
                    width={130}
                    height={50}
                />
                <Image
                    alt = "tlogo"
                    className="mr-14"
                    src={tlogo}
                    width={100}
                    height={50}
                        />
                <Image
                    alt = "tlogo"
                    src={plogo}
                    width={100}
                    height={50}
            />          
            </div>

            </div>
    )
}