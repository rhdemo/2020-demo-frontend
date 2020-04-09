import React from "react";
import { connect } from "react-redux";

import "./Avatar.scss";
import { ReactComponent as Background } from "../../images/avatar/background-01.svg";
import { ReactComponent as Monster1 } from "../../images/avatar/monster-1-01.svg";
import { ReactComponent as Monster2 } from "../../images/avatar/monster-2-01.svg";
import { ReactComponent as Monster3 } from "../../images/avatar/monster-3-01.svg";
import { ReactComponent as Monster4 } from "../../images/avatar/monster-4-01.svg";
import { ReactComponent as Monster5 } from "../../images/avatar/monster-5-01.svg";
import { ReactComponent as Ears1 } from "../../images/avatar/ears-1-01.svg";
import { ReactComponent as Ears2 } from "../../images/avatar/ears-2-01.svg";
import { ReactComponent as Ears3 } from "../../images/avatar/ears-3-01.svg";
import { ReactComponent as Ears4 } from "../../images/avatar/ears-4-01.svg";
import { ReactComponent as Ears5 } from "../../images/avatar/ears-5-01.svg";
import { ReactComponent as Eyes1 } from "../../images/avatar/eyes-1-happy-01.svg";
import { ReactComponent as Eyes2 } from "../../images/avatar/eyes-2-happy-01.svg";
import { ReactComponent as Eyes3 } from "../../images/avatar/eyes-3-happy-01.svg";
import { ReactComponent as Eyes4 } from "../../images/avatar/eyes-4-happy-01.svg";
import { ReactComponent as Eyes5 } from "../../images/avatar/eyes-5-happy-01.svg";
import { ReactComponent as Mouth1 } from "../../images/avatar/mouth-1-happy-01.svg";
import { ReactComponent as Mouth2 } from "../../images/avatar/mouth-2-happy-01.svg";
import { ReactComponent as Mouth3 } from "../../images/avatar/mouth-3-happy-01.svg";
import { ReactComponent as Mouth4 } from "../../images/avatar/mouth-4-happy-01.svg";
import { ReactComponent as Mouth5 } from "../../images/avatar/mouth-5-happy-01.svg";
import { ReactComponent as Nose1 } from "../../images/avatar/nose-1-01.svg";
import { ReactComponent as Nose2 } from "../../images/avatar/nose-2-01.svg";
import { ReactComponent as Nose3 } from "../../images/avatar/nose-3-01.svg";
import { ReactComponent as Nose4 } from "../../images/avatar/nose-4-01.svg";
import { ReactComponent as Nose5 } from "../../images/avatar/nose-5-01.svg";

function Avatar({ player }) {
  const images = require.context("../../images/avatar", true);
  const monsters = [
    <Monster1 />,
    <Monster2 />,
    <Monster3 />,
    <Monster4 />,
    <Monster5 />
  ];
  const ears = [<Ears1 />, <Ears2 />, <Ears3 />, <Ears4 />, <Ears5 />];
  const eyes = [<Eyes1 />, <Eyes2 />, <Eyes3 />, <Eyes4 />, <Eyes5 />];
  const mouths = [<Mouth1 />, <Mouth2 />, <Mouth3 />, <Mouth4 />, <Mouth5 />];
  const noses = [<Nose1 />, <Nose2 />, <Nose3 />, <Nose4 />, <Nose5 />];

  function computeSvg(region, number) {
    let svg;

    switch (region) {
      case "monster":
        svg = monsters[number];
        break;
      case "ears":
        svg = ears[number];
        break;
      case "nose":
        svg = noses[number];
        break;
      case "eyes":
        svg = eyes[number];
        break;
      case "mouth":
        svg = mouths[number];
        break;
    }

    return svg;
  }

  return (
    <div className="Avatar">
      <div className="background">
        <Background />
      </div>
      <div className={`monster color-${player.avatar.color}`}>
        {computeSvg("monster", player.avatar.body)}
      </div>
      <div className={`ears color-${player.avatar.color}`}>
        {computeSvg("ears", player.avatar.ears)}
      </div>
      <div className={`eyes color-${player.avatar.color}`}>
        {computeSvg("eyes", player.avatar.eyes)}
      </div>
      <div className={`mouth color-${player.avatar.color}`}>
        {computeSvg("mouth", player.avatar.mouth)}
      </div>
      <div className={`nose color-${player.avatar.color}`}>
        {computeSvg("nose", player.avatar.nose)}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return state.mainReducer;
}

export default connect(mapStateToProps)(Avatar);
