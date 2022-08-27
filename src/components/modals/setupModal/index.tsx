import React, { useState } from "react";
import styles from "./index.module.css";
import ModalTemplate from "..";
import Button from "../../button";
import { timeConverter } from "../../../helpers/timeConverter";
import toast from "react-hot-toast";

type EventType =
  | React.KeyboardEvent<HTMLInputElement>
  | React.KeyboardEvent<HTMLTextAreaElement>;

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

  const handleEditModeChange = () => {
    if (editMode === false) {
      setEditMode(true);
      setSelectedOption(0);
    } else {
      setEditMode(false);
      setEditedMin(0);
      setEditedSec(0);
    }
  };

  const handleAppliedChanges = () => {
    createQuote(inputChanges);
    createTimer(editMode ? 60 * editedMin + editedSec : selectedOption);
    close();
  };

  const handleEditedMin = (value: number) => {
    setEditedMin(value);
    if (value > 10) {
      toast.error("Minutes must not exceed 10!");
    }
  };

  const handleEditedSec = (value: number) => {
    setEditedSec(value);
    if (value > 59) {
      toast.error("Seconds must not exceed 59!");
    }
  };

  const handleKeyDown = (e: EventType, inputType: "number" | "textarea") => {
    if (inputType === "number") {
      console.log(e);
      if ([".", "-", "+", "e", "E"].includes(e.key)) {
        e.preventDefault();
        toast.error("Input not allowed!");
      }
    } else if (inputType === "textarea") {
      if (
        e.target.value.length === 300 &&
        e.code !== "Backspace" &&
        e.code !== "Delete"
      ) {
        e.preventDefault();
        toast.error("Only a maximum of 300 characters is allowed!");
      }
    }
  };

  return (
    <ModalTemplate header="Game Setup" close={close}>
      <>
        <div className={styles["input-wrapper"]}>
          <p className={styles["label"]}>Quote</p>
          <textarea
            defaultValue={customWords}
            onChange={(e) => setInputChanges(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "textarea")}
            className={styles["input-container"]}
            maxLength={300}
          />
          <div className={styles["character-count"]}>{inputChanges.length}</div>
        </div>
        <div className={styles["timer-wrapper"]}>
          <div className={styles["timer-header"]}>
            <p className={styles["label"]}>Timer(min : sec)</p>
            <p
              className={styles["mode"]}
              onClick={() => handleEditModeChange()}
            >
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
                  onKeyDown={(e) => handleKeyDown(e, "number")}
                  onChange={(e) => handleEditedMin(parseInt(e.target.value))}
                />
                <span className={styles["colon-separator"]}> : </span>
                <input
                  min={0}
                  max={59}
                  type="number"
                  defaultValue={editedSec}
                  onKeyDown={(e) => handleKeyDown(e, "number")}
                  onChange={(e) => handleEditedSec(parseInt(e.target.value))}
                />
              </div>
            )}
          </ul>
        </div>
        <Button
          disabled={
            // previously set custom timer and quote are not edited.
            (customTimer &&
              editedMin === min &&
              editedSec === sec &&
              inputChanges.trim() === customWords) ||
            // previously selected timer and quote are not edited.
            (!customTimer &&
              selectedOption === timer &&
              inputChanges.trim() === customWords) ||
            // Ensures a timer is set.
            (editedMin === 0 && editedSec === 0 && selectedOption === 0) ||
            // Ensures custom timer is valid.
            editedMin < 0 ||
            editedMin > 10 ||
            editedSec < 0 ||
            editedSec > 59 ||
            // Prevents empty quotes.
            inputChanges.trim().length === 0
          }
          onClick={handleAppliedChanges}
          variant="secondary"
        >
          Apply Changes
        </Button>
      </>
    </ModalTemplate>
  );
}
