import {get, query, ref, orderByChild, limitToLast, remove} from "firebase/database";
import {ReactNode, useEffect, useState} from "react";
import {db,authConfig} from "../../firebase/config.ts";
import IndexPlaceHolder from "../placeholder/IndexPlaceHolder.tsx";
import {Button, Card, CardActions, CardContent, IconButton, Modal, Typography} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import InsertionInterface from "./InsertionInterface.tsx";



const DebitAndCreditViewer = ({sector_id,refreshToggler,onUpdate}:{sector_id:string|undefined,refreshToggler:boolean,onUpdate?:()=>void}) => {
    const [allLog,setLog]=useState <object[]>([]);
    const [loading,setLoading]=useState(true);
    const [reload,setReload]=useState(false);
    const getData=(ref,onLoad)=>{
        get(ref).then(snapshop=>{
            onLoad(snapshop);
        });
    }

    const getItems=async ()=>{
        let cDbRef=query(ref(db,authConfig.sectorRoot+sector_id+'/credit'),limitToLast(20));
        let dDbRef=query(ref(db,authConfig.sectorRoot+sector_id+'/debit'),limitToLast(20));
        const snapshots=await Promise.all([
            get(cDbRef),
            get(dDbRef)
        ]);
        let collect=[];
        snapshots.forEach((snapshot,i)=>{
            const type=i==0?'credit':'debit';
            const val=snapshot.val();
            val&&Object.keys(val)?.forEach(key=>{
                collect.push({
                    type:type,
                    key:key,
                    data:val[key]
                });
            });
        });
        collect.sort((a,b)=>{
            return b.data.date-a.data.date;
        });
        collect=collect.filter((item,idx)=>{
            return idx<=20;
        })
        setLog(collect);
        setLoading(false);
    }

    useEffect(()=>{
        setLoading(prev=>true);

        let dbRef=ref(db,authConfig.sectorRoot+sector_id);
        getItems();

    },[refreshToggler,reload]);

    const deleteItem = (item) => {
        if(!sector_id||!item.type) return;
        const dbRef=ref(db,authConfig.sectorRoot+sector_id+'/'+item.type+"/"+item.key);
        remove(dbRef).then(()=>{
            setReload(prevState => !prevState);
        })
    }

    const [editing,setEditing]=useState<object|null>(null);

    return (
        <>
            {!loading&&
                <div className={'grid grid-cols-2 md:grid-cols-4 gap-4 rounded mt-4'}>
                    {
                        allLog.map((item,idx)=>{
                            return (
                                <Card key={idx} className={'!relative !text-gray-800 !border shadow '+(item.type=='credit'?'!border-red-500 !bg-yellow-100':'!border-blue-500 !bg-green-100')}>
                                    <CardContent>
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            {item.type=='credit'?'খরচ':'জমা'}
                                        </Typography>
                                        <Typography variant="h5" component="div">
                                            {item.data?.amount??'ফাকা'} টাকা
                                        </Typography>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                            {new Date(item.data?.date).toDateString()} {new Date(item.data?.date).toLocaleTimeString()}
                                        </Typography>
                                        <Typography variant="body2">
                                            {item.data?.description??'ফাকা'}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton onClick={()=>setEditing(item)} className={'!absolute !right-14 !bottom-2'}><FontAwesomeIcon icon={'pencil'}/></IconButton>
                                        <IconButton onClick={()=>deleteItem(item)} className={'!absolute !right-2 !bottom-2'}><FontAwesomeIcon icon={'trash'}/></IconButton>
                                    </CardActions>
                                </Card>
                            )
                        })
                    }
                </div>
            }

            <Modal className={'flex justify-center items-center'} open={editing!=null} onClose={()=>setEditing(null)}>
                <div className={'p-2 !py-4 rounded bg-white w-[98%] md:w-[50%]'}>
                    <InsertionInterface edit={editing} sector_key={sector_id} onInsert={onUpdate}/>
                </div>
            </Modal>

            <IndexPlaceHolder show={loading}/>
        </>
    )
}

export default DebitAndCreditViewer;