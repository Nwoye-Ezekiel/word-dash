import React, { useState } from "react";
import styles from "./index.module.css";
import ModalTemplate from "..";
import Button from "../../button";
import Link from "next/link";
import Spacer from "../../spacer";
import { timeConverter } from "../../../helpers/timeConverter";

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
  timeElapsed,
  restart,
}: CompletionModalProps) {
  const [min, sec] = timeConverter(timeElapsed);
  const accuracy = totalTyped
    ? Math.round((correctScore / totalTyped) * 100)
    : 0;
  const handleRestart = () => {
    restart();
    close();
  };

  return (
    <ModalTemplate header="Game Over" close={close} icon={false}>
      <div className={styles["main-container"]}>
        <div className={styles["stats-container"]}>
          <div className={styles["stat-container"]}>
            <p>WPM</p>
            <h2>{Math.round(totalTyped / (timeElapsed / 60))}</h2>
          </div>
          <div className={styles["stat-container"]}>
            <p>Time</p>
            <h2>{`${min} : ${
              sec === 0 ? "00" : sec < 10 ? `0${sec}` : sec
            }`}</h2>
          </div>
        </div>
        <div className={styles["stats-container"]}>
          <div className={styles["stat-container"]}>
            <p>Accuracy</p>
            <h2 className={styles[`${accuracy >= 50 ? "good" : "bad"}`]}>
              {accuracy}%
            </h2>
          </div>
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
        </div>
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
