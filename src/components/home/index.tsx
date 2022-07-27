import React from "react";
import Link from "next/link";
import styles from "./index.module.css";
import Button from "../button";
import Image from "next/image";

export default function Home() {
  return (
    <div className={styles["container"]}>
      <span className={styles["logo-wrapper"]}>
        <Image src={require("../../assets/images/logo.svg")} alt="logo" />
      </span>
      <div>
        <Link href="/play">
          <Button>Play Game</Button>
        </Link>
      </div>
    </div>
  );
}
