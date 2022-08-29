import React from "react";
import styles from "./index.module.css";
import ModalTemplate from "..";

export default function AboutGameModal({ close }: { close: () => void }) {
  return (
    <ModalTemplate header="Word Dash" type="info" close={close}>
      <p className={styles["content"]}>
        <p>
          Word dash is a typing game where players must type various texts in
          the fastest time possible.
        </p>
        <p>
          In order to complete the game, the player must quickly type in words
          accurately to avoid losing points.
        </p>
        <p>
          This game serves as both a challenge and a way to improve one&apos;s
          typing skills. Good luck!
        </p>
      </p>
    </ModalTemplate>
  );
}
