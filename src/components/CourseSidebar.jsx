import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Collapse, Button } from '@mui/material';
import { ExpandMore, ExpandLess, School } from '@mui/icons-material';
import PropTypes from 'prop-types';

const CourseSidebar = ({ modules, expandedSections, toggleSection, scrollToModule, expandAll, collapseAll }) => {
    return (
        <div className="w-64 bg-gray-100 h-screen overflow-y-auto">
            <div className="p-4">
                <div className="mb-4 space-x-2">
                    <Button variant="contained" color="primary" onClick={expandAll} size="small">
                        Expand All
                    </Button>
                    <Button variant="contained" color="secondary" onClick={collapseAll} size="small">
                        Collapse All
                    </Button>
                </div>
                <List component="nav">
                    {modules.map((module) => (
                        <React.Fragment key={module.id}>
                            <ListItem
                                button={true}
                                onClick={() => {
                                    toggleSection(module);
                                    scrollToModule(module.id);
                                }}
                            >
                                <ListItemIcon>
                                    <School />
                                </ListItemIcon>
                                <ListItemText primary={module.name} />
                                {expandedSections.includes(module.id) ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={expandedSections.includes(module.id)} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {module.lectures && module.lectures.map((lecture) => (
                                        <ListItem button key={lecture.id} className="pl-8">
                                            <ListItemText primary={lecture.name} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </React.Fragment>
                    ))}
                </List>
            </div>
        </div>
    );
};

CourseSidebar.propTypes = {
    modules: PropTypes.array.isRequired,
    expandedSections: PropTypes.array.isRequired,
    toggleSection: PropTypes.func.isRequired,
    scrollToModule: PropTypes.func.isRequired,
    expandAll: PropTypes.func.isRequired,
    collapseAll: PropTypes.func.isRequired,
}

export default CourseSidebar;

