import React from "react";
import "./rds-file-uploader.css";
import { useState, useEffect } from "react";
import RdsIcon from "../rds-icon/rds-icon";

export interface RdsFileUploaderProps {
  placeholder?: string;
  size: string;
  colorVariant?: string;
  multiple?: boolean;
  extensions: string;
  limit: number;
  label: string;
  onFileArray?: (files: any[]) => void;
  getFileUploaderInfo?: any;
  validation?: any[];
}

const fileholder: any = [];
const filenameholder: any = [];
const filesize: any = [];

const RdsFileUploader = (props: RdsFileUploaderProps) => {
  const [FileArray, setFileArray] = useState(fileholder);
  const [isExceed, setIsExceed] = useState(false);
  const [fileName, setfileName] = useState(filenameholder);
  const [FileSize, setFileSize] = useState(filesize);
  const [validation, setValidation] = useState(props.validation);
  //

  let size: "form-select-sm" | undefined = undefined;
  let SIZE: string;
  SIZE = " ";
  if (props.size == "small") {
    size = "form-select-sm";
    SIZE = "small";
  }
  const kbToMb = (kb: any) => {
    const mb = kb / 1024;
    return Math.round(mb * 100) / 100; // Round off to 2 decimal places
  };

  const fileSizeInMB = kbToMb(props.limit);

  const borderColor = "border-" + props.colorVariant || "primary";
  const onDelete = (id: any) => {
    let tempFN = fileName.filter((Fname: any, i: number) => i !== id);
    setfileName(tempFN);
    let tempFS = FileSize.filter((Fsize: any, i: number) => i !== id);
    setFileSize(tempFS);
    let tempFA = FileArray.filter((Farray: any, i: number) => i !== id);
    setFileArray(tempFA);
  };
  const [fileUploaderData, setFileUploaderData] = useState<any>([]);
  const onchangehandler = (event: any) => {
    const fileSize = event.target.files[0].size / 1024; //now size in kb

    if (fileSize > props?.limit) {
      const tempValid = validation?.map((ele: any, index: number) => {
        if (index == 0) {
          return { ...ele, isError: true };
        } else {
          return ele;
        }
      });
      setValidation(tempValid);
      setIsExceed(true);
    } else {
      const tempValid = validation?.map((ele: any, index: number) => {
        if (index == 0) {
          return { ...ele, isError: false };
        } else {
          return ele;
        }
      });
      setValidation(tempValid);
      setIsExceed(false);
    }
    setFileSize([...FileSize, event.target.files[0].size]);
    let files = event.target.files;

    setfileName([...fileName, event.target.files[0].name]);
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      setFileArray([...FileArray, event.target?.result]);
    };
    props.getFileUploaderInfo({
      ...fileUploaderData,
      files: event.target.files,
    });
    if (props.multiple) {
      event.target.value = null;
    }
  };

  useEffect(() => {
    props.onFileArray != undefined && props.onFileArray(FileArray);
  }, [FileArray]);

  return (
    <>
      {props.multiple === false ? (
        <div className="row p-2">
          <div className="">
            <div className="mb-2">
              <label className={`label  ${SIZE} `}>{props.label}</label>
            </div>
            <div>
              <form>
                <input
                  className={` input text-${
                    props.colorVariant
                  } form-control  ${size} `}
                  type="file"
                  name="file"
                  accept={props.extensions}
                  onChange={onchangehandler}
                />
                {validation &&
                  validation.map((val: any, index: number) => (
                    <div key={index}>
                      <small
                        className={`${
                          val.isError ? "showError" : "noError"
                        }`}
                      >
                        {val.hint}
                      </small>
                    </div>
                  ))}

                {/* {isExceed&& <div className="form-control-feedback">
                  <span className="text-danger">File size should not be greater than {fileSizeInMB} MB </span>
                </div>} */}
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="row p-2">
          <div className="pl-2">
            <div className="labelbox">
              <label className={`label  ${SIZE} `}>{props.label}</label>
              <label className={`label ${SIZE}`}>
                Maximum {fileSizeInMB} MB
              </label>
            </div>

            <div className={`row fullbox`}>
              <div className="col-6 leftinnerbox">
                <div className="row lefttext">
                  <h6
                    className={` ${SIZE} ${
                      props.colorVariant
                        ? ` text-${props.colorVariant}`
                        : `text-dark`
                    } `}
                  >
                    Drag and drop files
                  </h6>
                  <h6 className="text-muted">(All Files)</h6>
                </div>
                <div className="row lefttext">
                  <div className="format text-muted ">
                    {props.placeholder}
                    {props.extensions}
                  </div>
                </div>
              </div>
              <div className="col-6 rightbox ">
                <RdsIcon
                  name={"upload_data"}
                  height="16px"
                  width="16px"
                  stroke={true}
                  fill={false}
                />

                {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-upload upload "
                    viewBox="0 0 16 16"
                    
                  >
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                  </svg> */}
              </div>

              <div
                className=" row inputbox"
                data-testid="rds-file-uploader-input"
              >
                <input
                  className={` col-md-12 input mulinput   ${size} `}
                  type="file"
                  name="file"
                  accept={props.extensions}
                  onChange={onchangehandler}
                  multiple
                />
              </div>
            </div>

            {/* ------------------ Display names--------------------------- */}
          </div>
          {fileName.map((filename: string, i: number) => (
            <div>
              <div key={i} className="displayname col-md-12 namebox">
                <div className=" disbox col-lg-10 col-md-10 d-flex">
                  <div className="fileicon px-2">
                    <RdsIcon
                      name={"file"}
                      height="16px"
                      width="16px"
                      stroke={true}
                      fill={false}
                    />
                    {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-files"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z" />
                      </svg> */}
                  </div>
                  <div className="filename ">
                    <div
                      className={`${
                        fileName[i].length > 60
                          ? ` text-${props.colorVariant}`
                          : "disname"
                      }`}
                    >
                      {fileName[i].substr(0, 60)}...
                    </div>
                    <div
                      className={` ${SIZE} ${
                        fileName[i].length < 60
                          ? ` text-${props.colorVariant}`
                          : "disname"
                      }`}
                    >
                      {fileName[i]}
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-2 closeIcon">
                  <span
                    className={` size ${SIZE} ${
                      props.colorVariant
                        ? ` text-${props.colorVariant}`
                        : `text-dark`
                    } `}
                  >
                    {" "}
                    {(FileSize[i] / 1048576).toFixed(2)} MB{" "}
                  </span>
                  <span className="iconbox" onClick={() => onDelete(i)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-x cross "
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="row">
                <div
                  className={`col-md-6 ${SIZE} text-danger ${
                    props.limit > parseFloat((FileSize[i] / 1048576).toFixed(2))
                      ? "disname"
                      : ""
                  } 
                    }`}
                >
                  {/* File size exceed {props.limit} MB */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default RdsFileUploader;
