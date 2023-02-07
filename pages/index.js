import Head from 'next/head'
import { Inter } from '@next/font/google'
import NavBar from '@/components/NavBar'
import BagicHome from '@/components/BagicHome'

const inter = Inter({ subsets: ['latin'] })

function Home() {
  return (
    <>
      <Head>
        <title>Jigsaw Puzzle</title>
      </Head>
      <div class="">
      <div class="container-2xl" >
          <main class="bg-black flex flex-col justify-center items-center h-screen ">
            <div class="bg-amber-200 rounded-3xl">
              <NavBar />
              <BagicHome />
              </div>
        </main>
        </div>
        </div>
      </>
  )
}

export default Home