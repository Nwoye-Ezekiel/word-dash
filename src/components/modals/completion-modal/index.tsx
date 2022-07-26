import React, { useState } from "react";
import styles from "./index.module.css";
import ModalTemplate from "..";
import Button from "../../button";
import Link from "next/link";
import Spacer from "../../spacer";
import { motion } from "framer-motion";

interface CompletionModalProps {
  close: () => void;
  totalWords: number;
  totalTyped: number;
  correctScore: number;
  timeElapsed: number;
  restart: () => void;
}

export default function CompletionModal({
  close,
  totalWords,
  totalTyped,
  correctScore,
  restart,
}: CompletionModalProps) {
  const accuracy = totalTyped ? Math.round((correctScore / totalTyped) * 100) : 0;
  const handleRestart = () => {
    restart();
    close();
  };

  return (
    <ModalTemplate header="Game Over" close={close} icon={false}>
      <div className={styles["main-container"]}>
        <div className={styles["stats-container"]}>
          <div className={styles["stat-container"]}>
            <p>Total Points</p>
            <h2
              className={
                styles[
                  `${
                    correctScore >= Math.round(totalWords / 2) ? "good" : "bad"
                  }`
                ]
              }
            >
              {correctScore}
            </h2>
          </div>
          <div className={styles["stat-container"]}>
            <p>Total Words</p>
            <h2>{totalWords}</h2>
          </div>
        </div>
        <div className={styles["stats-container"]}>
          <div className={styles["stat-container"]}>
            <p>Words Typed</p>
            <h2>{totalTyped}</h2>
          </div>
          <div className={styles["stat-container"]}>
            <p>Accuracy</p>
            <h2 className={styles[`${accuracy >= 50 ? "good" : "bad"}`]}>
              {accuracy}%
            </h2>
          </div>
        </div>
        {/* <div>CPM: {Math.round(((characterTyped / timeElapsed) * 60))}</div>
        <div>WPM: {Math.round((((characterTyped / 5) / timeElapsed) * 60))}</div> */}
        <div className={styles["action-buttons"]}>
          <Button fill="primary" onClick={handleRestart}>
            Try again
          </Button>
          <Spacer width={30} />
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </ModalTemplate>
  );
}
