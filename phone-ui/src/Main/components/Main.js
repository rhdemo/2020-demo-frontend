import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { sendPing, sendGuess } from "../actions";
import Header from "../../Header";
import MainContent from "../../MainContent";
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
      const destinationIndex = droppableDestination.dataset.index;
      const droppedIndex = event.source.dataset.index;

      if (!droppableDestination.classList.contains("guess")) {
        return;
      }

      let choices = [...currentRoundState.current.choices];
      let answers = currentRoundState.current.answers.map(
        ({ format, number }) => ({
          format,
          number
        })
      );

      let guess = {
        itemId: currentRoundState.current.itemId,
        playerId: player.id,
        gameId: game.id,
        choices,
        source: droppedIndex,
        answers,
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

    if (currentRoundState.current.itemId !== currentRound.itemId) {
      [...ref.current.querySelectorAll(".guess.dropzone")].forEach(dropzone => {
        dropzone.innerHTML = null;
        dropzone.classList.remove("draggable-dropzone--occupied");
      });
    }

    currentRoundState.current = currentRound;
  }, [currentRound, ref]);

  useEffect(() => {
    if (playerRef.current.score !== player.score) {
      setPointGain(player.score - playerRef.current.score);
      setToastClass("show");

      setTimeout(() => {
        setToastClass("");
      }, 2000);
    }

    playerRef.current = player;
  }, [player, toastClass]);

  const imageBackground = {
    backgroundImage: `url(${currentRound.image})`
  };

  return (
    <div className="main">
      <Header></Header>
      <MainContent>
        <div ref={ref}>
          <div className="image">
            <div className="image-background" style={imageBackground}></div>
          </div>
          <div className="number-input container">
            <h2>$</h2>
            {currentRound.answers.map((answer, index) => {
              if (answer.format === "decimal") {
                return (
                  <div
                    className="decimal"
                    key={currentRound.itemId + "-" + index}
                  >
                    .
                  </div>
                );
              }

              if (answer.result === "correct") {
                return (
                  <div
                    className="guess"
                    key={currentRound.itemId + "-" + index}
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
                key={currentRound.itemId + "-" + index}
              >
                <div
                  className="choice item"
                  data-index={index}
                  data-number={choice}
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
      <div className={`toast ${toastClass}`}>
        <div>Nice!</div>
        <div>+{pointGain} Points</div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return state.mainReducer;
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
