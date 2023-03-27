import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
// @ts-ignore
import FiscalTab from './FiscalTab/FiscalTab.jsx';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    currentSystem: {};
}

const tabStyle = {
    fontSize: '11px',
    p: '8px',
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, currentSystem,  ...other} = props;


    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <FiscalTab value={value} currentSystem={currentSystem}/>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

// @ts-ignore
export default function FiscalTabs({currentSystem}) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{flexGrow: 1, p: '8px', pl: '16px'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant='fullWidth'>
                    <Tab label="Операции со сменой" {...a11yProps(0)} sx={tabStyle}/>
                    <Tab label="X-отчет" {...a11yProps(1)} sx={tabStyle}/>
                    <Tab label="Инкассация" {...a11yProps(2)} sx={tabStyle}/>
                    <Tab label="Подкрепление" {...a11yProps(3)} sx={tabStyle}/>
                </Tabs>
            </Box>
            <TabPanel value={value} index={0} currentSystem={currentSystem}>
                Item One
            </TabPanel>
            <TabPanel value={value} index={1} currentSystem={currentSystem}>
                Item Two
            </TabPanel>
            <TabPanel value={value} index={2} currentSystem={currentSystem}>
                Item Three
            </TabPanel>
            <TabPanel value={value} index={3} currentSystem={currentSystem}>
                Item Four
            </TabPanel>
        </Box>
    );
}
