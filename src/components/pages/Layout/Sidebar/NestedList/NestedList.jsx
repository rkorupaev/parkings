import React from "react";
import PropTypes from "prop-types";
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import withStyles from "@material-ui/core/styles/withStyles";
import {
    Link, NavLink,
} from "react-router-dom";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";

const styles = theme => ({
        root: {
            width: '100%',
            maxWidth: 360,
            overflowX: 'auto',
        },
        list: {
            maxWidth: '285px',
            overflowX: 'hidden'
        },
        nested: {
            paddingLeft: theme.spacing(4)
        },
        text: {
            padding: 0
        },
        link: {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            textDecoration: 'none',
            color: 'inherit',
            paddingLeft: '8px',
            borderRadius: '6px',
            borderBottom: 'none',
        },
        active: {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            color: 'inherit',
            textDecoration: 'none',
            paddingLeft: '8px',
            borderRadius: '6px',
            border: '1px solid black'
        }
    });

class NestedList extends React.Component {
    state = {open: {}};

    handleClick = key => () => {
        console.log(key);
        this.setState({[key]: !this.state[key]});
    };

    render() {
        const {lists, classes} = this.props;

        return (
            <div className={classes.root}>
                <List
                    component="nav"
                    className={classes.list}
                >
                    {lists.map(({key, label, icon: Icon, items, color, route}) => {
                        const open = this.state[key] || false;
                        return (
                            <div key={key}>
                                <ListItem button onClick={route ? () => {
                                } : this.handleClick(key)}>
                                    <ListItemIcon>
                                        <Icon color={color}/>
                                    </ListItemIcon>
                                    {!route ?
                                        <ListItemText inset primary={label} className={classes.text}/>
                                        :
                                        <NavLink to={route}
                                                 className={({isActive}) => isActive ? classes.active : classes.link}>
                                            <ListItemText inset primary={label}
                                                          className={classes.text}/>
                                        </NavLink>
                                    }
                                    {!route ? (open) ? <ExpandLess/> : <ExpandMore/> : ''}
                                </ListItem>
                                {items ?
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {items.map(({key: childKey, label: childLabel, icon: ChildIcon, route, color}) => (
                                                <ListItem key={childKey} button className={classes.nested}>
                                                    <NavLink to={route}
                                                             className={({isActive}) => isActive ? classes.active : classes.link}>
                                                        {ChildIcon ?
                                                            <ListItemIcon>
                                                                <ChildIcon color={color}/>
                                                            </ListItemIcon> : ''}
                                                        <ListItemText inset primary={childLabel}
                                                                      className={classes.text}/>
                                                    </NavLink>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Collapse>
                                    : ''}
                            </div>
                        );
                    })}
                </List>
            </div>
        );
    }
}

NestedList.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NestedList);
