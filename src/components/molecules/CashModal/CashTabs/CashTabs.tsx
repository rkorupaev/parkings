import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
// @ts-ignore
import CashTab from './CashTab/CashTab';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const tabStyle = {
    fontSize: '11px',
    p: '8px',
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;


    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <CashTab value={value}/>
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

export default function CashTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant='fullWidth'>
                    <Tab label="Денежный ящик(банкноты)" {...a11yProps(0)} sx={tabStyle}/>
                    <Tab label="Сдача (банкноты)" {...a11yProps(1)} sx={tabStyle}/>
                    <Tab label="Денежный ящик (монеты)" {...a11yProps(2)} sx={tabStyle}/>
                    <Tab label="Сдача (монеты)" {...a11yProps(3)} sx={tabStyle}/>
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                Item One
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
            </TabPanel>
            <TabPanel value={value} index={3}>
                Item Four
            </TabPanel>
        </Box>
    );
}
