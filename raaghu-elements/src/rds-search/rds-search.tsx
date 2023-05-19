import React from "react";
import RdsIcon from "../rds-icon";

import "./rds-search.css";

export interface RdsSearchProps {
	placeholder: string;
	size: string;
  iconside?:"left"|"right" ,
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
  onSearchClick?: () => void;
}

const RdsSearch = (props: RdsSearchProps) => {
  //searchBar__left
    let iconside=props.iconside ||"right"
    let searchBarClass = `input-group mb-3 ${props.size=="small"?"input-group-sm": props.size=="large"?"input-group-lg":""}`
    let ariaDescribedby = props.size == "small"? "inputGroup-sizing-sm" : props.size =="large" ?"inputGroup-sizing-lg" :"inputGroup-sizing-default"
    let spanClass = `input-group-text ${iconside =="left"?" iconButton__left ":" iconButton__right "} ${props.size=="medium"?"searchIconMed": props.size=="large"?"searchIconLarge":""}`;
    

  return (
    <div className={searchBarClass}>
   {iconside =="left" ?
   <>
        <span className={spanClass} id={ariaDescribedby} onClick={props.onSearchClick} data-testId="search-icon" >
          <RdsIcon name="search" fill={false}  stroke={true} height='17px' width="17px" ></RdsIcon>
        </span>
     
      <input
        type="text"
        className="form-control search__input__right"
        placeholder={props.placeholder}
        aria-label="Recipient's username"
        aria-describedby={ariaDescribedby}
        defaultValue={props.value}
        onChange={props.onChange}
        onKeyDown={props.onKeyPress}
      />
       </>
     :
      <>
        <input
        type="text"
        className="form-control search__input__left"
        placeholder={props.placeholder}
        aria-label="Recipient's username"
        aria-describedby={ariaDescribedby}
        defaultValue=""
        onChange={props.onChange}
        onKeyDown={props.onKeyPress}
      />
       <span className={spanClass} id={ariaDescribedby} onClick={props.onSearchClick} data-testId="search-icon">
       <RdsIcon name="search" fill={false}  stroke={true} height='17px' width="17px" ></RdsIcon>
        </span>
     
    
    </>}
    </div>
  );
};

export default RdsSearch;
