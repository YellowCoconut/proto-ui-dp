import Head from "next/head";
import "../components/WebRTC";
import WebRTC from "../components/WebRTC";

export default function Play() {
  return (
  <>
  <Head>
    <title>Jigsaw Puzzle</title>
  </Head>
    <div>
      <WebRTC />
    </div>
    </>
      );
}