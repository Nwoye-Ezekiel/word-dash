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
          To complete the game, the player must type fast and accurately, to
          avoid losing points and amending errors.
        </p>
        <p>
          This game serves as both a challenge and a way to improve one&apos;s
          typing skills. Good luck!
        </p>
      </p>
    </ModalTemplate>
  );
}
