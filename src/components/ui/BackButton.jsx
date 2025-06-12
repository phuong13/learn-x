"use client"
import { Button, IconButton, Tooltip } from "@mui/material"
import { KeyboardReturn } from "@mui/icons-material"

export default function BackButton({
    onClick,
    children = "Trở lại",
    variant = "text",
    size = "medium",
    color = "inherit",
    className = "",
    showIcon = true,
    iconOnly = false,
    disabled = false,
    tooltip = "",
    sx = {},
    ...props
}) {

    const handleClick = () => {
        if (onClick) {
            onClick()
        } else {
            history.back()
        }
    }

    // Icon-only button
    if (iconOnly) {
        const iconButton = (
            <IconButton
                onClick={handleClick}
                disabled={disabled}
                color={color}
                size={size}
                className={className}
                sx={{
                    border: 'none',
                    color: '#6b7280', // text-gray-500
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        color: '#374151', // text-gray-700
                    },
                    ...sx
                }}
                {...props}
            >
                <KeyboardReturn />
            </IconButton>
        )

        return tooltip ? <Tooltip title={tooltip}>{iconButton}</Tooltip> : iconButton
    }

    // Regular button with optional icon
    return (
        <Button
            variant={variant}
            size={size}
            color={color}
            onClick={handleClick}
            disabled={disabled}
            className={className}
            startIcon={showIcon ? <KeyboardReturn /> : null}
            
            sx={{
                border: 'none',
                boxShadow: 'none',
                color: '#6b7280', // text-gray-500
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    boxShadow: 'none',
                    color: '#374151', // text-gray-700
                },
                ...sx
            }}
            {...props}
        >
            {children}
        </Button>
    )
}