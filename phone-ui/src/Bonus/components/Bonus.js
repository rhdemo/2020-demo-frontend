import React, { useEffect } from "react";
import { connect } from "react-redux";
import Header from "../../Header";
import MainContent from "../../MainContent";

import "./Bonus.scss";

function Bonus({ player }) {
  const canvasRef = React.createRef();
  const imageRef = React.createRef();
  const canvasWidth = 10 * 28 + 1;
  const canvasHeight = canvasWidth;
  const lineWidth = 16;
  let context;
  let canvas;
  let previous;
  let drawing = false;
  let imageSource;

  useEffect(() => {
    canvas = canvasRef.current;
    context = canvas.getContext("2d");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    if ("ontouchstart" in document.documentElement) {
      canvas.addEventListener("touchstart", touchstartHandler);
      canvas.addEventListener("touchmove", touchmoveHandler);
      canvas.addEventListener("touchend", touchendHandler);
    } else {
      canvas.addEventListener("mousedown", mousedownHandler);
      canvas.addEventListener("mouseup", mouseupHandler);
      canvas.addEventListener("mousemove", mousemoveHandler);
    }

    imageRef.current.onload = imageOnLoadHandler;
  }, []);

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
    var rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function submitGuess(event) {
    imageRef.current.src = canvas.toDataURL();
  }

  function imageOnLoadHandler() {
    /* we need images as 28*28=784 length list */
    var img = imageRef.current;
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
    console.log(JSON.stringify(inputs));

    alert("Image submitted");
  }

  return (
    <div className="bonus">
      <Header></Header>
      <MainContent>
        <canvas
          width={canvasWidth}
          height={canvasHeight}
          ref={canvasRef}
        ></canvas>
        <button onClick={submitGuess}>Submit Guess</button>
        <img ref={imageRef} />
      </MainContent>
    </div>
  );
}

function mapStateToProps(state) {
  return state.mainReducer;
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bonus);
