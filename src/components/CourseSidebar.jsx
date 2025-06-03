import React, { useState } from 'react';
import {
    List, ListItem, ListItemText, ListItemIcon, Collapse, IconButton, Tooltip
} from '@mui/material';
import {
    ExpandMore, ExpandLess, School, Menu, ChevronLeft,
    Quiz, Assignment, InsertDriveFile
} from '@mui/icons-material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import PropTypes from 'prop-types';
import { UnfoldMore, UnfoldLess } from '@mui/icons-material';


const typeIcon = {
    lecture: <MenuBookIcon color="primary" />,
    quiz: <Quiz sx={{ color: '#45DFB1' }}/>,
    assignment: <Assignment sx={{ color: '#EC4899' }} />,
    resource: <InsertDriveFile sx={{ color: '#F3533A' }} />,
};

const typeLabel = {
    lecture: 'Bài giảng',
    quiz: 'Quiz',
    assignment: 'Bài tập',
    resource: 'Tài liệu',
};

const CourseSidebar = ({
    modules, expandedSections, toggleSection, scrollToModule, expandAll, collapseAll
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    // ...existing code...
    return (
        <div className={`p-2 transition-all duration-300 ease-in-out ${isOpen ? 'w-56' : 'w-12'} relative`}>
            <IconButton
                onClick={toggleSidebar}
                className="absolute top-0 right-2"
                size="small"
            >
                 <Menu />
            </IconButton>
            {isOpen && (
                <div className=" rounded-lg">
                    <List component="nav" dense>
                        {modules.map((module) => (
                            <React.Fragment key={module.id}>
                                <ListItem
                                    button
                                    onClick={() => {
                                        toggleSection(module);
                                        scrollToModule(module.id);
                                    }}
                                    sx={{
                                        py: 0.7,
                                        fontWeight: 600,
                                        bgcolor: '#e0e7ef',
                                        borderRadius: '6px',
                                        mb: 0.5,
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <School fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={module.title}
                                        className="truncate overflow-hidden whitespace-nowrap"

                                        primaryTypographyProps={{
                                            fontWeight: 600, fontSize: 15, className: 'truncate',
                                            noWrap: true,
                                        }}
                                    />
                                    {expandedSections.includes(module.id) ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse in={expandedSections.includes(module.id)} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {module.contents && module.contents.map((item) => (
                                            <ListItem
                                                button
                                                key={item.id}
                                                className="pl-8"
                                                sx={{

                                                    py: 0.5,
                                                    bgcolor: '#f6f8fa',
                                                    borderLeft: '3px solid #cbd5e1',
                                                    mb: 0.5,
                                                    width: '100%',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <ListItemIcon sx={{ minWidth: 28 }}>
                                                    <Tooltip title={typeLabel[item.type] || ''}>
                                                        {typeIcon[item.type] || <InsertDriveFile fontSize="small" />}
                                                    </Tooltip>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item.title}
                                                    className="truncate overflow-hidden whitespace-nowrap"

                                                    primaryTypographyProps={{
                                                        fontSize: 13, color: '#334155', className: 'truncate',
                                                        noWrap: true,
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </React.Fragment>
                        ))}
                    </List>
                </div>
            )}
        </div>
    );
    // ...existing code...
};

CourseSidebar.propTypes = {
    modules: PropTypes.array.isRequired,
    expandedSections: PropTypes.array.isRequired,
    toggleSection: PropTypes.func.isRequired,
    scrollToModule: PropTypes.func.isRequired,
    expandAll: PropTypes.func.isRequired,
    collapseAll: PropTypes.func.isRequired,
};

export default CourseSidebar;