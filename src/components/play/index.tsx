import React, { useState, useEffect, useRef } from "react";
import { useCountdown } from "usehooks-ts";
import styles from "./index.module.css";
import { fetchRandomQuote } from "../../apis";
import SetupModal from "../modals/setupModal";
import CompletionModal from "../modals/completionModal";
import Button from "../button";

export default function Play() {
  const DEFAULT_TIME = 30;
  const [customWords, setCustomWords] = useState("");
  const [displayedWords, setDisplayedWords] = useState(Array<string>);
  const [displayedWordIndex, setDisplayedWordIndex] = useState(0);
  const [typedCharacters, setTypedCharacters] = useState("");
  const [status, setStatus] = useState("waiting");
  const [correctScore, setCorrectScore] = useState(0);
  const [incorrectScore, setIncorrectScore] = useState(0);
  const [wordError, setWordError] = useState(false);
  const [wordErrorIndexes, setWordErrorIndexes] = useState(Array<number>);
  const [fetchError, setFetchError] = useState(false);
  const [loading, setLoading] = useState(false);
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
    words = words.trim();
    setCustomWords(words);
    setDisplayedWords(words?.split(" "));
    setFetchError(false);
  };

  const handleTimerChange = (timer: number) => {
    setTimer(timer);
  };

  const handleKeyDown = ({ keyCode }: { keyCode: number }) => {
    if (keyCode === 32) setInputType("space");
    else setInputType("text");
  };

  function generateStyleClass(wordIndex: number, characterIndex: number) {
    if (wordIndex < displayedWordIndex) {
      if (wordErrorIndexes.includes(wordIndex)) {
        return "incorrect";
      } else {
        return "correct";
      }
    } else if (wordIndex === displayedWordIndex) {
      if (characterIndex < typedCharacters.length) {
        if (
          displayedWords[displayedWordIndex][characterIndex] ===
            typedCharacters[characterIndex] &&
          !(typedCharacters.length > displayedWords[displayedWordIndex].length)
        ) {
          return "correct";
        } else {
          if (!wordError) {
            setWordError(true);
            setWordErrorIndexes([...wordErrorIndexes, displayedWordIndex]);
            setIncorrectScore(incorrectScore + 1);
          }
          if (
            typedCharacters.length > displayedWords[displayedWordIndex].length
          )
            return "warning";
          else return "incorrect";
        }
      } else return "";
    } else return "";
  }

  const handleInputChange = (value: string) => {
    value = value
      .replace("”", '"')
      .replace("“", '"')
      .replace("’", "'")
      .replace("‘", "'")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/[\u2026]/g, "...");

    setTypedCharacters(value);

    if (
      displayedWordIndex + 1 === displayedWords.length &&
      value === displayedWords[displayedWordIndex]
    ) {
      !wordError && setCorrectScore((prevScore) => prevScore + 1);
      setDisplayedWordIndex(displayedWordIndex + 1);
      stopCountdown();
      setCompletionModal(true);
      setStatus("finished");
    } else if (
      inputType === "space" &&
      typedCharacters === displayedWords[displayedWordIndex]
    ) {
      !wordError && setCorrectScore(correctScore + 1);
      setTypedCharacters("");
      setDisplayedWordIndex(displayedWordIndex + 1);
      setWordError(false);
    }
  };

  const resetGame = () => {
    setStatus("waiting");
    resetCountdown();
    generateNewQuote();
    setDisplayedWordIndex(0);
    setTypedCharacters("");
    setCorrectScore(0);
    setIncorrectScore(0);
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
    setTypedCharacters("");
    setCorrectScore(0);
    setIncorrectScore(0);
    setInputType("text");
    setWordError(false);
    setWordErrorIndexes([]);
  };

  return (
    <div className={styles["main-container"]}>
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
          value={typedCharacters}
          onChange={(e) => handleInputChange(e.target.value)}
          className={styles["input-display"]}
          onKeyDown={(e) => handleKeyDown(e)}
          maxLength={displayedWords[displayedWordIndex]?.length + 1}
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
            <Button
              disabled={loading || fetchError}
              onClick={start}
              variant="solid"
            >
              Start
            </Button>
          </>
        )}
        {status === "started" && (
          <Button onClick={stopGame} variant="solid">
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
          timeElapsed={timer - count}
          close={() => setCompletionModal(false)}
          totalWords={displayedWords.length}
          totalTyped={displayedWordIndex}
          correctScore={correctScore}
          restart={resetGame}
        />
      )}
    </div>
  );
}
