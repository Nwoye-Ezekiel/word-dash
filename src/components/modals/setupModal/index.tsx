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
  const options = [30, 60, 120, 180];
  const [customTimer] = useState(!options.includes(timer));
  const [min, sec] = timeConverter(timer);
  const [inputChanges, setInputChanges] = useState(customWords);
  const [selectedOption, setSelectedOption] = useState(customTimer ? 0 : timer);
  const [editMode, setEditMode] = useState(customTimer ? true : false);
  const [editedMin, setEditedMin] = useState(customTimer ? min : 0);
  const [editedSec, setEditedSec] = useState(customTimer ? sec : 0);

  const handleModeChange = () => {
    if (editMode === false) {
      setEditMode(true);
      setSelectedOption(0);
    } else {
      setEditMode(false);
      setEditedMin(0);
      setEditedSec(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ([".", "-", "+", "e", "E"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleCustomTimer = (value: number, unit: "min" | "sec") => {
    if (unit === "min") {
      setEditedMin(value);
      if (value > 10) {
        toast.error("Timer minutes must not exceed 10!");
      }
    } else if (unit === "sec") {
      setEditedSec(value);
      if (value > 59) {
        toast.error("Timer seconds must not exceed 59!");
      }
    }
  };

  const handleValidation = () => {
    return (
      (customTimer &&
        editedMin === min &&
        editedSec === sec &&
        inputChanges.trim() === customWords) ||
      (!customTimer &&
        selectedOption === timer &&
        inputChanges.trim() === customWords) ||
      (editedMin === 0 && editedSec === 0 && selectedOption === 0) ||
      editedMin < 0 ||
      editedMin > 10 ||
      editedSec < 0 ||
      editedSec > 59 ||
      inputChanges.trim().length === 0 ||
      inputChanges.trim().length > 300
    );
  };

  const handleAppliedChanges = () => {
    createQuote(inputChanges);
    createTimer(editMode ? 60 * editedMin + editedSec : selectedOption);
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
            onChange={(e) => {
              const trimmedValue = e.target.value.slice(0, 300);
              if (e.target.value.length > 300) {
                e.target.value = trimmedValue;
                setInputChanges(trimmedValue);
                toast.error("Only a maximum of 300 characters is allowed!");
              } else {
                setInputChanges(e.target.value);
              }
            }}
            className={styles["input-container"]}
          />
          <div className={styles["character-count"]}>{inputChanges.length}</div>
        </div>
        <div className={styles["timer-wrapper"]}>
          <div className={styles["timer-header"]}>
            <p className={styles["label"]}>Timer(min : sec)</p>
            <p className={styles["mode"]} onClick={() => handleModeChange()}>
              {editMode ? "Select Options" : "Customize Timer"}
            </p>
          </div>
          <ul className={styles["timer-container"]}>
            {!editMode ? (
              options.map((option, index) => {
                const [min, sec] = timeConverter(option);
                return (
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
                );
              })
            ) : (
              <div className={styles["edit-container"]}>
                <input
                  min={0}
                  max={10}
                  type="number"
                  defaultValue={editedMin}
                  onKeyDown={(e) => handleKeyDown(e)}
                  onChange={(e) =>
                    handleCustomTimer(parseInt(e.target.value), "min")
                  }
                />
                <span className={styles["colon-separator"]}> : </span>
                <input
                  min={0}
                  max={59}
                  type="number"
                  defaultValue={editedSec}
                  onKeyDown={(e) => handleKeyDown(e)}
                  onChange={(e) =>
                    handleCustomTimer(parseInt(e.target.value), "sec")
                  }
                />
              </div>
            )}
          </ul>
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
