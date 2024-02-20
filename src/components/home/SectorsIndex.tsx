import {useEffect, useRef, useState} from "react";
import {onValue, ref,remove} from "firebase/database";
import {db,authConfig} from "../../firebase/config.ts";
import IndexPlaceHolder from "../placeholder/IndexPlaceHolder.tsx";
import {Link} from "react-router-dom";
import {
    Alert, Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField
} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const SectorsIndex = ({sectors}:{sectors:object|null}) => {
    // const [sectors,setSectors]=useState <object|null>(null);
    const [loading,setLoading]=useState(true);
    const [message,setMessage]=useState({type:"error",message:''});
    const [item,setItem]=useState<string|null>(null)

    useEffect(()=>{
        if(sectors==null){
            setLoading(true);
        }else{
            setLoading(false);
        }
    },[sectors])

    const DeleteWithConfirm=({item}:{item:string|null})=>{
        const confirm=useRef <string|null>();
        const message='i am agree';
        return (
            <>
                <Dialog open={item!=null} onClose={()=>setItem(null)}>
                    <DialogTitle>বিপদজনক ডিলিট অপারেশন</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            এই খাতটি ডিলিট করার মাধ্যমে আপনি এই খাত সম্পর্কিত সমস্ত হিসেব ডিলিট করতে রাজি হচ্ছেন। আপনি যদি নিশ্চিত হন তবে নিচের বক্সে {message} লিখুন।
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="আপনি কি নিশ্চিত?"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e)=>{confirm.current=e.target.value}}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>setItem(null)}>Cancel</Button>
                        <Button className={'!text-red-500'} onClick={()=>{
                            if(confirm.current==message) {
                                remove(ref(db, authConfig.sectorRoot + item)).then(() => {
                                    setItem(null);
                                    setMessage({type: 'success', message: "খাতটি ডিলিট করে দেয়া হয়েছে।"});
                                });
                            }
                        }}>Delete</Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }

    return (
        <>
            {
                message&&message.message!=''&&<Alert severity={message.type}>{message.message}</Alert>
            }
            {sectors&&
                <div className={'grid grid-cols-2 md:grid-cols-4 gap-2'}>
                    {
                        Object.keys(sectors).map((item:string,idx:number)=> {
                            const sector = sectors[item];
                            return (
                                <div key={idx} className={'relative'}>
                                    <Link to={"/sector-details/"+item}>
                                        <div className={'bg-[url(/src/assets/sector-bg.png)] bg-contain bg-no-repeat min-h-[100px] border rounded p-2 flex justify-center items-center transition cursor-pointer text-gray-800 text-md font-bold relative'}>
                                            <div className={'z-10 capitalize'}>
                                                {sector.name}
                                            </div>
                                            <div className={'backdrop-blur-[2px] absolute w-full h-full'}></div>
                                        </div>
                                    </Link>
                                    <IconButton className={'!absolute !right-0 !bottom-0 !bg-white w-[35px] h-[35px] !text-orange-500'} onClick={(e)=>{e.stopPropagation();setItem(item)}}>
                                        <FontAwesomeIcon icon={'trash'}/>
                                    </IconButton>
                                </div>
                            )
                        })

                    }
                </div>
            }




            <DeleteWithConfirm item={item}/>
            <IndexPlaceHolder show={loading}/>
        </>
    )
}

export default SectorsIndex;