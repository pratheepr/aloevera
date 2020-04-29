import React, { Component } from "react";
import './popup.scss';

export default class PopUp extends Component {
  handleClick = () => {
   this.props.toggle();
  };
render() {

  console.log('INSIDE THE POPUP');
  
  return (
   <div className="modal">
     <div className="modal-content">
     <span className="close" onClick={this.handleClick}>&times;    </span>
     <p>{this.props.PopUpTxt}</p>
    </div>
   </div>
  );
 }
}