import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import Header from "../../Header";
import MainContent from "../../MainContent";
import Button from "../../Button";
import Toast from "../../Toast";

import "./Bonus.scss";
import { sendBonusGuess } from "../actions";

function Bonus({ game, player, currentRound, sendBonusGuess }) {
  const [correctToastClass, setCorrectToastClass] = useState("");
  const [wrongToastClass, setWrongToastClass] = useState("");
  const [lastWrongGuess, setLastWrongGuess] = useState("");
  const [options, setOptions] = useState([]);
  const playerRef = useRef(player);
  const [pointGain, setPointGain] = useState(0);
  const canvasWidth = 10 * 28 + 1;
  const canvasHeight = canvasWidth;
  const lineWidth = 36;
  let image = useRef(null);
  let canvas = useRef(null);
  let previous;
  let drawing = false;
  let imageSource;

  useEffect(() => {
    const context = canvas.current.getContext("2d");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    if ("ontouchstart" in document.documentElement) {
      canvas.current.addEventListener("touchstart", touchstartHandler);
      canvas.current.addEventListener("touchmove", touchmoveHandler);
      canvas.current.addEventListener("touchend", touchendHandler);
    } else {
      canvas.current.addEventListener("mousedown", mousedownHandler);
      canvas.current.addEventListener("mouseup", mouseupHandler);
      canvas.current.addEventListener("mousemove", mousemoveHandler);
    }

    image.current.onload = imageOnLoadHandler;
  }, [canvas, image]);

  useEffect(() => {
    let options = [...currentRound.choices];

    for (let i = 0; i < currentRound.answers.length; i++) {
      if (currentRound.answers[i].result === "incorrect") {
        setWrongToastClass("show");
        setLastWrongGuess(currentRound.answers[i].number);

        setTimeout(() => {
          setWrongToastClass("");
        }, 2000);
        break;
      }

      if (currentRound.answers[i].result === "correct") {
        const index = options.findIndex(option => option === currentRound.answers[i].number);
        options.splice(index, 1);
      }
    }

    setOptions([...new Set(options)]);

    clear();
  }, [currentRound]);

  useEffect(() => {
    if (playerRef.current.score !== player.score) {
      setPointGain(player.score - playerRef.current.score);
      setCorrectToastClass("show");

      setTimeout(() => {
        setCorrectToastClass("");
      }, 2000);
    }

    playerRef.current = player;
  }, [player, correctToastClass]);

  function touchstartHandler(event) {
    const xPosition = event.targetTouches[0]
      ? event.targetTouches[0].pageX
      : event.changedTouches[event.changedTouches.length - 1].pageX;
    const yPosition = event.targetTouches[0]
      ? event.targetTouches[0].pageY
      : event.changedTouches[event.changedTouches.length - 1].pageY;

    drawing = true;
    previous = getPosition(xPosition, yPosition);
  }

  function touchmoveHandler(event) {
    if (drawing) {
      const xPosition = event.targetTouches[0]
        ? event.targetTouches[0].pageX
        : event.changedTouches[event.changedTouches.length - 1].pageX;
      const yPosition = event.targetTouches[0]
        ? event.targetTouches[0].pageY
        : event.changedTouches[event.changedTouches.length - 1].pageY;
      const current = getPosition(xPosition, yPosition);
      const context = canvas.current.getContext("2d");
      context.lineWidth = lineWidth;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(previous.x, previous.y);
      context.lineTo(current.x, current.y);
      context.stroke();
      context.closePath();
      previous = current;
    }
  }

  function touchendHandler(event) {
    drawing = false;
  }

  function mousedownHandler(event) {
    drawing = true;
    previous = getPosition(event.clientX, event.clientY);
  }

  function mouseupHandler(event) {
    drawing = false;
  }

  function mousemoveHandler(event) {
    if (drawing) {
      const current = getPosition(event.clientX, event.clientY);
      const context = canvas.current.getContext("2d");
      context.lineWidth = lineWidth;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(previous.x, previous.y);
      context.lineTo(current.x, current.y);
      context.stroke();
      context.closePath();
      previous = current;
    }
  }

  function getPosition(clientX, clientY) {
    var rect = canvas.current.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function submitGuess(event) {
    image.current.src = canvas.current.toDataURL();
  }

  function clear() {
    const context = canvas.current.getContext("2d");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  function imageOnLoadHandler() {
    /* we need images as 28*28=784 length list */
    var img = image.current;
    var inputs = [];
    var small = document.createElement("canvas").getContext("2d");
    /* Resize the larger Image to 28*28 */
    small.drawImage(img, 0, 0, img.width, img.height, 0, 0, 28, 28);
    /* get the pixels of Image. You will get 28*28*4 array */
    /* y axis is towards south. and x axis is towards east */
    var data = small.getImageData(0, 0, 28, 28).data;
    for (var y = 0; y < 28; y++) {
      for (var x = 0; x < 28; x++) {
        /* location of next pixel subarray */
        /* https://code.tutsplus.com/tutorials/canvas-from-scratch-pixel-manipulation--net-20573 */
        var n = 4 * (y * 28 + x);
        /* convert to grayscale */
        inputs[y * 28 + x] = (data[n + 0] + data[n + 1] + data[n + 2]) / 3;
      }
    }
    if (Math.min(...inputs) === 255) {
      return;
    }
    /* normalize the list */
    inputs = inputs.map(v => (255 - v) / 255.0);

    let guess = {
      playerId: player.id,
      gameId: game.id,
      image: inputs
    };

    sendBonusGuess(guess);
  }

  const imageBackground = {
    backgroundImage: `url(${currentRound.image})`
  };

  return (
    <div className="bonus">
      <Header></Header>
      <MainContent>
        <div className="number-input">
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
                  <div className={"choice item " + answer.result}>
                    <div className="bg">
                      <div className="number">{answer.number}</div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                className="guess"
                key={currentRound.itemId + "-" + index}
              ></div>
            );
          })}
          <div className="image">
            <div className="image-background" style={imageBackground}></div>
          </div>
        </div>
        <div className="hint">
          Want a hint? Try these:&nbsp;
          {options.map((option, index) => (
            <span key={index}>{option}&nbsp;</span>
          ))}
        </div>
        <div className="canvas-container">
          <canvas width={canvasWidth} height={canvasHeight} ref={canvas}></canvas>
          <div className="canvas-border"></div>
        </div>
        <div>
          <Button handleClick={submitGuess}>Guess</Button>
          <Button handleClick={clear}>Clear</Button>
        </div>
        <img id="hidden-img" ref={image} />
      </MainContent>
      <Toast className={`warning ${wrongToastClass}`}>
        <div>{lastWrongGuess} is incorrect</div>
        <div>Try again</div>
      </Toast>
      <Toast className={`toast ${correctToastClass}`}>
        <div>Nice!</div>
        <div>+{pointGain} Points</div>
      </Toast>
    </div>
  );
}

function mapStateToProps(state) {
  return state.bonusReducer;
}

function mapDispatchToProps(dispatch) {
  return {
    sendBonusGuess: guess => {
      dispatch(sendBonusGuess(guess));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bonus);
