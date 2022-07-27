import React, { useState, useEffect, useRef } from "react";
import { useCountdown } from 'usehooks-ts'
import styles from "./index.module.css";
import { fetchRandomQuote } from "../../api";
import SetupModal from "../modals/setup-modal";
import CompletionModal from "../modals/completion-modal";
import Button from "../button";
import Spacer from "../spacer";

export default function Play() {
  const DEFAULT_TIME = 30
  const [customWords, setCustomWords] = useState("");
  const [displayedWords, setDisplayedWords] = useState(Array<string>);
  const [displayedWordIndex, setDisplayedWordIndex] = useState(0)
  const [typedCharacters, setTypedCharacters] = useState("")
  const [typedCharacterIndex, setTypedCharacterIndex] = useState(-1)
  const [status, setStatus] = useState("waiting")
  const [correctScore, setCorrectScore] = useState(0)
  const [incorrectScore, setIncorrectScore] = useState(0)
  const [error, setError] = useState(false)
  const [setupModal, setSetupModal] = useState(false)
  const [completionModal, setCompletionModal] = useState(false)
  const [inputType, setInputType] = useState<'space' | 'backspace' | 'text'>('text')
  const [timer, setTimer] = useState(DEFAULT_TIME)
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: timer,
      intervalMs: 1000,
    })
  const textInput = useRef<HTMLTextAreaElement>(null)
  
  useEffect(() => {
    generateNewQuote();
  }, []);

  useEffect(() => {
    if (status === "started") textInput.current?.focus();
  }, [status]);

  useEffect(() => {
    resetCountdown();
  }, [timer]);

  useEffect(() => {
    if (count === 0) {
      stopCountdown();
      setCompletionModal(true);
      setStatus('finished');
    }
  }, [count]);

  const generateNewQuote = async () => {
    const quote = await fetchRandomQuote();
    createQuote(quote);
  };

  const createQuote = (words: string) => {
    setCustomWords(words);
    setDisplayedWords(words?.split(" "));
  };

  const handleTimerChange = (timer: number) => {
    setTimer(timer);
  };

  const handleKeyDown = ({ keyCode }: { keyCode: number }) => {
    if (keyCode === 32) setInputType("space");
    else if (keyCode === 8) setInputType("backspace");
    else setInputType("text");
  };

  function generateStyleClass(wordIndex: number, characterIndex: number) {
    if (wordIndex < displayedWordIndex) return "correct";
    else if (wordIndex === displayedWordIndex) {
      if (characterIndex < typedCharacterIndex + 1) {
        if (
          displayedWords[displayedWordIndex][characterIndex] ===
            typedCharacters[characterIndex] &&
          !(typedCharacterIndex === displayedWords[displayedWordIndex].length)
        ) {
          return "correct";
        } else {
          if (!error) {
            setError(true);
            setIncorrectScore(incorrectScore + 1);
          }
          return "incorrect";
        }
      } else return "";
    } else return "";
  }

  const handleInputChange = (value: string) => {
    setTypedCharacters(value);
    if (
      displayedWordIndex + 1 === displayedWords.length &&
      value === displayedWords[displayedWordIndex]
    ) {
      !error && setCorrectScore((prevScore) => prevScore + 1 );
      setDisplayedWordIndex(displayedWordIndex + 1);
      stopCountdown();
      setCompletionModal(true);
      setStatus('finished');
    }
    else if (inputType === "space") {
      if (typedCharacters !== displayedWords[displayedWordIndex]) {
        setTypedCharacterIndex(typedCharacterIndex + 1);
      } else {
        !error && setCorrectScore(correctScore + 1);
        setTypedCharacters("");
        setDisplayedWordIndex(displayedWordIndex + 1);
        setTypedCharacterIndex(-1);
        setError(false);
      }
    } else if (inputType === "backspace") {
      setTypedCharacterIndex(typedCharacterIndex - 1);
    } else {
      setTypedCharacterIndex(typedCharacterIndex + 1);
    }
  };

  const resetGame = () => {
    setStatus('waiting');
    resetCountdown();
    generateNewQuote();
    setDisplayedWordIndex(0);
    setTypedCharacters("");
    setTypedCharacterIndex(-1);
    setError(false);
    setCorrectScore(0);
    setIncorrectScore(0);
    setInputType("text");
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
    setTypedCharacterIndex(-1);
    setError(false);
    setCorrectScore(0);
    setIncorrectScore(0);
    setInputType("text");
  }
 
  return (
    <div className={styles["main-container"]}>
      <p
        className={`${styles["countdown"]} ${
          styles[`${count <= 5 ? "red" : count <= 10 ? "yellow" : ""}`]
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
            {displayedWords?.map((word, wordIndex) => (
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
            ))}
          </div>
          {status !== "started" && (
            <p
              className={styles["fetch-quote"]}
              onClick={() => generateNewQuote()}
            >
              fetch new quote
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
          disabled={status === "waiting" || status === "finished"}
        />
      </div>
      <div className={styles["action-buttons"]}>
        {status !== "started" && (
          <>
            <Button
              variant="outline"
              onClick={() => setSetupModal(true)}
            >
              setup
            </Button>
            <Spacer width={30} />
            <Button onClick={start} variant="solid">
              start
            </Button>
          </>
        )}
        {status === "started" && 
          <Button onClick={stopGame} variant="solid">
              stop
          </Button>}
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
