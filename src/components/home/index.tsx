import React, { useState } from "react";
import Link from "next/link";
import styles from "./index.module.css";
import Button from "../button";
import Image from "next/image";
import AboutGameModal from "../modals/aboutGameModal";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className={styles["container"]}>
      <span className={styles["logo-wrapper"]}>
        <Image src={require("../../assets/images/logo.svg")} alt="logo" />
      </span>
      <div className={styles["action-buttons"]}>
        <Link href="/play">
          <Button>Play Game</Button>
        </Link>
        <Button onClick={() => setShowModal(true)} variant="outline">About Game</Button>
      </div>
      {showModal && <AboutGameModal close={() => setShowModal(false)} />}
    </div>
  );
}
