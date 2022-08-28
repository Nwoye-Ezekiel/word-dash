import React from "react";
import styles from "./index.module.css";
import ModalTemplate from "..";

export default function InstructionModal({ close }: { close: () => void }) {
  return (
    <ModalTemplate header="Instruction" type="info" close={close}>
      <p className={styles["content"]}>
        <p>
          Two fields are provided, the top for displaying quotes and the bottom
          for typing quotes. Each time the <span>Get New Quote</span> button is
          clicked, a new quote is generated.
        </p>
        <p>
          The <span>Setup</span> button opens a modal where you can either
          modify the quote being displayed or select a timer from the various
          timing options provided.
        </p>
        <p>
          The timer starts counting down as soon as the game begins. After the
          game is finished, you will be provided with an analysis of your
          performance.
        </p>
      </p>
    </ModalTemplate>
  );
}
