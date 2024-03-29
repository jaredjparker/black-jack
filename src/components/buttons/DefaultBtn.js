import React, { Fragment } from "react";
import "./DefaultBtn.css";

export default function DefaultBtn(props) {
  return (
    <Fragment>
      <button 
        id={props.idParent}
        className={props.disableBoolParent ? 'disable-btn' : 'default-btn'}
        disabled={props.disableBoolParent}
        onClick={props.callBackParent}
        >
        {props.txtParent}
      </button>
    </Fragment>
  );
}
