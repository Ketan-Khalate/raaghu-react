import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { filter as _filter, forEach as _forEach } from "lodash-es";

import {
  RdsCompAlertPopup,
  RdsCompDatatable,
  RdsCompPermissionTree,
  RdsCompUserBasics,
  RdsCompUserRoles,
} from "../../../rds-components";
import {
  RdsBadge,
  RdsButton,
  RdsInput,
  RdsNavtabs,
  RdsOffcanvas,
} from "../../../rds-elements";
import {
  useAppSelector,
  useAppDispatch,
} from "../../../../libs/state-management/hooks";

import {
  createUser,
  deleteUser,
  fetchEditUser,
  fetchOrganizationUnits,
  fetchRoles,
  fetchUsers,
  getPermission,
  updatePermission,
} from "../../../../libs/state-management/user/user-slice";

const Users = () => {
  const tempRolesData = [
    { isChecked: false, name: "select all" },
    { isChecked: false, name: "Admin" },
    { isChecked: false, name: "User" },
    { isChecked: false, name: "Tenant" },
  ];

  function createTree(
    array: any[],
    parentIdProperty: any,
    idProperty: any,
    parentIdValue: any,
    childrenProperty: string,
    fieldMappings: any,
    level: any
  ): any {
    let tree: any[] = [];
    
    let nodes = _filter(array, [parentIdProperty, parentIdValue]);

    _forEach(nodes, (node) => {
      let newNode: any = {
        data: node,
        level: level,
        selected: false,
      };

      mapFields(node, newNode, fieldMappings);

      newNode[childrenProperty] = createTree(
        array,
        parentIdProperty,
        idProperty,
        node[idProperty],
        childrenProperty,
        fieldMappings,
        level + 1
      );

      tree.push(newNode);
    });

    return tree;
  }

  function mapFields(node: any, newNode: any, fieldMappings: any): void {
    _forEach(fieldMappings, (fieldMapping: any) => {
      if (!fieldMapping["target"]) {
        return;
      }

      if (fieldMapping.hasOwnProperty("value")) {
        newNode[fieldMapping["target"]] = fieldMapping["value"];
      } else if (fieldMapping["source"]) {
        newNode[fieldMapping["target"]] = node[fieldMapping["source"]];
      } else if (fieldMapping["targetFunction"]) {
        newNode[fieldMapping["target"]] = fieldMapping["targetFunction"](node);
      }
    });
  }

  const dispatch = useAppDispatch();

  const data = useAppSelector((state) => state.persistedReducer.user);
  // const userRoles = useAppSelector((state) => state.persistedReducer.user)
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState<any>({
    name: "",
    surname: "",
    email: "",
    phoneNumber: "",
    lockoutEnabled: true,
    isActive: true,
    userName: "",
    password: "",
  });
  const [userPermission, setUserPermission] = useState<any>([]);
  const [tableData, setTableData] = useState([
    {
      id: 1,
      userName: "tet04",
      name: "test04",
      roles: "Admin, HR",
      emaiAddress: "test04@yopmail.com",
      emailConfirm: { badgeColorVariant: "primary", content: "Yes" },
      status: { badgeColorVariant: "success", content: "Active" },
      creationTime: "01/04/2023, 09:20:51 AM",
    },
  ]);

  const tableHeaders = [
    {
      displayName: "User Name",
      key: "userName",
      datatype: "text",
      dataLength: 30,
      required: true,
      sortable: true,
    },
    {
      displayName: "Name",
      key: "name",
      datatype: "text",
      dataLength: 30,
      required: true,
      sortable: true,
    },
    {
      displayName: "Roles",
      key: "roles",
      datatype: "text",
      dataLength: 30,
      required: true,
      sortable: true,
    },
    {
      displayName: "Email Address",
      key: "emaiAddress",
      datatype: "text",
      dataLength: 30,
      required: true,
      sortable: true,
    },
    {
      displayName: "Email Confirm",
      key: "emailConfirm",
      datatype: "badge",
      dataLength: 5,
      required: true,
      sortable: true,
    },
    {
      displayName: "Status",
      key: "status",
      datatype: "badge",
      dataLength: 20,
      required: true,
      sortable: true,
    },
    {
      displayName: "Creation Time",
      key: "creationTime",
      datatype: "text",
      dataLength: 30,
      required: true,
      sortable: true,
    },
  ];

  const actions = [
    { id: "user_edit_offcanvas", displayName: "Edit", offId: "user-edit-off" },
    { id: "user_delete", displayName: "Delete", modalId: "user_delete_off" },
    {
      id: "set_password",
      displayName: "Set Password",
      modalId: "set_password",
    },
  ];

  const editionList = [
    { option: "Not assigned" },
    { option: "Standard" },
    { option: "apple" },
    { option: "Apple1" },
  ];

  const navtabsItemsEdit = [
    { label: "User Information", tablink: "#nav-home", id: 0 },
    { label: "Permissions", tablink: "#nav-profile", id: 1 },
  ];
  const navtabsItems = [
    { label: "Basics", tablink: "#nav-home", id: 0 },
    { label: "Roles", tablink: "#nav-role", id: 1 },
  ];

  const offCanvasHandler = () => {};
  const [getUser, setGetUserData] =useState<any>({})
  const [activeNavTabId, setActiveNavTabId] = useState();
  const [activeNavTabIdEdit, setActiveNavTabIdEdit] = useState();

  const [organizationUnit, setOrganizationUnit] = useState([
    { option: "a", value: "aa" },
    { option: "b", value: "bb" },
    { option: "c", value: "cc" },
    { option: "d", value: "dd" },
  ]);
  const [roles, setRoles] = useState([
    { option: "t", value: "tt" },
    { option: "r", value: "rr" },
    { option: "w", value: "ww" },
    { option: "q", value: "qq" },
  ]);
  const fabMenuListItems: any[] = [
    {
      value: "New User",
      some: "value",
      key: "new",
      icon: "plus",
      iconWidth: "20px",
      iconHeight: "20px",
    },
  ];
  const canvasTitle = "New User";
  function onSelectMenu(event: any) {
    console.log(event);
    // if (event.key === 'new') {
    //   event = new PointerEvent("click")
    //   this.newUser(event);
    // }
  }
  const [roleNames, setRoleNames] = useState<any>();
  const [selectedPermissionListData, setSelectedPermissionListData] =
    useState<any>([]);

  const [permissionKeyName, setPermissionKeyName] = useState(0);
  function handleSelectesPermission() {
    
    const permissions: any = {
      key: permissionKeyName,
      permissions: {
        permissions: selectedPermissionListData,
      },
    };
    dispatch(updatePermission(permissions) as any);
  }

  function handleRoleNamesData(data:any){
    let rolesNames:any[] = []
    
    data.forEach((element:any) => {
      if(element.isChecked)
      rolesNames.push(element.name);
    });
    setRoleNames(rolesNames);
  }

  function SelectesPermissions(permissionsData: any) {
    setSelectedPermissionListData(permissionsData);
  }

  const onActionSelection = (rowData: any, actionId: any) => {
    setPermissionKeyName(rowData.id);
    setUserId(rowData.id);
    dispatch(fetchEditUser(String(rowData.id)) as any);
    var tableId = String(rowData.id);
    dispatch(getPermission(tableId) as any);
  };

  function getSelectedPermissions(data: any) {
    console.log("Granted Permissions", data);
  }
  function getSelectedNavTab(event: any) {
    console.log(event);
  }

  // const exportToExcel = () => {
  //   // create an empty excel workbook
  //   const wb = XLSX.utils.book_new();

  //   // create the headers and data arrays
  //   const headers = tableHeaders.map(header => header.displayName);
  //   const data = tableData.map(row => {
  //     let dataRow = {}
  //     tableHeaders.forEach(header => {
  //       dataRow[header.displayName] = row[header.key]
  //     })
  //     return dataRow
  //   });

  //   // create a worksheet and add the headers and data
  //   const ws = XLSX.utils.json_to_sheet([headers, ...data]);

  //   // add the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  //   // write the workbook to a file
  //   XLSX.writeFile(wb, "data.xlsx")
  // }

  const exportToExcel = () => {
    // create an empty excel workbook
    const wb = XLSX.utils.book_new();

    // create the headers and data arrays
    const headers = tableHeaders.map((header) => header.displayName);
    type DataRow = { [key: string]: any };
    const data = tableData.map((row: any) => {
      let dataRow: DataRow = {};
      tableHeaders.forEach((header) => {
        dataRow[header.displayName] = row[header.key];
      });
      return dataRow;
    });

    // create a worksheet and add the headers and data
    const ws = XLSX.utils.json_to_sheet([headers, ...data]);

    // add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // write the workbook to a file
    XLSX.writeFile(wb, "data.xlsx");
  };


  function getUserData(data:any){
    setGetUserData(data);
  }

  function createNewUser(data: any) {

const tempData ={...getUser , roleNames: roleNames}
    dispatch(createUser(tempData) as any).then((res: any) => {

      dispatch(fetchUsers() as any);
    });
    setUserData({
      name: "",
      surname: "",
      email: "",
      phoneNumber: "",
      twoFactorEnabled: false,
      userName: "",
      password: "",
    });
  }
  useEffect(() => {
    dispatch(fetchUsers() as any);
    dispatch(fetchOrganizationUnits() as any);
    dispatch(fetchRoles() as any);
    //dispatch(fetchEditUser("d58fa786-41a6-b110-d3e4-3a0922833270") as any)
  }, [dispatch]);

  useEffect(() => {
    
    let tempRoleData:any[] = []
    if(data.roles)
    data.roles.items.map((el:any)=>{
        const data = {
          name:el.name,
          isChecked:false
        }
        tempRoleData.push(data);
    })
    setUseRolesData(tempRoleData);
  }, [data.roles]);

  const [userRolesData, setUseRolesData] = useState<any>();
  function deleteHandler(data: any) {
    console.log(data);
    dispatch(deleteUser(userId) as any).then((result: any) => {
      dispatch(fetchUsers() as any);
    });
  }

  function handlerSelectedPermission(data: any) {
    console.log(data);
  }

  useEffect(() => {
    if (data.permission) {
      
      setUserPermission(data.permission.groups);
    }
  }, [data.permission]);

  useEffect(() => {
    if (data.users) {
      let tempTableData: any[] = [];
      data.users.items.map((item: any) => {
        const data = {
          id: item.id,
          userName: item.userName,
          name: item.name,
          roles: item.roleNames,
          emaiAddress: item.email,
          emailConfirm: { badgeColorVariant: "primary", content: "Yes" },
          status: { badgeColorVariant: "success", content: "Active" },
          creationTime: "01/04/2023, 09:20:51 AM",
        };
        tempTableData.push(data);
      });
      setTableData(tempTableData);
    }
  }, [data.users]);
  function abc(...prop: any[]) {
    console.log(prop);
    return prop;
  }

  useEffect(() => {
    let tempOrgData: any[] = [];
    if (data.organizationUnit) {
      
      console.log(data.organizationUnit);
      const treeData1 = createTree(
        data.organizationUnit.items,
        "parentId",
        "id",
        null,
        "children",
        [
          {
            target: "label",
            source: "displayName",
          },
          {
            target: "expandedIcon",
            value: "fa fa-folder-open text-warning",
          },
          {
            target: "collapsedIcon",
            value: "fa fa-folder text-warning",
          },
          {
            target: "expanded",
            value: true,
          },
        ],
        1
      );

      
      tempOrgData = treeData1;
    }
    setOrganizationUnit(tempOrgData);
  }, [data.organizationUnit]);

  useEffect(() => {
    if (data.roles) {
      
      console.log(data.roles);
      let tempRoleData: any[] = [];
      data.roles.items.map((item: any) => {
        const data = {
          option: item.name,
          value: item.id,
        };
        tempRoleData.push(data);
      });
      setRoles(tempRoleData);
    }
  }, [data.roles]);

  useEffect(() => {
    if (data.editUser) {
      
      setUserData(data.editUser);
    }
  }, [data.editUser]);

  function saveUserRoles(data :any) {

console.log(data);

  }

  return (
    <>
      <div className="row">
        <div className="col-md-12 text-end pb-3 desktop-btn">
          <RdsButton
            label="New User"
            type="button"
            size="medium"
            colorVariant="primary"
            showLoadingSpinner={false}
            databstoggle="offcanvas"
            databstarget="#userOffcanvas"
            icon={"plus"}
            iconWidth={"12px"}
            iconHeight={"12px"}
          ></RdsButton>
        </div>
        <div className="card p-2 h-100 border-0 rounded-0 card-full-stretch">
          <RdsCompDatatable
            tableData={tableData}
            tableHeaders={tableHeaders}
            actions={actions}
            noDataTitle={"Currently you do not have user"}
            classes="table__userTable"
            pagination={true}
            onActionSelection={onActionSelection}
            recordsPerPageSelectListOption={true}
          ></RdsCompDatatable>
          <RdsCompAlertPopup
            alertID="user_delete_off"
            onSuccess={deleteHandler}
          />
        </div>
      </div>

      <RdsOffcanvas
        backDrop={false}
        scrolling={true}
        preventEscapeKey={false}
        canvasTitle={canvasTitle}
        offId="userOffcanvas"
        offcanvaswidth={650}
        placement={"end"}
        onClose={(e) => {
          close();
        }}
      >
        <RdsNavtabs
          navtabsItems={navtabsItems}
          type={"tabs"}
          activeNavTabId={activeNavTabId}
          activeNavtabOrder={(activeNavTabId) => {
            setActiveNavTabId(activeNavTabId);
          }}
          justified={false}
        >
          {activeNavTabId == 0 && (
            <RdsCompUserBasics
              organizationUnit={organizationUnit}
              roles={roles}
              userData={userData}
              createUser={(e: any) => {
                getUserData(e);
              }}
            />
          )}
          {activeNavTabId == 1 && (
            <>
              <RdsCompUserRoles usersRole={userRolesData} changedData={(data:any)=>{handleRoleNamesData(data)}}></RdsCompUserRoles>
              <div className="footer-buttons justify-content-end bottom-0 pt-0">
                <RdsButton
                  class="me-2"
                  label="CANCEL"
                  type="button"
                  databsdismiss="offcanvas"
                  isOutline={true}
                  colorVariant="primary"
                ></RdsButton>
                <RdsButton
                  class="me-2"
                  label="SAVE"
                  type="button"
                  isOutline={false}
                  colorVariant="primary"
                  onClick={createNewUser}
                  databsdismiss="offcanvas"
                ></RdsButton>
              </div>
            </>
          )}
        </RdsNavtabs>
      </RdsOffcanvas>

      <RdsOffcanvas
        canvasTitle="Edit User"
        onclick={offCanvasHandler}
        placement="end"
        offId="user-edit-off"
        offcanvaswidth={650}
        backDrop={false}
        scrolling={false}
        preventEscapeKey={false}
      >
        <RdsNavtabs
          navtabsItems={navtabsItemsEdit}
          type={"tabs"}
          activeNavTabId={activeNavTabIdEdit}
          activeNavtabOrder={(activeNavTabIdEdit) => {
            setActiveNavTabIdEdit(activeNavTabIdEdit);
          }}
          justified={false}
        >
          {activeNavTabIdEdit == 0 && (
            <RdsCompUserBasics
              organizationUnit={organizationUnit}
              roles={roles}
              userData={userData}
              isEdit={true}
              createUser={(e: any) => {
                createNewUser(e);
              }}
            />
          )}
          {activeNavTabIdEdit == 1 && (
            <>
              <RdsCompPermissionTree
                permissions={userPermission}
                selectedPermissions={(SelectesPermission: any) => {
                  SelectesPermissions(SelectesPermission);
                }}
              ></RdsCompPermissionTree>
              <div className="footer-buttons my-2">
                <div className="row">
                  <div className="col-md-12 d-flex">
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
                        // isDisabled={formValid}
                        class="ms-2"
                        colorVariant="primary"
                        databsdismiss="offcanvas"
                        onClick={handleSelectesPermission}
                      ></RdsButton>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </RdsNavtabs>

        {/* <div className="d-flex">
            <RdsButton
              label="CANCEL"
              databsdismiss="offcanvas"
              type={"button"}
              size="small"
              isOutline={true}
              colorVariant="primary"
              class="me-2"
            ></RdsButton>
            <RdsButton
              label="SAVE"
              type={"button"}
              size="small"
              databsdismiss="offcanvas"
              isDisabled={val === ""}
              colorVariant="primary"
              class="me-2"
              onClick={editDataHandler}
            ></RdsButton> */}
      </RdsOffcanvas>
    </>
  );
};

export default Users;
