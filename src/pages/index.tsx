import Head from "next/head";
import Home from "../components/home";

export default function Game() {
  return (
    <>
      <Head>
        <title>Word Dash - Home</title>
      </Head>
      <main>
        <Home />
      </main>
    </>
  );
}
