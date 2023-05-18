import React, { useEffect, useState } from "react";
// import axios from "axios";
import { RdsCompDatatable } from "../../../rds-components";
import {
  RdsAlert,
  RdsButton,
  RdsOffcanvas,
  RdsSelectList,
  RdsTextArea,
} from "../../../rds-elements";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../../libs/state-management/hooks";
import {
  fetchLanguagesText,
  fetchResources,
  putLanguages,
  restore,
} from "../../../../libs/state-management/public.api";
import { configurationService } from "raaghu-react-core";

export interface LanguageTextProps {
  languagetableHeaders: any;
  languagetableData: any;
  actions?: any;
  onActionSelection?(arg: any): void;
}

const tableHeaders = [
  {
    displayName: "Key",
    key: "key",
    datatype: "text",
    sortable: false,
  },
  {
    displayName: "Base Value",
    key: "basevalue",
    datatype: "text",
    sortable: false,
  },
  {
    displayName: "Value",
    key: "value",
    datatype: "text",
    sortable: false,
  },
  {
    displayName: "Resource Name",
    key: "resourcename",
    datatype: "text",
    sortable: false,
  },
];
const actions = [{ id: "edit", displayName: "Edit", offId: "lang-text-off" }];

const target = [
  {
    option: "All",
    id: "All",
  },
  {
    option: "Only Empty Values",
    id: "OnlyEmpty Values",
  },
];

const LanguageText = (props: LanguageTextProps) => {
  const data = useAppSelector((state) => state.persistedReducer.languagesText);
  const dispatch = useAppDispatch();
  const [name, setName] = useState<{ option: string; id: any }[]>([]);
  const [res, setRes] = useState<{ option: string; id: any }[]>([]);
  const [tableData, setTableData] = useState([]);
  const [Alert, setAlert] = useState({ show: false, message: "", color: "" });
  const [textEdit, setTextEdit] = useState({
    base: "",
    target: " ",
    key: "",
    resource: "",
  });

  const [displayList, setdisplayList] = useState({
    baseCulture: name.length > 0 ? name[1].option : "",
    targetCulture: name.length > 0 ? name[1].option : "",
    resourceName: res.length > 0 ? res[1].option : "",
    targetvalue: target[0].option,
  });

  const [codes, setCodes] = useState({
    baseCulture: "",
    targetCulture: "",
    resource: "",
  });
  let filter: string;
  useEffect(() => {
    dispatch(fetchResources() as any);
    let API_URL = "https://raaghu-react.azurewebsites.net";

    const lang = localStorage.getItem("currentLang") || "en-GB";
    configurationService(API_URL).then((result: any) => {
      const tempNames = result.localization.languages.map((item: any) => {
        return {
          option: item.displayName,
          id: item.cultureName,
        };
      });
      setdisplayList({
        ...displayList,
        baseCulture: tempNames.length > 0 ? tempNames[0].option : "",
        targetCulture: tempNames.length > 0 ? tempNames[1].option : "",
      });
      setCodes({
        ...codes,
        baseCulture: tempNames.length > 0 ? tempNames[0].id : "",
        targetCulture: tempNames.length > 0 ? tempNames[1].id : "",
      });
      setName(tempNames);
    });
  }, []);

  useEffect(() => {
    if (data.resources) {
      const tempres = data.resources.map((item: any) => {
        return {
          option: item.name,
        };
      });

      setRes(tempres);
    }
  }, [data.resources]);

  // useEffect(() => {
  //   if (codes.baseCulture != "") {
  //     const resourceName = displayList.resourceName;
  //     const baseCultureName = codes.baseCulture;
  //     const targetCultureName = codes.targetCulture;
  //     const getOnlyEmptyValues =
  //       displayList.targetvalue == "All" ? false : true;

  //     dispatch(
  //       fetchLanguagesText({
  //         resourceName,
  //         baseCultureName,
  //         targetCultureName,
  //         getOnlyEmptyValues,
  //       }) as any
  //     );
  //   }
  // }, [codes, displayList.resourceName, displayList.targetvalue]);

  useEffect(() => {
    if (data.languagesText?.items != null) {
      const temptableData = data.languagesText.items.map((item: any) => {
        return {
          key: item.name,
          basevalue: item.baseValue,
          value: item.value,
          resourcename: item.resourceName,
        };
      });
      setTableData(temptableData);
    }
  }, [data.languagesText]);

  const baseCultureHandler = (e: any) => {
    let baseCult = name.filter((res: any) => res.option == e);
    setdisplayList((prevState) => ({
      ...prevState,
      baseCulture: baseCult[0].id,
    }));
    setCodes({ ...codes, baseCulture: baseCult[0].id });
    // api call with new baseCulture

    const resourceName = displayList.resourceName;
    const baseCultureName = baseCult[0].id;
    const targetCultureName = codes.targetCulture;
    const getOnlyEmptyValues = displayList.targetvalue == "All" ? false : true;

    dispatch(
      fetchLanguagesText({
        resourceName,
        baseCultureName,
        targetCultureName,
        getOnlyEmptyValues,
      }) as any
    );
  };
  const targetCultureHandler = (e: any) => {
    let targetCult = name.filter((res: any) => res.option == e);

    setdisplayList((prevState) => ({
      ...prevState,
      targetCulture: targetCult[0].id,
    }));

    setCodes({ ...codes, targetCulture: targetCult[0].id });

    // api call with new targetCulture

    const resourceName = displayList.resourceName;
    const baseCultureName = codes.baseCulture;
    const targetCultureName = targetCult[0].id;
    const getOnlyEmptyValues = displayList.targetvalue == "All" ? false : true;

    dispatch(
      fetchLanguagesText({
        resourceName,
        baseCultureName,
        targetCultureName,
        getOnlyEmptyValues,
      }) as any
    );
  };
  const resourceNameHandler = (e: any) => {
    setdisplayList((prevState) => ({
      ...prevState,
      resourceName: e,
    }));
    // api call with new targetCulture

    const resourceName = e;
    const baseCultureName = codes.baseCulture;
    const targetCultureName = codes.targetCulture;
    const getOnlyEmptyValues = displayList.targetvalue == "All" ? false : true;

    dispatch(
      fetchLanguagesText({
        resourceName,
        baseCultureName,
        targetCultureName,
        getOnlyEmptyValues,
      }) as any
    );
  };
  const handlerTargetValue = (e: any) => {
    setdisplayList((prevState) => ({
      ...prevState,
      targetvalue: e,
    }));
    // api call with new targetCulture

    const resourceName = displayList.resourceName;
    const baseCultureName = codes.baseCulture;
    const targetCultureName = codes.targetCulture;
    const getOnlyEmptyValues = e == "All" ? false : true;

    dispatch(
      fetchLanguagesText({
        resourceName,
        baseCultureName,
        targetCultureName,
        getOnlyEmptyValues,
      }) as any
    );
  };

  const onActionSelection = (rowData: any, actionId: any) => {
    setTextEdit({
      ...textEdit,
      base: rowData.basevalue,
      target: rowData.value ? rowData.value : "",
      key: rowData.key,
      resource: rowData.resourcename,
    });
  };

  const onTextEdit = (e: any) => {
    setTextEdit({ ...textEdit, target: e.target.value });
  };

  const onRestore = () => {
    const resourceName = textEdit.resource;
    const cultureName = codes.targetCulture;
    const Name = textEdit.key;
    dispatch(restore({ resourceName, cultureName, Name }) as any).then(
      (res: any) => {
        setAlert({
          ...Alert,
          show: true,
          message: "Target language restored Succesfully",
          color: "success",
        });
        const resourceName = displayList.resourceName;
        const baseCultureName = codes.baseCulture;
        const targetCultureName = codes.targetCulture;
        const getOnlyEmptyValues =
          displayList.targetvalue == "All" ? false : true;

        dispatch(
          fetchLanguagesText({
            resourceName,
            baseCultureName,
            targetCultureName,
            getOnlyEmptyValues,
          }) as any
        );
      }
    );
  };

  useEffect(() => {
    // Set a 3-second timer to update the state
    const timer = setTimeout(() => {
      setAlert({ ...Alert, show: false });
    }, 3000);

    // Clean up the timer when the component unmounts or when the state changes
    return () => clearTimeout(timer);
  }, [tableData]);

  const SaveHandler = () => {
    const resourceName = textEdit.resource;
    const cultureName = codes.targetCulture;
    const Name = textEdit.key;
    const value = textEdit.target;
    dispatch(
      putLanguages({ resourceName, cultureName, Name, value }) as any
    ).then((res: any) => {
      setAlert({
        ...Alert,
        show: true,
        message: "Target language edited Succesfully",
        color: "success",
      });
      const resourceName = displayList.resourceName;
      const baseCultureName = codes.baseCulture;
      const targetCultureName = codes.targetCulture;
      const getOnlyEmptyValues =
        displayList.targetvalue == "All" ? false : true;

      dispatch(
        fetchLanguagesText({
          resourceName,
          baseCultureName,
          targetCultureName,
          getOnlyEmptyValues,
        }) as any
      );
    });
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="row ">
            <div className="col-md-4">
              {Alert.show && (
                <RdsAlert
                  alertmessage={Alert.message}
                  colorVariant={Alert.color}
                ></RdsAlert>
              )}
            </div>
          </div>
          <div className="card p-2 h-100 border-0 rounded-0 card-full-stretch">
            <div className="row mt-3">
              <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-12 mb-3">
                <label className="mb-1">Base Culture Name</label>
                <RdsSelectList
                  label={displayList.baseCulture}
                  selectItems={name}
                  onSelectListChange={baseCultureHandler}
                ></RdsSelectList>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-12 mb-3">
                <label className="mb-1">Target Culture Name</label>
                <RdsSelectList
                  label={displayList.targetCulture}
                  selectItems={name}
                  onSelectListChange={targetCultureHandler}
                ></RdsSelectList>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-12 mb-3">
                <label className="mb-1">Resource Name</label>
                <RdsSelectList
                  label={displayList.resourceName}
                  selectItems={res}
                  onSelectListChange={resourceNameHandler}
                ></RdsSelectList>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-12 mb-3">
                <label className="mb-1">Target Value</label>
                <RdsSelectList
                  label={displayList.targetvalue}
                  onSelectListChange={handlerTargetValue}
                  selectItems={target}
                ></RdsSelectList>
              </div>
            </div>
            <div className="p-2">
              <RdsCompDatatable
                actionPosition="right"
                classes="table__userTable"
                tableHeaders={tableHeaders}
                pagination={true}
                tableData={tableData}
                actions={actions}
                onActionSelection={onActionSelection}
                recordsPerPage={5}
                recordsPerPageSelectListOption={true}
              ></RdsCompDatatable>
            </div>
            <RdsOffcanvas
              placement={"end"}
              backDrop={true}
              scrolling={false}
              preventEscapeKey={false}
              offId={"lang-text-off"}
              canvasTitle={"Edit Language"}
            >
              <form>
                <div className="row">
                  <div>Key</div>
                  <h6>{textEdit.key}</h6>
                  <div className="col-md-12 mb-3">
                    <div className="form-group mt-3">
                      <RdsTextArea
                        placeholder=""
                        readonly={true}
                        label={"Base Value"}
                        rows={4}
                        value={textEdit.base}
                      ></RdsTextArea>
                    </div>
                  </div>
                  <div className="col-md-12 mb-3">
                    <div className="form-group mt-3">
                      <RdsTextArea
                        placeholder=""
                        readonly={false}
                        label={"Target Value"}
                        rows={4}
                        value={textEdit.target}
                        onChange={onTextEdit}
                      ></RdsTextArea>
                    </div>
                  </div>
                </div>
              </form>

              <div className="footer-buttons my-2">
                <div className="row">
                  <div className="col-md-8 d-flex">
                    <div>
                      <RdsButton
                        label="Cancel"
                        type="button"
                        colorVariant="primary"
                        size="small"
                        databsdismiss="offcanvas"
                        isOutline={true}
                      ></RdsButton>
                    </div>
                    <div>
                      <RdsButton
                        label="Save"
                        type="button"
                        size="small"
                        class="ms-2"
                        colorVariant="primary"
                        databsdismiss="offcanvas"
                        onClick={SaveHandler}
                        showLoadingSpinner={true}
                      ></RdsButton>
                    </div>
                  </div>
                  <div
                    className="col-md-4"
                    onClick={onRestore}
                    data-bs-dismiss={"offcanvas"}
                  >
                    <h6 className="text-primary my-0 pt-2 cursor-pointer">
                      Restore to default
                    </h6>
                  </div>
                </div>
              </div>
            </RdsOffcanvas>
          </div>
        </div>
      </div>
    </>
  );
};

export default LanguageText;
