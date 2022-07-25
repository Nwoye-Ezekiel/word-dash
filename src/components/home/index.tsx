import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./index.module.css";
import Button from "../button";

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
        className={styles["game-title"]}
      >
        WORD DASH
      </motion.h1>
      <div>
        <Link href="/start">
          <Button>Play</Button>
        </Link>
      </div>
    </div>
  );
}
