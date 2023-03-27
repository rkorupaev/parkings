import React, {useContext, useEffect, useRef, useState} from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import {CardAndClientsContext} from "../../CardsAndClients";

const style = {
    display: 'flex',
    flexGrow: '1'
}

function TabPanel(props) {
    const {children, value, index, tabWidth, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            style={value === index ? style : {}}
        >
            {value === index && (
                <Box sx={{pl: 0, pr: 0, flexGrow: 1, minHeight: '77vh', display: 'flex', maxWidth: tabWidth}}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`
    };
}

const TabContainer = ({items, setTabWidth, tabWidth}) => {
    const {tabValue, setTabValue, isNew} = useContext(CardAndClientsContext);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };


    const tab = useRef();

    useEffect(() => {
        if (tab.current) {
            setTabWidth(tab.current.clientWidth);
        }
    }, []);

    useEffect(() => {
        const listener = () => {
            if (tab.current) {
                setTabWidth(tab.current.clientWidth);
            }
        }
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    });

    const tabsArray = () => {
        if (isNew) {
            return <Tab key={0} label={items[0].label} {...a11yProps(0)}
                        sx={{fontSize: '12px', padding: '8px', minWidth: 'auto'}}/>
        } else {
            return items.map((item, index) => {
                return (
                    <Tab key={index} label={item.label} {...a11yProps(index)}
                         sx={{fontSize: '12px', padding: '8px', minWidth: 'auto'}}/>
                )
            });
        }
    }

    console.log(isNew, 'is new');

    const tabPanelArray = () => {
        if (isNew) {
            return (
                <TabPanel key={0} value={0} index={0} tabWidth={tabWidth}>
                    {items[0].componentFunc()}
                </TabPanel>
            )
        } else {
            return items.map((item, index) => {
                return (
                    <TabPanel key={index} value={tabValue} index={index} tabWidth={tabWidth}>
                        {item.componentFunc()}
                    </TabPanel>
                )
            });
        }
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            borderLeft: '1px solid #1976d2',
            marginLeft: '20px',
            paddingLeft: '20px'
        }}>
            <Box ref={tab}>
                <Tabs
                    value={tabValue}
                    onChange={handleChange}
                    aria-label="tabs"
                    sx={{marginBottom: '12px'}}
                >
                    {tabsArray()}
                </Tabs>
            </Box>
            {tabPanelArray()}
        </Box>
    );
}


export default TabContainer;
