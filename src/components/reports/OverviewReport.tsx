import {useEffect, useState} from "react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {Box, Modal, TextField} from "@mui/material";

import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';
import {getTime} from "../../firebase/config.ts"; // theme css file
interface ItemType{
  data:[{
      type:"debit"|"credit",
      data:{
          amount:number
      },
  }],
    className:string,
    startDate?:Date,
    endDate?:Date,
    setStartDate?:(Date)=>void,
    setEndDate?:(Date)=>void,
    rangePickle?:boolean
}
const OverviewReport = ({data,className,startDate,endDate,setStartDate,setEndDate,rangePickle=false}:ItemType) => {
    const [totalDebit,setTotalDebit]=useState(0);
    const [totalCredit,setTotalCredit]=useState(0);

    useEffect(()=>{
        let debit=0;
        let credit=0;
        data.forEach((item)=>{
            if(item.type=="debit"){
               debit+=Number(item.data.amount);
            }else if (item.type=='credit'){
                credit+=Number(item.data.amount);
            }
        });
        setTotalDebit(debit);
        setTotalCredit(credit);
    },[data])

    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    ]);

    return (
        <>
        <div className={"flex md:flex-row flex-col justify-center items-center "+className}>
            <div className={"flex flex-col md:w-40 w-full border bg-white px-2 py-3 rounded"}>
                <div className={"text-gray-700 font-extrabold text-lg"}>মোট আয়</div>
                <div>{totalDebit} টাকা</div>
            </div>
            <div className={"flex flex-col md:w-40 w-full border bg-white px-2 py-3 rounded mx-2"}>
                <div className={"text-gray-700 font-extrabold text-lg"}>মোট ব্যয়</div>
                <div>{totalCredit} টাকা</div>
            </div>
            <div className={"flex flex-col md:w-40 w-full border bg-white px-2 py-3 rounded"}>
                <div className={"text-gray-700 font-extrabold text-lg"}>{totalDebit-totalCredit>0?"রইলো":"বাকি"}</div>
                <div>{totalDebit-totalCredit} টাকা</div>
            </div>
            {startDate&&<TextField className={"!mx-2"} disabled={!rangePickle} onChange={(val)=>{
                const date=new Date(Date.parse(val.target.value));
                if (setStartDate&&rangePickle) {
                    date.setHours(0,0,0);
                    setStartDate(date);
                }
            }} type={"date"} value={getTime(startDate)}/>}
            {endDate&&<TextField disabled={!rangePickle}
                onChange={(val)=>{
                    const date=new Date(Date.parse(val.target.value));
                    if (setEndDate&&rangePickle) {
                        date.setHours(23,59,59);
                        setEndDate(date);
                    }
                }}
                type={"date"} value={getTime(endDate)}/>}
        </div>
        </>
    )
}
export default OverviewReport;