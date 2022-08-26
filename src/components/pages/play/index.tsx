import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "../../button";
import { motion } from "framer-motion";
import styles from "./index.module.css";
import { useCountdown } from "usehooks-ts";
import { fetchRandomQuote } from "../../../apis";
import SetupModal from "../../modals/setupModal";
import CompletionModal from "../../modals/completionModal";
import InstructionModal from "../../modals/instructionModal";
import { wordFormatter } from "../../../helpers/wordFormatter";

export default function Play() {
  const DEFAULT_TIME = 30;
  const [customWords, setCustomWords] = useState("");
  const [displayedWords, setDisplayedWords] = useState(Array<string>);
  const [displayedWordIndex, setDisplayedWordIndex] = useState(0);
  const [typedWords, setTypedWords] = useState("");
  const [typedWord, setTypedWord] = useState("");
  const [status, setStatus] = useState("waiting");
  const [correctScore, setCorrectScore] = useState(0);
  const [wordError, setWordError] = useState(false);
  const [wordErrorIndexes, setWordErrorIndexes] = useState(Array<number>);
  const [fetchError, setFetchError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [setupModal, setSetupModal] = useState(false);
  const [completionModal, setCompletionModal] = useState(false);
  const [inputType, setInputType] = useState<"space" | "text">("text");
  const [timer, setTimer] = useState(DEFAULT_TIME);
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: timer,
      intervalMs: 1000,
    });

  const textInput = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    generateNewQuote();
  }, []);

  useEffect(() => {
    if (status === "started") textInput.current?.focus();
    if (status === "finished") textInput.current?.blur();
  }, [status]);

  useEffect(() => {
    resetCountdown();
  }, [timer]);

  useEffect(() => {
    if (count === 0) {
      stopCountdown();
      setCompletionModal(true);
      setStatus("finished");
    }
  }, [count]);

  const generateNewQuote = async () => {
    try {
      setLoading(true);
      const quote = await fetchRandomQuote();
      createQuote(quote);
      fetchError && setFetchError(false);
    } catch (e) {
      setFetchError(true);
      setDisplayedWords([]);
      setCustomWords("");
    } finally {
      setLoading(false);
    }
  };

  const createQuote = (words: string) => {
    words = wordFormatter(words).trim();
    setCustomWords(words);
    setDisplayedWords(words?.split(" "));
    setFetchError(false);
  };

  const handleTimerChange = (timer: number) => {
    setTimer(timer);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === "Backspace" || e.code === "Delete") {
      if (typedWord.length === 0) {
        e.preventDefault();
      }
    }

    if (e.code === "Space") {
      console.log("space");
      setInputType("space");
    } else setInputType("text");
  };

  function generateStyleClass(wordIndex: number, characterIndex: number) {
    if (wordIndex < displayedWordIndex) {
      if (wordErrorIndexes.includes(wordIndex)) {
        return "incorrect";
      } else {
        return "correct";
      }
    } else if (wordIndex === displayedWordIndex) {
      if (characterIndex < typedWord.length) {
        if (
          displayedWords[displayedWordIndex][characterIndex] ===
            typedWord[characterIndex] &&
          !(typedWord.length > displayedWords[displayedWordIndex].length)
        ) {
          return "correct";
        } else {
          if (!wordError) {
            setWordError(true);
            setWordErrorIndexes([...wordErrorIndexes, displayedWordIndex]);
          }
          if (typedWord.length > displayedWords[displayedWordIndex].length)
            return "alert";
          else return "incorrect";
        }
      } else if (characterIndex === typedWord.length) {
        return "underline";
      } else return "";
    } else return "";
  }

  const handleInputChange = (value: string) => {
    value = wordFormatter(value);
    const typedWord = value.split(" ").slice(displayedWordIndex).join(" ");

    if (typedWord.length <= displayedWords[displayedWordIndex].length + 1) {
      setTypedWords(value);
      setTypedWord(typedWord);
      if (
        displayedWordIndex + 1 === displayedWords.length &&
        typedWord === displayedWords[displayedWordIndex]
      ) {
        !wordError && setCorrectScore((prevScore) => prevScore + 1);
        setDisplayedWordIndex(displayedWordIndex + 1);
        stopCountdown();
        setCompletionModal(true);
        setStatus("finished");
      } else if (
        inputType === "space" &&
        typedWord.trim() === displayedWords[displayedWordIndex]
      ) {
        !wordError && setCorrectScore(correctScore + 1);
        setTypedWord("");
        setDisplayedWordIndex(displayedWordIndex + 1);
        setWordError(false);
      }
    }
  };

  const resetGame = () => {
    setStatus("waiting");
    resetCountdown();
    generateNewQuote();
    setDisplayedWordIndex(0);
    setTypedWord("");
    setTypedWords("");
    setCorrectScore(0);
    setInputType("text");
    setWordError(false);
    setWordErrorIndexes([]);
  };

  const start = () => {
    if (status !== "started") {
      setStatus("started");
      startCountdown();
    }
  };

  const stopGame = () => {
    setStatus("stopped");
    resetCountdown();
    setDisplayedWordIndex(0);
    setTypedWord("");
    setTypedWords("");
    setCorrectScore(0);
    setInputType("text");
    setWordError(false);
    setWordErrorIndexes([]);
  };

  return (
    <div className={styles["main-container"]}>
      <motion.div whileHover={{ scale: 1.1 }} className={styles["quit"]}>
        <Link href="/">
          <Image
            src={require("../../../assets/icons/back-arrow.svg")}
            alt="close icon"
          />
        </Link>
      </motion.div>
      <motion.div
        onClick={() => setShowModal(true)}
        whileHover={{ scale: 1.1 }}
        className={styles["instruction"]}
      >
        <Image
          src={require("../../../assets/icons/instruction.svg")}
          alt="instruction icon"
        />
      </motion.div>
      <p
        className={`${styles["countdown"]} ${
          styles[`${count <= 5 ? "danger" : count <= 10 ? "warning" : ""}`]
        }`}
      >
        {count}
      </p>
      <div className={styles["displays-container"]}>
        <div className={styles["output-wrapper"]}>
          <div className={styles["output-display"]}>
            <div className={styles["completion-bar-container"]}>
              <div
                className={styles["bar"]}
                style={{
                  width: `${Math.round(
                    (displayedWordIndex / displayedWords.length) * 100
                  )}%`,
                }}
              ></div>
            </div>
            {loading ? (
              <span className={`${styles["fetching"]}`}>Fetching Quote...</span>
            ) : displayedWords.length === 0 && fetchError ? (
              <span className={`${styles["error"]}`}>
                An error occurred while fetching quote. Try again.
              </span>
            ) : (
              displayedWords?.map((word, wordIndex) => (
                <span key={wordIndex}>
                  <span>
                    {word.split("").map((character, characterIndex) => (
                      <span
                        className={`${styles["initial-color"]} ${
                          styles[
                            `${generateStyleClass(wordIndex, characterIndex)}`
                          ]
                        }`}
                        key={characterIndex}
                      >
                        {character}
                      </span>
                    ))}
                  </span>
                  <span> </span>
                </span>
              ))
            )}
          </div>
          {status !== "started" && (
            <p
              className={styles["fetch-quote"]}
              onClick={() => generateNewQuote()}
            >
              Fetch New Quote
            </p>
          )}
        </div>
        <textarea
          ref={textInput}
          value={typedWords}
          onChange={(e) => handleInputChange(e.target.value)}
          className={styles["input-display"]}
          onKeyDown={(e) => {
            handleKeyDown(e);
          }}
          disabled={
            status === "waiting" ||
            status === "finished" ||
            status === "stopped"
          }
          autoComplete="off"
        />
      </div>
      <div className={styles["action-buttons"]}>
        {status !== "started" && (
          <>
            <Button variant="outline" onClick={() => setSetupModal(true)}>
              Setup
            </Button>
            <Button disabled={loading || fetchError} onClick={start}>
              Start
            </Button>
          </>
        )}
        {status === "started" && (
          <Button onClick={stopGame} variant="tertiary">
            Stop
          </Button>
        )}
      </div>
      {setupModal && (
        <SetupModal
          timer={timer}
          createTimer={handleTimerChange}
          close={() => setSetupModal(false)}
          customWords={customWords}
          createQuote={createQuote}
        />
      )}
      {completionModal && (
        <CompletionModal
          timer={timer}
          count={count}
          close={() => setCompletionModal(false)}
          totalWords={displayedWords.length}
          totalTyped={displayedWordIndex}
          correctScore={correctScore}
          restart={resetGame}
        />
      )}
      {showModal && <InstructionModal close={() => setShowModal(false)} />}
    </div>
  );
}
