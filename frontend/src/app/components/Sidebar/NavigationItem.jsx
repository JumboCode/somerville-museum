import React from 'react';
import PropTypes from 'prop-types';
import styles from './NavBar.module.css';

const NavigationItem = ({ icon: IconComponent, label, isSettings, onClick }) => {
    const classNameC = isSettings
      ? styles.navItemSettings
      : styles.navItem;
  
    return (
      <div className={classNameC} onClick={onClick}>
        {IconComponent && <IconComponent className="otherSvgs" fill="white" />}
        {!isSettings && <span className={styles.label}>{label}</span>}
      </div>
    );
  };

NavigationItem.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string,
    isSettings: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
};

export default NavigationItem;