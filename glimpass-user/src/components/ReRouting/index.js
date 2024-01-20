import React from "react";
import "./reRouting.css";

const ReRouting = ({ icons }) => {
  return (
    <div className="reRoutingDiv">
      {icons.map((icon, index) => (
        <div key={index} className="icon" onClick={() => icon.action()}>
          <img src={icon.type} />
          {/* Assuming icon.type is the icon component */}
        </div>
      ))}
    </div>
  );
};

export default ReRouting;
