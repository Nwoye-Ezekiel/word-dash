import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";
import { fetchRandomQuote } from "../../api";
import SetupModal from "../modals/setup-modal";
import CompletionModal from "../modals/completion-modal";
import Button from "../button";
import Spacer from "../spacer";

export default function Start() {
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
  const [countdown, setCountdown] = useState(timer)
  const textInput = useRef<HTMLTextAreaElement>(null)

  const handleTimeChange = (timer: number) => {
    setTimer(timer);
    setCountdown(timer);
  };

  useEffect(() => {
    generateNewQuote();
  }, []);

  useEffect(() => {
    if (status === "started") {
      textInput.current?.focus();
    }
  }, [status]);

  const generateNewQuote = async () => {
    const quote = await fetchRandomQuote();
    createCustomWords(quote);
  };

  const createCustomWords = (words: string) => {
    setCustomWords(words);
    setDisplayedWords(words?.split(" "));
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
    if (inputType === "space") {
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
    generateNewQuote();
    setDisplayedWordIndex(0);
    setTypedCharacters("");
    setTypedCharacterIndex(-1);
    setError(false);
    setCorrectScore(0);
    setIncorrectScore(0);
    setInputType("text");
  };

  function start() {
    if (status !== "started") {
      setStatus("started");
      let interval = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount === 0) {
            clearInterval(interval);
            setStatus("finished");
            setCompletionModal(true);
            return timer;
          } else {
            return prevCount - 1;
          }
        });
      }, 1000);
    }
  }
 
  return (
    <div className={`modal-container ${styles["container"]}`}>
          <p className={styles["countdown"]}>{countdown}</p>
          <div className={styles["displays-container"]}>
            <div className={styles["output-display"]}>
              {displayedWords.map((word, wordIndex) => (
                <span key={wordIndex}>
                  <span>
                    {word.split("").map((character, characterIndex) => (
                      <span
                        className={
                          styles[`${generateStyleClass(wordIndex, characterIndex)}`]
                        }
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
            <Button onClick={() => setSetupModal(true)}>setup</Button>
            <Spacer width={30}/>
            <Button onClick={start} fill="primary">start</Button>
          </div>
          {setupModal && (
            <SetupModal
              timer={timer}
              createTimer={handleTimeChange}
              close={() => setSetupModal(false)}
              customWords={customWords}
              createCustomWords={createCustomWords}
            />
          )}
          {completionModal && (
            <CompletionModal
              timeElapsed={timer - countdown}
              close={() => setCompletionModal(false)}
              totalWords={displayedWords.length}
              correctScore={correctScore}
            />
          )}
        </div>
  );
}
