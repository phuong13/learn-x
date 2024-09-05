// components
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
const CustomTooltip = ({ children, withArrow = true, tooltipClass, ...props }) => {
    return (
        <Tooltip
            TransitionComponent={Fade}
            arrow={withArrow}
            classes={{
                popper: 'p-[15px]',
                tooltip: `!bg-widget shadow !rounded-md !p-0 !font-body !text-body-text`,
                arrow: '!text-widget',
            }}
            enterTouchDelay={0}
            leaveTouchDelay={5000}
            {...props}
        >
            {children}
        </Tooltip>
    );
};

CustomTooltip.propTypes = {
    children: PropTypes.node.isRequired,
    withArrow: PropTypes.bool,
    tooltipClass: PropTypes.string,
};

export default CustomTooltip;
