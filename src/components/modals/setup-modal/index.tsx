import Image from "next/image";
import React, { useState } from "react";
import styles from "./index.module.css";
import ModalTemplate from "..";
import Button from "../../button";

interface SetupModalProps {
  customWords: string;
  timer: number;
  createTimer: (value: number) => void;
  createCustomWords: (value: string) => void;
  close: () => void;
}

const convertTimer = (timer: number) => {
  return [Math.floor(timer / 60), timer % 60 ? timer % 60 : 0];
};

export default function SetupModal({
  customWords,
  timer,
  createTimer,
  createCustomWords,
  close,
}: SetupModalProps) {
  const options = [30, 60, 120, 180];
  const [customTimer] = useState(!options.includes(timer));
  const [min, sec] = convertTimer(timer);
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
    createCustomWords(inputChanges);
    createTimer(editMode ? 60 * editedMin + editedSec : selectedOption);
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
          />
        </div>
        <div className={styles["timer-wrapper"]}>
          <div className={styles["timer-header"]}>
            <p className={styles["label"]}>Timer(min:sec)</p>
            <p
              className={styles["mode"]}
              onClick={() => handleEditModeChange()}
            >
              change mode
            </p>
          </div>
          <ul className={styles["timer-container"]}>
            {!editMode ? (
              options.map((option, index) => {
                const [min, sec] = convertTimer(option);
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
                  defaultValue={editedMin}
                  onChange={(e) => setEditedMin(+e.target.value)}
                  type="number"
                  min={0}
                  max={30}
                />
                <span className={styles["colon-separator"]}> : </span>
                <input
                  defaultValue={editedSec}
                  onChange={(e) => setEditedSec(+e.target.value)}
                  type="number"
                  min={0}
                  max={60}
                />
              </div>
            )}
          </ul>
        </div>
        <Button
          disabled={
            (customTimer &&
              editedMin === min &&
              editedSec === sec &&
              inputChanges === customWords) ||
            (!customTimer &&
              selectedOption === timer &&
              inputChanges === customWords) ||
            (editedMin === 0 && editedSec === 0 && selectedOption === 0)
          }
          onClick={handleAppliedChanges}
          fill={"primary"}
        >
          Apply Changes
        </Button>
      </>
    </ModalTemplate>
  );
}
