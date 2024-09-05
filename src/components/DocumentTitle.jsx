// components
import { Helmet } from 'react-helmet';

// utils
import PropTypes from 'prop-types';

const DocumentTitle = ({ title = 'UTEz' }) => {
    return (
        <Helmet>
            <title>{title}</title>
        </Helmet>
    );
};

DocumentTitle.propTypes = {
    title: PropTypes.string.isRequired,
};

export default DocumentTitle;
