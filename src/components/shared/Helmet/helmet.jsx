import React from "react";

const Helmet = (props) => {

  if (props.title) {
    document.title = props.title + "LocalShipper";
  }
  
  return <div className="w-100">{props.children}</div>;
};

export default Helmet;