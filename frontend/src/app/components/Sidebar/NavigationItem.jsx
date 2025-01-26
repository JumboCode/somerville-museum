import React from 'react';
import PropTypes from 'prop-types';
import styles from './NavBar.module.css';
import Link from 'next/link';

const NavigationItem = ({ icon: IconComponent, label, isSettings, onClick, href, isActive }) => {
    const classNameC = isSettings 
      ? styles.navItemSettings 
      : (label === 'Filter' && isActive 
          ? styles.navItemActive 
          : styles.navItem);

    return (
      <Link href={href} className={classNameC} onClick={onClick}>
        {IconComponent && <IconComponent className="otherSvgs" fill="white" />}
        {!isSettings && <span className={styles.label}>{label}</span>}
      </Link>
    );
};

NavigationItem.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string,
    isSettings: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    href: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
};

export default NavigationItem;