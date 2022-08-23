import React from "react";
import styles from "./index.module.css";
import ModalTemplate from "..";
import Button from "../../button";
import Link from "next/link";
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
  const wpm = Math.round(
    totalTyped / ((timeElapsed === 0 ? 1 : timeElapsed) / 60)
  );
  const handleRestart = () => {
    restart();
    close();
  };

  return (
    <ModalTemplate header="Game Over" close={close} icon={false}>
      <div className={styles["main-container"]}>
        <div className={styles["stats-container"]}>
          <div
            className={`${styles["stat-container"]} ${styles["stat-container1"]}`}
          >
            <p>Time Taken</p>
            <h2>{`${min} : ${
              sec === 0 ? "00" : sec < 10 ? `0${sec}` : sec
            }`}</h2>{" "}
          </div>
          <div
            className={`${styles["stat-container"]} ${styles["stat-container2"]}`}
          >
            <p>Total Words</p>
            <h2>{totalWords}</h2>
          </div>
          <div
            className={`${styles["stat-container"]} ${styles["stat-container3"]}`}
          >
            <p>Accuracy</p>
            <h2 className={styles[`${accuracy >= 50 ? "good" : "bad"}`]}>
              {accuracy}%
            </h2>{" "}
          </div>
          <div
            className={`${styles["stat-container"]} ${styles["stat-container4"]}`}
          >
            {" "}
            <p>WPM</p>
            <h2 className={styles[`${wpm >= 40 ? "good" : "bad"}`]}>{wpm}</h2>
          </div>
          <div
            className={`${styles["stat-container"]} ${styles["stat-container5"]}`}
          >
            <p>Incorrect Words</p>
            <h2>{totalTyped - correctScore}</h2>
          </div>
          <div
            className={`${styles["stat-container"]} ${styles["stat-container6"]}`}
          >
            <p>Correct Words</p>
            <h2
              className={
                styles[
                  `${totalTyped >= Math.round(totalWords / 2) ? "good" : "bad"}`
                ]
              }
            >
              {correctScore}
            </h2>
          </div>
        </div>
        <div className={styles["action-buttons"]}>
          <Button variant="solid" onClick={handleRestart}>
            Try Again
          </Button>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </ModalTemplate>
  );
}
