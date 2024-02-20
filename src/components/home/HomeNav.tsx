import {useNavigate} from "react-router-dom";
import {Fab} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
interface props{
  className?:string
};
const HomeNav = ({className}:props) => {
    const navigate=useNavigate();
        return (
            <>
                <Fab className={'!fixed !right-2 !bottom-2 !bg-red-500 !text-white '+className} onClick={()=> {
                    navigate("/");
                }}>
                    <FontAwesomeIcon icon={"home"}/>
                </Fab>
            </>
        )
}
export default HomeNav;