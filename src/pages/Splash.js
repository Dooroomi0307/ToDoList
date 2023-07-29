import React from "react"
import "../elements/Splash.css"
import Logo from "../elements/logo-no-background.png"

const Splash = () => {
  return (
    <div className="splash">
      <img src={Logo} alt="Logo" className="splash-logo"/>
    </div>
  );
};

export default Splash;
