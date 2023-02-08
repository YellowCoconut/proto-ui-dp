import Head from 'next/head'
import NavBar from '@/components/NavBar'
import BagicHome from '@/components/BagicHome'

function Home() {
  return (
    <>
      <Head>
        <title>Jigsaw Puzzle</title>
      </Head>
      <div className="">
      <div className="container-2xl" >
          <main className="bg-black flex flex-col justify-center items-center h-screen ">
            <div className="flex flex-col basis-2/5 bg-amber-200 rounded-3xl">
                <NavBar />
              <div className='flex'>
                <BagicHome />
              </div>
              </div>
        </main>
        </div>
        </div>
      </>
  )
}

export default Home