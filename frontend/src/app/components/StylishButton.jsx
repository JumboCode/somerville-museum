import React from 'react';
import PropTypes from 'prop-types';
import './StylishButton.css';

const StylishButton = ({ label, styleType, onClick }) => {
  const buttonClass = `stylish-button ${styleType}`; //add the style option to the class list

  return (
    <button className={buttonClass} onClick={onClick}>
      {label}
    </button>
  );
};

StylishButton.propTypes = {
  label: PropTypes.string.isRequired, //text inside button
  styleType: PropTypes.oneOf(['style1', 'style2', 'style3', 'style4']), //style option selection
  onClick: PropTypes.func, //onClick handler
};

StylishButton.defaultProps = {
  styleType: 'style1', //default to style option 1 if no style option is selected
  onClick: null, //default to no onClick handler
};

export default StylishButton;
