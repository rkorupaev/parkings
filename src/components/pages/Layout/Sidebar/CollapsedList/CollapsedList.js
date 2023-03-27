import React, {useState} from 'react';
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import SubList from "./SubList/SubList";

const CollapsedList = ({lists}) => {
    const [submenuStyles, setSubmenuStyles] = useState({position: 'fixed', left: 69, top: 0, display: 'none'});
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [submenuOpened, setSubmenuOpened] = useState(false);

    const hoverSidebarIcon = (target, key) => {
        setSubmenuStyles({...submenuStyles, top: getSubMenuPosition(target)});
        setActiveSubmenu(key);
        setSubmenuOpened(true);
    }

    const getSubMenuPosition = (target) => {
        return target.offsetParent.offsetTop + target.offsetTop;
    }

    const hideSubmenu = () => {
        // setSubmenuStyles({...submenuStyles, display: 'none'});
        setActiveSubmenu(null);
    }

    return (
        <Box sx={{width: '100%', maxWidth: '52px', overflowX: 'auto'}}>
            <List
                component="nav"
            >
                {lists.map(({key, label, icon: Icon, items, color, route}) => {
                    return <div key={key}>
                        <ListItem sx={{cursor: 'pointer', position: 'relative'}}
                                  onMouseEnter={(e) => hoverSidebarIcon(e.target, key)}
                                  onMouseLeave={hideSubmenu}>
                            <ListItemIcon sx={{minWidth: 'auto'}}>
                                <Icon color={color}/>
                            </ListItemIcon>
                            <SubList keyProp={key + '_sub'} items={items} activeSubmenu={activeSubmenu} submenuStyles={submenuStyles} />
                        </ListItem>
                    </div>
                })}
            </List>
        </Box>
    );
};

export default CollapsedList;
