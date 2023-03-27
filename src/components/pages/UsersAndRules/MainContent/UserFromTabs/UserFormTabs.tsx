import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
// @ts-ignore
import UserForm from './UserForm/UserForm';
// @ts-ignore
import Parkings from './Parkings/Parkings';

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
                children
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
export default function UserFormTabs({currentItem, setCurrentItem}) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant='fullWidth'>
                    <Tab label="Основные настройки" {...a11yProps(0)} sx={tabStyle}/>
                    {currentItem.id !== 'new_user' &&
                        <Tab label="Доступные парковки" {...a11yProps(1)} sx={tabStyle}/>
                    }
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <UserForm currentItem={currentItem} setCurrentItem={setCurrentItem}/>
            </TabPanel>
            {currentItem.id !== 'new_user' &&
                <TabPanel value={value} index={1}>
                    <Parkings currentItem={currentItem}/>
                </TabPanel>
            }
        </Box>
    );
}
