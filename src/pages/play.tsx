import Head from "next/head";
import PlayGame from "../components/play";

export default function Play() {
  return (
    <>
      <Head>
        <title>Word Dash - Play</title>
      </Head>
      <main>
        <PlayGame />
      </main>
    </>
  );
}
