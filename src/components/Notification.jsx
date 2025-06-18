import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '@/axios/axios';
import { useAuth } from '@hooks/useAuth';
import {
    Badge,
    IconButton,
    Popover,
    List,
    ListItem,
    ListItemText,
    Typography,
    Divider,
    Box,
    Paper
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';

function Notification() {
    const { authUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const keyPrefix = authUser?.email || 'guest';
    const open = Boolean(anchorEl);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axiosPrivate.get('/notifications/user/logged-in');
                const data = res.data || [];
                setNotifications(data);
                setUnreadCount(data.length);
                localStorage.setItem(`notifications_${keyPrefix}`, JSON.stringify(data));
                localStorage.setItem(`unread_count_${keyPrefix}`, data.length);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        fetchNotifications();
    }, [keyPrefix]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        if (!open) {
            setUnreadCount(0);
            localStorage.setItem(`unread_count_${keyPrefix}`, 0);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const deleteNotification = async (id) => {
        try {
            await axiosPrivate.delete(`/notifications/${id}`);
            const updated = notifications.filter((n) => n.id !== id);
            setNotifications(updated);
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const handleNotificationClick = (notification) => {
        deleteNotification(notification.id);
        navigate(notification.url);
        handleClose();
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                sx={{
                    color: 'rgba(148, 163, 184, 1)',
                    '&:hover': {
                        color: 'rgba(203, 213, 225, 1)',
                    }
                }}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        width: 320,
                        maxHeight: 400,
                        mt: 1,
                    }
                }}
            >
                <Paper sx={{ width: '100%' }}>
                    <Box sx={{ p: 1, pl: 2, borderBottom: '1px solid #e0e0e0' }}>
                        <Typography variant="inherit" component="div">
                            Thông báo
                        </Typography>
                    </Box>

                    {notifications.length > 0 ? (
                        <List sx={{ p: 0, maxHeight: 300, overflow: 'auto' }}>
                            {notifications.map((notification, index) => (
                                <div key={notification.id || index}>
                                    <ListItem
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5',
                                            },
                                            py: 1,
                                            px: 1.5,
                                        }}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                                    {notification.message}
                                                </Typography>
                                            }
                                            sx={{ pr: 1 }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                            sx={{
                                                color: '#9e9e9e',
                                                '&:hover': {
                                                    color: '#f44336',
                                                    backgroundColor: 'rgba(244, 67, 54, 0.04)',
                                                }
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </ListItem>
                                    {index < notifications.length - 1 && <Divider />}
                                </div>
                            ))}
                        </List>
                    ) : (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Không có thông báo mới
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Popover>
        </>
    );
}

export default Notification;