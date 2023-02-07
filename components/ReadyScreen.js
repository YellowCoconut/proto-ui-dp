import Image from 'next/image'
import tlogo from "/public/images/tlogo.png";

export default function ReadyScreen() {
    return (
        <div class="flex flex-col justify-center items-center rounded-3xl">
            <div class=''>Select Video</div>
            <div class="p-10 flex flex-row justify-evenly">
                <Image
                    class="mr-20"
                    src={tlogo}
                    width={50}
                    height={50}
                />
                <Image
                    class="mr-20"
                    src={tlogo}
                    width={50}
                    height={50}
                        />
                <Image
                    src={tlogo}
                    width={50}
                    height={50}
            />          
            </div>
            <div>
                <input placeholder='검색어를 입력하세요'></input>
            </div>
            </div>
    )
}