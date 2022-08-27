import React from "react";
import styles from "./index.module.css";
import ModalTemplate from "..";

export default function InstructionModal({ close }: { close: () => void }) {
  return (
    <ModalTemplate header="Instruction" type="info" close={close}>
      <p className={styles["content"]}>
        <p>
          To preset the game to your liking, press the setup button. This allows
          you to modify the quote that is presently being displayed and you can
          either choose from the various timing options or customize your own
          timer.
        </p>
        <p>
          As soon as the game begins, the timer starts counting down, and if you
          can&apos;t finish typing before it runs out, the game stops and you
          lose points. You will be provided with an analysis of your performance
          after the game is finished.
        </p>
      </p>
    </ModalTemplate>
  );
}
