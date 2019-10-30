import React, { Fragment } from "react";
import "./DefaultBtn.css";

export default function DefaultBtn(props) {
  return (
    <Fragment>
      <button 
        className={props.displayBoolParent ? 'display-none' : 'default-btn'}
        disabled={props.disableBoolParent}
        onClick={props.callBackParent}
        >
        {props.txtParent}
      </button>
    </Fragment>
  );
}
