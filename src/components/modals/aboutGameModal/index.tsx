import React from "react";
import styles from "./index.module.css";
import ModalTemplate from "..";

export default function AboutGameModal({ close }: { close: () => void }) {
  return (
    <ModalTemplate header="Word Dash" close={close}>
      <p className={styles["content"]}>
        Word dash is an online typing game where players must type various texts
        in the quickest time possible. In order to complete the game, the player
        must rapidly and accurately type in words, or individual letters,
        numbers, or other keys, that appear on the screen. This game serves as
        both a challenge and a way to improve one&apos;s typing skills. It
        contains amazing features that let you customize the game to your
        liking, such as the ability to choose or make your own timer, create
        custom texts, and it also provides an analysis of your typing skills,
        which includes your words per minute (WPM) and accuracy. The timer
        begins counting down immediately the game begins, and if you are unable
        to finish typing before the timer expires, the game ends and you lose
        points.
      </p>
    </ModalTemplate>
  );
}
