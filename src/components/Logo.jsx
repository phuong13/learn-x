// components
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types'; // Add this line

// utils
import { memo } from 'react';

// assets
import light from '@assets/logo_hcmute.png';
// import dark from '@assets/logo_dark.svg';

const Logo = ({ imgClass, textClass }) => {
    Logo.propTypes = {
        imgClass: PropTypes.string,
        textClass: PropTypes.string,
    };
    return (
        <NavLink className="logo" to="/">
            <span className={`logo_img relative ${imgClass || ''}`}>
                <img src={light} alt="UTEz" />
                <img className={`absolute top-0 left-0`} src={light} alt="ShopPoint" />
            </span>
            <h4 className={`logo_text ${textClass || ''}`}>UTEz</h4>
        </NavLink>
    );
};

export default memo(Logo);
