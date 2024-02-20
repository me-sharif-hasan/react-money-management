import React, {useEffect, useMemo, useState} from "react";
import IndexPlaceHolder from "../placeholder/IndexPlaceHolder.tsx";
import {set,get,child,push,ref,onValue} from "firebase/database"
import { authConfig, db} from "../../firebase/config.ts"
import {Alert, Box, Button, Fab, MenuItem, Modal, Select, Tab, TextField, Typography} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SectorsIndex from "./SectorsIndex.tsx";
import BatchReport from "../reports/BatchReport.tsx";
import firebase from "firebase/compat";
import {Link, useNavigate} from "react-router-dom";
import HomeNav from "./HomeNav.tsx";

const Home = () => {
    const [openTab,setOpenTab]=useState("1");
    const [showSectorCreationModal,setShowSectorCreationModal]=useState(false);

    const MakeSector = ({open,onClose}:{open:boolean,onClose:()=>void}) => {
        const style = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius:3
        };

        const [sectorName,setSectorName]=useState("");
        const [error,setError]=useState("");
        const save = () => {
            if(!sectorName||sectorName==""){
                setError("খাতের নাম ফাকা থাকতে পারবে না");
                return;
            }
            const name=sectorName.toLowerCase();
            const insert = (name:string) => {
                push(ref(db,authConfig.sectorRoot),{
                    name: name,
                }).then(()=>{
                    onClose();
                }).catch(()=>{
                    setError("ডেটা সেভ করা যায়নি। আবার চেস্টা করুন");
                });
            }
            //check if name already exists as sectors
            get(child(ref(db),authConfig.sectorRoot)).then(snapshot=>{
                let okay=true;
                console.log(snapshot.val(),"OKK")
                if(snapshot.val()==null){
                     set(ref(db,authConfig.sectorRoot),{});
                }else{
                    Object.keys(snapshot.val()).forEach(item=>{
                        if(snapshot.val()[item]?.name==name){
                            okay=false;
                            return;
                        }
                    });
                }

                if(!okay){
                    setError("এই খাতটি ইতোমধ্যে ডাটাবেজে রয়েছে");
                }else{
                    insert(name);
                }
            }).catch(()=>{
                setError("বিপজ্জনক এন্ট্রি। কেন্সেল করা হলো।");
            });
        }

        return (
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        নতুন আয়-ব্যয়ের খাত যুক্ত করুন
                    </Typography>
                    {   error&&error!=''&&
                        <Alert className={'!my-2'} severity={'error'}>{error}</Alert>
                    }
                    <div>
                        <TextField onChange={(e)=>setSectorName(e.target.value)} variant={'outlined'} className={'w-full !mt-2'} label={'সেক্টরের নাম'}></TextField>
                    </div>
                    <div className={'w-full py-2'}>
                        <Button onClick={save} variant={'contained'} startIcon={<FontAwesomeIcon icon={'save'}/>}>Save</Button>
                    </div>
                </Box>
            </Modal>
        )
    }

    const [sectors,setSectors]=useState <object|null>(null);
    const [loading,setLoading]=useState(true);
    const [message,setMessage]=useState({type:"error",message:''});
    const [item,setItem]=useState<string|null>(null)
    useEffect(()=>{
        console.log(authConfig.sectorRoot);
        onValue(ref(db,authConfig.sectorRoot),snapshot => {
            setLoading(false);
            setSectors(snapshot.val());
        });
    },[]);

    return (
        <>
            <TabContext value={openTab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className={'!w-full'}>
                    <TabList onChange={(e,idx)=>setOpenTab(idx)} aria-label="lab API tabs example" variant={"scrollable"}>
                        <Tab label="খাতসমুহ" value="1" />
                        <Tab label="আজকের আয়-ব্যয়ের রিপোর্ট" value="2" />
                        <Tab label="মাসিক আয়-ব্যয়ের রিপোর্ট" value="3" />
                        <Tab label="নির্দিষ্ট সময় এর আয়-ব্যয়ের রিপোর্ট" value="4" />
                    </TabList>
                </Box>
                <div>
                    <TabPanel className={'!w-full'} value="1">
                        <SectorsIndex sectors={sectors}/>
                    </TabPanel>
                    <TabPanel className={'!w-full'} value="2">
                        <BatchReport report_type={"today"} sectors={sectors??{}}/>
                    </TabPanel>
                    <TabPanel className={'!w-full'} value="3">
                        <BatchReport report_type={"monthly"} sectors={sectors??{}}/>
                    </TabPanel>
                    <TabPanel className={'!w-full'} value="4">
                        <BatchReport report_type={"range"} sectors={sectors??{}}/>
                    </TabPanel>
                </div>
            </TabContext>


            <MakeSector open={showSectorCreationModal} onClose={()=>{setShowSectorCreationModal(false)}}/>
            <a href={"/"}>
                <Fab className={'!fixed !right-20 !bottom-2 !bg-red-500 !text-white'}>
                <FontAwesomeIcon icon={"refresh"}/>
                </Fab>
            </a>
            <Fab className={'!fixed !right-2 !bottom-2 !bg-red-500 !text-white'} onClick={()=>setShowSectorCreationModal(true)}>
                <FontAwesomeIcon icon={"plus"}/>
            </Fab>
        </>
    )
}
export default Home;