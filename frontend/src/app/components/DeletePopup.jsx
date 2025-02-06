import React from "react";
import "./DeletePopup.css";

const DeletePopup = ({ onConfirm, onCancel }) => {
    return (
      <div className="deleteContainer">
            <div className="deleteContent">
                <img src="/icons/important.svg" className="importantIcon"/>
                <h2>Delete Item(s)</h2>
                <p>Are you sure you want to delete the following item(s)?</p>

                <p style={{ fontWeight: 700 }}>1, 2, 3 DUMMY DATA</p>

                <p>You can't undo this action.</p>

                <div className="buttons">
                    <button onClick={onCancel} className="cancel-button confirmCancel">Cancel</button>
                    <button onClick={onConfirm} className="confirm-button confirmDelete">Delete</button>
                </div>
            </div>
        </div>
    );
  };
  
  export default DeletePopup;