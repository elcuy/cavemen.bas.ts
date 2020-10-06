import * as ReactDOM from "react-dom";

import React from "react";
import Scene from "./Scene";

const Cavemen = (): JSX.Element => {
  return(<h1>Cavemen Game</h1>)
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<Scene />, document.getElementById("cavemen"));
});

export default Cavemen;
