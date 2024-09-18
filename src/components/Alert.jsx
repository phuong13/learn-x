import { IconButton } from '@mui/material';
import { X } from 'lucide-react';

const variantStyles = {
    info: 'bg-blue-50 border-blue-400 text-blue-700',
    success: 'bg-green-50 border-green-400 text-green-700',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-700',
    error: 'bg-red-50 border-red-400 text-red-700',
};

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export default function Alert({
    title,
    message,
    variant = 'info',
    onClose,
    hideAfter = null,
    isVisible,
    onToggleVisibility,
}) {
    Alert.propTypes = {
        title: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        variant: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
        icon: PropTypes.elementType,
        onClose: PropTypes.func,
        hideAfter: PropTypes.number,
        isVisible: PropTypes.bool,
        onToggleVisibility: PropTypes.func,
    };

    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => setIsRendered(true), 10);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => setIsRendered(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    useEffect(() => {
        if (hideAfter !== null && isVisible) {
            const timer = setTimeout(() => {
                onToggleVisibility(false);
            }, hideAfter);

            return () => clearTimeout(timer);
        }
    }, [hideAfter, isVisible, onToggleVisibility]);

    if (!isVisible && !isRendered) return null;

    return (
        <div
            className={`alert fixed top-4 right-4 z-50 max-w-sm border-l-4 p-4 shadow-lg ${
                variantStyles[variant]
            } transition-all duration-300 ease-in-out ${
                isRendered ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-0 translate-x-full'
            }`}
            style={{
                transitionProperty: 'opacity, transform',
            }}>
            <div className="flex">
                <div className="flex-shrink-0">
                    <IconButton className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    {title && <p className="text-sm font-medium">{title}</p>}
                    <p className="text-sm mt-1">{message}</p>
                </div>
            </div>
            {onClose && (
                <button
                    className="absolute top-0 right-0 p-1.5 text-current hover:opacity-75"
                    onClick={onClose}
                    aria-label="Close">
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}
