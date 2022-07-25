import Image from "next/image";
import React, { useState } from "react";
import styles from "./index.module.css";
import ModalTemplate from "..";

interface CompletionModalProps {
  close: () => void;
  totalWords: number;
  correctScore: number;
  timeElapsed: number;
}

export default function CompletionModal({
  close,
  totalWords,
  correctScore,
  timeElapsed,
}: CompletionModalProps) {
  return (
    <ModalTemplate header="Game Over" close={close}>
      <>
        <div>Total Points: {correctScore}</div>
        <div>Total Words: {totalWords}</div>
        <div>Time Elapsed: {timeElapsed}</div>
        {/* <div>CPM: {Math.round(((characterTyped / timeElapsed) * 60))}</div>
        <div>WPM: {Math.round((((characterTyped / 5) / timeElapsed) * 60))}</div> */}
        <div>Accuracy: {Math.round((correctScore / totalWords) * 100)}%</div>
      </>
    </ModalTemplate>
  );
}
