import {Box, Tab} from "@mui/material";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import React, {useState} from "react";
import SectorHome from "./SectorHome.tsx";
import SingleReport from "../reports/SingleReport.tsx";
import {useParams} from "react-router-dom";
import IndexPlaceHolder from "../placeholder/IndexPlaceHolder.tsx";

const ShowSectors = () => {
    const [openTab,setOpenTab]=useState("1");
    const {sector_key}=useParams();
    return (
        <>
            <TabContext value={openTab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className={'!w-full'}>
                    <TabList onChange={(e,idx)=>setOpenTab(idx)} aria-label="lab API tabs example" variant={"scrollable"}>
                        <Tab label="নতুন হিসাব যুক্ত করুন" value="1" />
                        <Tab label="আজকের আয়-ব্যয়ের রিপোর্ট" value="2" />
                        <Tab label="মাসিক আয়-ব্যয়ের রিপোর্ট" value="3" />
                        <Tab label="নির্দিষ্ট সময় এর আয়-ব্যয়ের রিপোর্ট" value="4" />
                    </TabList>
                </Box>
                <div>
                    <TabPanel className={'!w-full'} value="1">
                        <SectorHome/>
                    </TabPanel>
                    <TabPanel className={'!w-full'} value="2">
                        {sector_key&&<SingleReport sector_key={sector_key} report_type={"today"}/>}
                        {!sector_key&&<IndexPlaceHolder show={!sector_key}/>}
                    </TabPanel>
                    <TabPanel className={'!w-full'} value="3">
                        {sector_key&&<SingleReport sector_key={sector_key} report_type={"monthly"}/>}
                        {!sector_key&&<IndexPlaceHolder show={!sector_key}/>}
                    </TabPanel>
                    <TabPanel className={'!w-full'} value="4">
                        {sector_key&&<SingleReport sector_key={sector_key} report_type={"range"}/>}
                        {!sector_key&&<IndexPlaceHolder show={!sector_key}/>}
                    </TabPanel>
                </div>
            </TabContext>
        </>
    )
}

export default ShowSectors;