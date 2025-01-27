import React from 'react';
import PropTypes from 'prop-types';
import styles from './NavBar.module.css';
import Link from 'next/link';
import Filter from '../../assets/Filter.jsx';

const NavigationItem = ({ icon: IconComponent, label, isSettings, onClick, href, isActive }) => {
  const classNameC = isSettings 
    ? styles.navItemSettings 
    : (label === 'Filter' && isActive 
        ? styles.navItemActive 
        : styles.navItem);

  return label === 'Filter' ? (
    <div className={classNameC} onClick={onClick}>
        <Filter />
        <span className={styles.label}>{label}</span>
    </div>
  ) : (
    <Link href={href}>
        <div className={classNameC} onClick={onClick}>
            {IconComponent && <IconComponent fill="white" />}
            {!isSettings && <span className={styles.label}>{label}</span>}
        </div>
    </Link>
  );
};

NavigationItem.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string,
    isSettings: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    href: PropTypes.string,
    isActive: PropTypes.bool,
};

export default NavigationItem;