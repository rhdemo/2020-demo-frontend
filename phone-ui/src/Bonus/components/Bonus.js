import React, { useEffect } from "react";
import { connect } from "react-redux";
import Header from "../../Header";
import MainContent from "../../MainContent";

import "./Bonus.scss";

function Bonus({ player }) {
  const canvasRef = React.createRef();
  let context;
  let canvas;
  let previous;
  let drawing = false;

  useEffect(() => {
    canvas = canvasRef.current;
    context = canvas.getContext("2d");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, 300, 300);

    if ("ontouchstart" in document.documentElement) {
      canvas.addEventListener("touchstart", touchstartHandler);
      canvas.addEventListener("touchmove", touchmoveHandler);
      canvas.addEventListener("touchend", touchendHandler);
    } else {
      canvas.addEventListener("mousedown", mousedownHandler);
      canvas.addEventListener("mouseup", mouseupHandler);
      canvas.addEventListener("mousemove", mousemoveHandler);
    }
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
      context.lineWidth = 32;
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
      context.lineWidth = 16;
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

  return (
    <div className="bonus">
      <Header></Header>
      <MainContent>
        <canvas width="300" height="300" ref={canvasRef}></canvas>
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
