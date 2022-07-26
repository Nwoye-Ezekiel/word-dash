import React, { useState } from "react";
import type { AppProps } from "next/app";
import Image from "next/image";
import Head from "next/head";
import "../styles/index.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <>
      <Head>
        <title>Word Dash</title>
        <link rel="preload" as="image" href="../assets/images/liquid.svg" />
        <link rel="preload" as="image" href="../../assets/images/logo1.svg" />
      </Head>
      <span className="image-wrapper">
        <Image
          className="background-image"
          src={require("../assets/images/liquid.svg")}
          alt="Background Image"
          layout="fill"
          onLoad={() => setIsImageLoading(false)}
        />
      </span>
      {isImageLoading ? (
        <div className="loader-container">
          Loading<span className="dots"></span>
        </div>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}

export default MyApp;
