import React from "react";
import styles from "./index.module.css";
import ModalTemplate from "..";
import Button from "../../button";
import { timeConverter } from "../../../helpers/timeConverter";

interface CompletionModalProps {
  timer: number;
  count: number;
  close: () => void;
  totalWords: number;
  totalTyped: number;
  correctScore: number;
  reset: (retry: boolean) => void;
}

export default function CompletionModal({
  close,
  timer,
  count,
  totalWords,
  totalTyped,
  correctScore,
  reset,
}: CompletionModalProps) {
  const timeElapsed = timer - count;
  const [min, sec] = timeConverter(timeElapsed);
  const points = Math.round((correctScore / totalWords) * 50);
  const accuracy = totalTyped
    ? Math.round((correctScore / totalTyped) * 100)
    : 0;
  const wpm =
    timeElapsed === 0 && totalTyped > 0
      ? 60
      : timeElapsed === 0 && totalTyped === 0
      ? 0
      : Math.round(totalTyped / (timeElapsed / 60));

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
            <p>Typed Words</p>
            <h2>
              {totalTyped} / {totalWords}
            </h2>
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
            <p>Word Errors</p>
            <h2>{totalTyped - correctScore}</h2>
          </div>
          <div
            className={`${styles["stat-container"]} ${styles["stat-container6"]}`}
          >
            <p>Total Points</p>
            <h2 className={styles[`${points >= 25 ? "good" : "bad"}`]}>
              {points} / 50
            </h2>
          </div>
        </div>
        <div className={styles["action-buttons"]}>
          <Button
            onClick={() => {
              reset(true);
              close();
            }}
            variant="primary2"
          >
            Retry
          </Button>
          <Button
            onClick={() => {
              reset(false);
              close();
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </ModalTemplate>
  );
}
