import React from 'react';
import PropTypes from 'prop-types';
import styles from './NavBar.module.css';

const NavigationItem = ({ icon: IconComponent, label, isActive, isSettings, onClick }) => {
    const className = isSettings
      ? styles.navItemSettings
      : isActive
      ? styles.navItemActive
      : styles.navItem;
  
    return (
      <div
        className={className}
        role="button"
        tabIndex={0}
        onClick={onClick}
        aria-label={label}
        aria-pressed={isActive}
      >
        {IconComponent && <IconComponent className={styles.icon} />}
        <span className={styles.label}>{label}</span>
      </div>
    );
  };
  
NavigationItem.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    isSettings: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
};

export default NavigationItem;