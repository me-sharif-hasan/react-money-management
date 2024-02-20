import IndexPlaceHolder from "../placeholder/IndexPlaceHolder.tsx";
import {useEffect, useState} from "react";
import {get, orderByChild, query, ref,startAt,endAt} from "firebase/database";
import {db,authConfig} from "../../firebase/config.ts";
import DataTable from 'react-data-table-component';
import {Typography} from "@mui/material";
import {BarChart, LineChart} from "@mui/x-charts";
import OverviewReport from "./OverviewReport.tsx";

interface BathType{
    report_type:"monthly"|"today"|"range",
    sectors:object
}
const BatchReport = ({sectors,report_type}:BathType) => {
    const [startDate,setStartDate]=useState(new Date(Date.parse("Dec 31 2022")));
    const [endDate,setEndDate]=useState(new Date(Date.now()));
    const [type,setType]=useState(['credit','debit']);
    const [data,setData]=useState([]);

    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const sd=new Date();
        if(report_type=='today'){
            sd.setHours(0,0,0,0);
            setStartDate(new Date(sd.getTime()));
            sd.setHours(23,59,59,999);
            setEndDate(new Date(sd.getTime()));
            console.log(startDate.toString(),endDate.toString())
        }else if (report_type=='monthly'){
            sd.setHours(0,0,0,0);
            setStartDate(new Date(sd.getFullYear(), sd.getMonth(), 1,0,0,0,0));
            sd.setHours(23,59,59,999);
            setEndDate(new Date(sd.getFullYear(), sd.getMonth()+1, 0,23,59,59,999));
            console.log(startDate.toString(),endDate.toString())
        }
    },[]);

    useEffect(()=>{
        setLoading(true);
        (async ()=>{
            const refs=[];
            const types:object={};
            const sector_idx={};
            let cnt=0;
            Object.keys(sectors).forEach(sector_key=>{
                type.forEach((t)=>{
                    const r=query(ref(db,authConfig.sectorRoot+sector_key+"/"+t),orderByChild('date'));
                    const r2=query(r,startAt(startDate.getTime(),'date'),endAt(endDate.getTime(),'date'));
                    sector_idx[refs.length]=sector_key;
                    refs.push(get(r2));
                    types[cnt++]=t;
                });
            });
            const items = [];
            const promises = await Promise.all(refs);
            promises.forEach((snapshot,i)=>{
                const type=types[i];
                if(snapshot.val())
                    Object.keys(snapshot.val()).forEach(key=>{
                        items.push({type:type,sector_key:sector_idx[i],key:key,data:snapshot.val()[key]});
                    });
            });
            setLoading(false);
            setData(items);
        })();
    },[startDate,endDate,type]);

    const [barChartLabel,setBarChartLabel]=useState([]);
    const [barChartValues,setBarChartValues]=useState([]);

    useEffect(()=>{
        console.table(data);
        const hours= {};
        data.forEach((item)=>{
            const h=new Date(item.data.date).toLocaleTimeString();
            if(!hours[h]){
                hours[h]={};
            }
            hours[h][item.type]=(hours[h][item.type]??0)+Number(item.data.amount);
        });
        setBarChartLabel(Object.keys(hours));
        const item=[];
        let sm=0;
        Object.keys(hours).forEach(key=>{
            sm+=(hours[key].debit??0)-(hours[key].credit??0);
            item.push(sm);
        });
        console.log(item)
        setBarChartValues(item);
    },[data]);

    useEffect(()=>{
        console.log(barChartLabel,barChartValues)
    },[barChartLabel,barChartValues])

    const columns=[
        {
            name: 'ধরন',
            selector: row => row.type=='debit'?'আয়':'বায়',
            sortable: true,
            width: "70px"
        },
        {
            name: 'খাত',
            selector: row => sectors[row.sector_key].name,
            sortable: true,
            width: "200px"
        },
        {
            name: 'তারিখ',
            selector: row => (()=>{
                const date=new Date(row.data.date);
                return <Typography>{row.data.date ?
                    <>
                        <span>{date.toDateString()}</span>
                        <br/><span>{date.toLocaleTimeString()}</span>
                    </>
                    :
                    "দেয়া নেই"
                }</Typography>;
            })(),
            sortable: true,
            width: "180px"
        },
        {
            name: 'টাকার পরিমান',
            selector: row => row.data.amount,
            sortable: true,
            width: "130px"
        },
    ];

    const conditionalRowStyles = [
        {
            when: row => row.type == 'credit',
            style: {
                backgroundColor: '#ff8586',
            },
        },
        {
            when: row => row.type == 'debit',
            style: {
                backgroundColor: '#eeeeee',
            },
        },
    ];

    const Expended = ({data}) => {
        return (
            <>
                {data?.data?.description}
            </>
        )
    }



    return (
        <>
            <OverviewReport rangePickle={report_type=='range'} setStartDate={setStartDate} setEndDate={setEndDate} startDate={startDate} endDate={endDate} className={"w-full bg-gray-100 shadow p-2"} data={data}/>
            <div className="flex flex-col-reverse md:flex-row">
                <DataTable className={'!w-full md:!w-[50%]'} expandableRows expandableRowsComponent={Expended}
                           columns={columns}
                           data={data}
                           conditionalRowStyles={conditionalRowStyles}
                />
                <div className={'w-full md:!w-[50%] px-5 flex justify-center items-center'}>
                    <LineChart
                        xAxis={[{ scaleType: 'point', data: barChartLabel }]}
                        series={[
                            {
                                data: barChartValues,
                            },
                        ]}
                        width={500}
                        height={500}
                    />
                </div>
            </div>

            <IndexPlaceHolder show={loading}/>
        </>
    )
}
export default BatchReport