import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./index.module.css";

export default function Home() {
  return (
    <div className={styles["container"]}>
      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 10,
        }}
        className={styles["title"]}
      >
        WORD DASH
      </motion.h1>
      <Link href="/start">
        <a className={styles["start-button"]}>start</a>
      </Link>
    </div>
  );
}
