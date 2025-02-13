import ModalTemplate from "..";
import Button from "../../button";
import toast from "react-hot-toast";
import React, { useState } from "react";
import styles from "./index.module.css";
import { MAX_CHARACTER_COUNT } from "../../../constants";
import { timeConverter } from "../../../helpers/timeConverter";

interface SetupModalProps {
  timer: number;
  close: () => void;
  customWords: string;
  createTimer: (value: number) => void;
  createQuote: (value: string) => void;
}

export default function SetupModal({
  close,
  timer,
  customWords,
  createTimer,
  createQuote,
}: SetupModalProps) {
  const options = [60, 45, 30];
  const difficulties = ["Easy", "Medium", "Hard"];
  const [inputChanges, setInputChanges] = useState(customWords);
  const [selectedOption, setSelectedOption] = useState(timer);

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
            maxLength={MAX_CHARACTER_COUNT}
          />
          <div className={styles["character-count"]}>
            {MAX_CHARACTER_COUNT - inputChanges.length}
          </div>
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
          disabled={
            (selectedOption === timer && inputChanges.trim() === customWords) ||
            inputChanges.trim().length === 0
          }
          onClick={handleAppliedChanges}
          variant="primary2"
        >
          Apply Changes
        </Button>
      </>
    </ModalTemplate>
  );
}
