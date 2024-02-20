import {Alert, Button, FormControl, Input, InputLabel, MenuItem, TextareaAutosize, TextField} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {push, ref, remove, set, update} from "firebase/database";
import { db ,authConfig} from "../../firebase/config.ts";

const InsertionInterface = ({sector_key,onInsert,edit}:{sector_key:string,onInsert:()=>void,edit?:{type:string,key:string,data:object}}) => {
    const getFormattedDate=(timeStamp:number|null=null)=>{
        const now = timeStamp?new Date(timeStamp):new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(now.getTime() - offset);
        return adjustedDate.toISOString().substring(0,16);
    }


    const [date,setDate] = useState(getFormattedDate());
    const [amount,setAmount] = useState("");
    const [type,setType] = useState("");
    const [description,setDescription] = useState("");

    const [alert, setAlert] = useState({ type: 'error', 'message': '' })
    const [allowSave,setAllowSave]=useState(false);

    useEffect(()=>{
        if (edit!=null){
            if(!(edit.type&&edit.key)){
                setAlert({type:'error',message:'এডিট করতে হলে আপনাকে ধরন এবং ইউনিক কি দুইটিই দিতে হবে।'});
                setAllowSave(false);
            }else{
                setType(edit.type);
                setAmount(edit.data.amount)
                setDate(getFormattedDate(edit.data.date))
                setType(edit.type);
                setDescription(edit.data.description);
                setAllowSave(true);
            }
        }else{
            setAllowSave(true);
        }
    },[]);
    const save = () => {
        if (date === '' || amount === '' || type === '') {
            setAlert({ type: 'error', 'message': "সবগুলো ফর্ম পূরণ করা বাধ্যতামূলক" });
            return;
        }
        setAlert({ type: 'error', 'message': "" });
        const iDateTime = new Date(date);
        if(allowSave){
            const insertData={
                date: iDateTime.getTime(),
                amount: amount,
                description:description
            };
            if(edit?.key&&edit?.type){
                update(ref(db,authConfig.sectorRoot+sector_key+"/"+type+"/"+edit.key),insertData).then(()=>{
                    setAlert({type: 'success',message: 'হিসাব পরিবর্তন করা হয়েছে।'});
                    if(type!=edit.type){
                        remove(ref(db,authConfig.sectorRoot+sector_key+"/"+edit.type+"/"+edit.key)).then(()=>{
                            setAlert({type: 'success',message: 'হিসাব এবং হিসাবের ধরন পরিবর্তন করা হয়েছে।'});
                            onInsert();
                        });
                    }
                    onInsert();
                });
            }else{
                push(ref(db, authConfig.sectorRoot + sector_key + "/" + type), insertData).then(()=>{
                    setAlert({type: 'success',message: 'হিসাব সেভ করা হয়েছে।'});
                    clear();
                    onInsert();
                });
            }
        }
    }

    const clear = ()=>{
        setAmount("");
        setDate("");
        if(edit==null) setType("");
        setDescription("");
    }

    return (
        <>
            {alert && alert.message !== '' &&
                <Alert className={'mb-2'} severity={alert.type}>{alert.message}</Alert>
            }
            <div className={'flex flex-col'}>
                <TextField value={amount} type={'number'} onChange={(e) => {
                    setAmount(e.target.value)
                }} label={"টাকার পরিমান"} />
                <TextField disabled={edit!=null} value={type} onChange={(e) => setType(e.target.value)} select label={"হিসাবের ধরন"} className={'!mt-3'}>
                    <MenuItem value={'debit'}>জমা</MenuItem>
                    <MenuItem value={'credit'}>খরচ</MenuItem>
                </TextField>
                <TextField label={"টাকার জমা/ব্যয়ের তারিখ"} className={'!mt-3'} onChange={(e) => setDate(e.target.value)} value={date} id="date" type='datetime-local' />
                <TextField value={description} onChange={(e)=>setDescription(e.target.value)} multiline label={'বিস্তারিত'} className={'!mt-3 !h-[200px]]'} rows={5}/>
                <div className={'w-full flex justify-center items-center'}>
                    <Button disabled={!allowSave} onClick={save} variant={'contained'} className={'!mt-3'} startIcon={<FontAwesomeIcon icon={'save'} />}>Save</Button>
                    <Button onClick={clear} variant={'contained'} className={'!mt-3 !bg-red-500 !mx-2'} startIcon={<FontAwesomeIcon icon={'times'} />}>Clear</Button>
                </div>
            </div>
        </>
    );
}

export default InsertionInterface;
