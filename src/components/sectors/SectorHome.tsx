import InsertionInterface from "./InsertionInterface.tsx";
import {useParams} from "react-router-dom";
import DebitAndCreditViewer from "./DebitAndCreditViewer.tsx";
import {useState} from "react";
import HomeNav from "../home/HomeNav.tsx";

const SectorHome = () => {
    const { sector_key } = useParams();
    if(sector_key==undefined) return null;
    const [refreshToggler,toggleRefresh]=useState(false);
    return (
        <>
            <InsertionInterface sector_key={sector_key} onInsert={()=>toggleRefresh(prevState => !prevState)}/>
            <DebitAndCreditViewer onUpdate={()=>{
                toggleRefresh(prevState => !prevState)
            }} sector_id={sector_key} refreshToggler={refreshToggler}/>
            <HomeNav/>
        </>
    )
}

export default SectorHome;