import React, { useState } from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Collapse, IconButton } from '@mui/material';
import { ExpandMore, ExpandLess, School, Menu, ChevronLeft } from '@mui/icons-material';
import PropTypes from 'prop-types';

const CourseSidebar = ({ modules, expandedSections, toggleSection, scrollToModule, expandAll, collapseAll }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={` p-2 transition-all duration-300 ease-in-out ${isOpen ? 'w-fit' : 'w-8'}  relative`}>
            <IconButton
                onClick={toggleSidebar}
                className="absolute top-0 right-2 "
                size="small"
            >
                {isOpen ? <ChevronLeft /> : <Menu />}
            </IconButton>
            {isOpen && (
                <div className={`${isOpen ? '' : 'hidden'} bg-blue-50 rounded-lg`}>
                    <div className="flex justify-evenly">
                        <button
                            className="p-2 bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors mr-2"
                            onClick={expandAll}>
                            Mở rộng
                        </button>
                        <button
                            className="p-2 bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors"
                            onClick={collapseAll}>
                            Thu nhỏ
                        </button>
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
                                    <ListItemText primary={module.title} />
                                    {expandedSections.includes(module.id) ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                {/* <Collapse in={expandedSections.includes(module.id)} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {module.contents &&
                                            module.contents
                                                .filter((item) => item.type === 'lecture')
                                                .map((lecture) => (
                                                    <ListItem button key={lecture.id} className="pl-8">
                                                        <ListItemText primary={lecture.title} />
                                                    </ListItem>
                                                ))}

                                    </List>
                                </Collapse> */}
                            </React.Fragment>
                        ))}
                    </List>
                </div>
            )}
            {!isOpen && (
                <div className="flex flex-col w-full items-center pt-16">
                    {modules.map((module) => (
                        <IconButton
                            key={module.id}
                            onClick={() => {
                                toggleSection(module);
                                scrollToModule(module.id);
                            }}
                            className=""
                        >
                            {/* <School /> */}
                        </IconButton>
                    ))}
                </div>
            )}
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

