import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import lodashGet from "lodash/get";
import { sendPing, sendGuess } from "../actions";
import Header from "../../Header";
import MainContent from "../../MainContent";
import Toast from "../../Toast";
import { Droppable } from "@shopify/draggable";

import "./Main.scss";

function Main({ player, currentRound, sendPing, game, sendGuess }) {
  const ref = React.createRef();
  const [toastClass, setToastClass] = useState("");
  const currentRoundState = useRef(currentRound);
  const playerRef = useRef(player);
  const [pointGain, setPointGain] = useState(0);

  useEffect(() => {
    const droppable = new Droppable(
      ref.current.querySelectorAll(".container"),
      {
        draggable: ".item",
        dropzone: ".dropzone"
      }
    );

    droppable.on("drag:stop", event => {
      const droppableDestination = event.source.parentNode;
      const destinationIndex = parseInt(droppableDestination.dataset.index, 10);
      const droppedIndex = parseInt(event.source.dataset.index, 10);

      if (!droppableDestination.classList.contains("guess")) {
        return;
      }

      let choices = [...currentRoundState.current.choices];

      let guess = {
        itemId: currentRoundState.current.id,
        playerId: player.id,
        playerKey: player.key,
        gameId: game.id,
        number: choices[droppedIndex],
        source: droppedIndex,
        destination: destinationIndex
      };

      sendGuess(guess);
    });

    droppable.on("droppable:dropped", event => {
      if (!event.dropzone.classList.contains("guess")) {
        event.cancel();
        return;
      }

      if (event.dropzone.classList.contains("draggable-dropzone--occupied")) {
        event.cancel();
        return;
      }
    });
  }, []);

  useEffect(() => {
    currentRound.answers.forEach((answer, index) => {
      if (answer.result === "incorrect") {
        const incorrectGuessDropzone = ref.current.querySelector(
          `.number-input .guess.dropzone[data-index="${index}"]`
        );
        const incorrectGuess = incorrectGuessDropzone.querySelector(
          ".choice.item"
        );
        const originalGuessLocation = ref.current.querySelector(
          `.choices .dropzone[data-index="${parseInt(answer.from, 10)}"]`
        );

        if (originalGuessLocation && incorrectGuess) {
          incorrectGuess.classList.toggle("incorrect");

          setTimeout(() => {
            incorrectGuess.classList.toggle("incorrect");
            originalGuessLocation.appendChild(incorrectGuess);
            incorrectGuessDropzone.classList.remove(
              "draggable-dropzone--occupied"
            );
            originalGuessLocation.classList.add("draggable-dropzone--occupied");
          }, 500);
        }
      }

      if (answer.result === "correct") {
        const correctGuessDropzone = ref.current.querySelector(
          `.number-input .guess[data-index="${index}"]`
        );
        const originalDiv = ref.current.querySelector(
          `.number-input .guess .choice.item[data-index="${answer.from}"]`
        );

        if (correctGuessDropzone && originalDiv) {
          correctGuessDropzone.removeChild(originalDiv);
        }
      }
    });

    if (currentRoundState.current.id !== currentRound.id) {
      [...ref.current.querySelectorAll(".guess.dropzone")].forEach(dropzone => {
        dropzone.innerHTML = null;
        dropzone.classList.remove("draggable-dropzone--occupied");
      });
    }

    currentRoundState.current = currentRound;
  }, [currentRound, ref]);

  useEffect(() => {
    if (playerRef.current.score.score !== player.score.score) {
      setPointGain(player.score.score - playerRef.current.score.score);
      setToastClass("show");

      setTimeout(() => {
        setToastClass("");
      }, 2000);
    }

    playerRef.current = player;
  }, [player, toastClass]);

  return (
    <div className="main">
      <Header></Header>
      <MainContent>
        <div ref={ref}>
          <div className="image">
            <div className="image-square"></div>
            <img className={`image-${currentRound.id} scale-up-center`} src={currentRound.image} />
          </div>
          <div className="number-input container">
            <h2>$</h2>
            {currentRound.answers.map((answer, index) => {
              if (answer.format === "decimal") {
                return (
                  <div className="decimal" key={currentRound.id + "-" + index}>
                    .
                  </div>
                );
              }

              if (answer.result === "correct") {
                return (
                  <div
                    className="guess"
                    key={currentRound.id + "-" + index}
                    data-index={index}
                  >
                    <div className="choice item correct">
                      <div className="bg">
                        <div className="number">{answer.number}</div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  className="guess dropzone"
                  key={index}
                  data-index={index}
                ></div>
              );
            })}
          </div>
          <div className="choices container">
            {currentRound.choices.map((choice, index) => (
              <div
                className="dropzone draggable-dropzone--occupied"
                data-index={index}
                data-number={choice}
                key={currentRound.id + "-" + index}
              >
                <div
                  className="choice item"
                  data-index={index}
                  data-number={choice}
                  hidden={choice === null ? "hidden" : ""}
                >
                  <div className="bg">
                    <div className="number">{choice}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainContent>
      <Toast className={`toast ${toastClass}`}>
        You've gained ${pointGain}
      </Toast>
    </div>
  );
}

function mapStateToProps(state) {
  return state.appReducer;
}

function mapDispatchToProps(dispatch) {
  return {
    sendPing: () => {
      dispatch(sendPing());
    },
    sendGuess: guess => {
      dispatch(sendGuess(guess));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
