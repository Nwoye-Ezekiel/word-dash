import React, { useState } from "react";
import styles from "./index.module.css";
import ModalTemplate from "..";
import Button from "../../button";
import { timeConverter } from "../../../helpers/timeConverter";
import toast from "react-hot-toast";

interface SetupModalProps {
  customWords: string;
  timer: number;
  createTimer: (value: number) => void;
  createQuote: (value: string) => void;
  close: () => void;
}

export default function SetupModal({
  customWords,
  timer,
  createTimer,
  createQuote,
  close,
}: SetupModalProps) {
  const options = [60, 45, 30];
  const difficulties = ["Easy", "Medium", "Hard"];
  const [inputChanges, setInputChanges] = useState(customWords);
  const [selectedOption, setSelectedOption] = useState(timer);

  const handleValidation = () => {
    return (
      selectedOption === timer &&
      (inputChanges.trim() === customWords ||
        inputChanges.trim().length === 0 ||
        inputChanges.trim().length > 150)
    );
  };

  const handleAppliedChanges = () => {
    createQuote(inputChanges);
    createTimer(selectedOption);
    toast.success("Setup was successful!");
    close();
  };

  return (
    <ModalTemplate header="Game Setup" close={close}>
      <>
        <div className={styles["input-wrapper"]}>
          <p className={styles["label"]}>Quote</p>
          <textarea
            defaultValue={customWords}
            onChange={(e) => setInputChanges(e.target.value)}
            className={styles["input-container"]}
            maxLength={150}
          />
          <div className={styles["character-count"]}>{inputChanges.length}</div>
        </div>
        <div className={styles["timer-wrapper"]}>
          <div className={styles["timer-header"]}>
            <p className={styles["label"]}>Timer(min : sec)</p>
          </div>
          <ul className={styles["timer-container"]}>
            {options.map((option, index) => {
              const [min, sec] = timeConverter(option);
              return (
                <>
                  <li
                    key={index}
                    className={`${styles["timer-option"]} ${
                      styles[
                        `${option === selectedOption && "selected-option"}`
                      ]
                    }`}
                    onClick={() => setSelectedOption(option)}
                  >
                    {`${min} : ${sec === 0 ? "00" : sec}`}
                  </li>
                </>
              );
            })}
          </ul>
          <div className={styles["difficulty-wrapper"]}>
            {difficulties.map((difficulty: string, index: number) => (
              <span key={index} className={styles["difficulty-container"]}>
                <span
                  className={`${styles["difficulty"]} ${
                    styles[
                      `${
                        index === options.indexOf(selectedOption) &&
                        "selected-difficulty"
                      }`
                    ]
                  }`}
                >
                  {difficulty}
                </span>
              </span>
            ))}
          </div>
        </div>
        <Button
          disabled={handleValidation()}
          onClick={handleAppliedChanges}
          variant="primary2"
        >
          Apply Changes
        </Button>
      </>
    </ModalTemplate>
  );
}
