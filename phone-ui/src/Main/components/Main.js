import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { sendPing, sendGuess } from "../actions";
import { Droppable } from "@shopify/draggable";

import "./Main.scss";

function Main({ player, currentRound, sendPing, answer, game, sendGuess }) {
  const ref = React.createRef();
  const [droppable, setDroppable] = useState();
  const [droppableListenersSet, setDroppableListenersSet] = useState(false);

  useEffect(() => {
    const droppable = new Droppable(
      ref.current.querySelectorAll(".container"),
      {
        draggable: ".item",
        dropzone: ".dropzone"
      }
    );

    // setDroppable(droppable);

    droppable.on("drag:stop", event => {
      const droppableDestination = event.source.parentNode;
      const destinationIndex = droppableDestination.dataset.index;
      const droppedIndex = event.source.dataset.index;

      let choices = [...currentRound.choices];
      let answers = currentRound.answers.map(({ format, number }) => ({
        format,
        number
      }));

      let guess = {
        itemId: currentRound.itemId,
        playerId: player.id,
        gameId: game.id,
        choices,
        source: droppedIndex,
        answers,
        destination: destinationIndex
      };

      sendGuess(guess);
    });
    //
    // // droppable.on("drag:stop", dragStopHandler);
    //
    // droppable.on("droppable:dropped", event => {
    //   if (!event.dropzone.classList.contains("guess")) {
    //     event.cancel();
    //     return;
    //   }
    //
    //   if (event.dropzone.classList.contains("draggable-dropzone--occupied")) {
    //     event.cancel();
    //     return;
    //   }
    // });
  }, []);

  useEffect(() => {
    // if (!droppable) {
    //   return;
    // }
    //
    // function dragStopHandler(event) {
    //   const droppableDestination = event.source.parentNode;
    //   const destinationIndex = droppableDestination.dataset.index;
    //   const droppedIndex = event.source.dataset.index;
    //
    //   console.log(currentRound);
    //   let choices = [...currentRound.choices];
    //   let answers = currentRound.answers.map(({ format, number }) => ({
    //     format,
    //     number
    //   }));
    //
    //   let guess = {
    //     itemId: currentRound.itemId,
    //     playerId: player.id,
    //     gameId: game.id,
    //     choices,
    //     source: droppedIndex,
    //     answers,
    //     destination: destinationIndex
    //   };
    //
    //   sendGuess(guess);
    // }
    //
    // if (!droppableListenersSet) {
    //   droppable.on("drag:stop", dragStopHandler);
    //   setDroppableListenersSet(true);
    // }
  }, [droppable, currentRound]);

  useEffect(() => {
    // currentRound.answers.forEach((answer, index) => {
    //   if (answer.result === "incorrect") {
    //     const incorrectGuessDropzone = document.querySelector(
    //       `.number-input .guess.dropzone[data-index="${index}"]`
    //     );
    //     const incorrectGuess = incorrectGuessDropzone.querySelector(
    //       ".choice.item"
    //     );
    //     const originalGuessLocation = document.querySelector(
    //       `.choices .dropzone[data-index="${parseInt(answer.from, 10)}"]`
    //     );
    //
    //     originalGuessLocation.appendChild(incorrectGuess);
    //     incorrectGuessDropzone.classList.remove("draggable-dropzone--occupied");
    //     originalGuessLocation.classList.add("draggable-dropzone--occupied");
    //   }
    //
    //   if (answer.result === "correct") {
    //     // const correctGuessDropzone = document.querySelector(`.number-input .guess[data-index="${index}"]`);
    //     // const originalDiv = document.querySelector(`.number-input .guess .choice.item[data-index="${answer.from}"]`);
    //     // if (correctGuessDropzone && originalDiv) {
    //     //   correctGuessDropzone.removeChild(originalDiv);
    //     // }
    //   }
    // });
  }, [currentRound]);

  return (
    <div className="main">
      <header>
        <h1>Lando Calrissian</h1>
      </header>
      <main>
        <div className="mountains"></div>
        <div className="content" ref={ref}>
          <div className="image"></div>
          <div className="number-input container">
            <h2>$</h2>
            {currentRound.answers.map((answer, index) => {
              if (answer.format === "decimal") {
                return <div key={index}>.</div>;
              }

              // if (answer.result === "correct") {
              //   return (
              //     <div className="guess" key={index} data-index={index}>
              //       <div className="choice item">
              //         <div className="bg">
              //           <div className="number">{answer.number}</div>
              //         </div>
              //       </div>
              //     </div>
              //   )
              // }

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
                key={index}
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
      </main>
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
