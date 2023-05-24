import React, { Suspense, useEffect, useState } from "react";
import { Route, useNavigate, Routes } from "react-router-dom";
import { Translation, useTranslation } from "react-i18next";
import * as openApi from "../../../libs/proxy/core/OpenAPI";
import "./App.scss";
import {
  configurationService,
  localizationService,
  sessionService,
} from "raaghu-react-core";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../libs/state-management/hooks";
import {
  RdsCompLinkedAccount,
  RdsCompSideNavigation,
  RdsCompTopNavigation,
} from "../../rds-components";
// const menus = <Record<string, any>>require("../../../libs/main-menu");
import * as menus from "../../../libs/main-menu/index";

import RdsCompPageNotFound from "../../../../raaghu-components/src/rds-comp-page-not-found/rds-comp-page-not-found";
import {
  invalidCredentialAction,
  callLoginAction,
  getProfilePictureHost,
} from "../../../libs/state-management/host/host-slice";
import {
  DashboardCompo,
  LoginCompo,
  ForgotPasswordCompo,
  TenantCompo,
  EditionCompo,
  SettingsCompo,
  UsersCompo,
  AuditlogsCompo,
  RolesCompo,
  OrganizationUnitsCompo,
  LanguageCompo,
  LanguageTextCompo,
  DynamicPropertyCompo,
  IconListCompo,
  ClaimTypesCompo,
  ApplicationsCompo,
  TextTemplateCompo,
  ApiScopeCompo,
  IdentityResourcesCompo,
  SecurityLogsCompo,
  ChatsCompo,
  FileManagementCompo,
  FormsCompo,
  BloggerCompo,
  ClientCompo,
  PollsCompo,
  UrlForwardingCompo,
  PaymentPlansCompo,
  BlogsCompo,
  ApiResourcesCompo,
  FormsViewCompo,
  FormsPreviewCompo,
  CommentsCompo,
  TagsCompo,
  ElementsCompo,
  PersonalDataCompo,
  PaymentRequestsCompo,
  MenusCompo,
  MyAccountCompo,
  ComponentsCompo,
  PagesCompo,
  BlogPostCompo,
  GlobalResourcesCompo,
  NewslettersCompo,
  ChangePasswordCompo,
  ChartCompo,
  RegisterCompo,
} from "./PageComponent";
import openidConfig from "./openid.config";
import { iteratee } from "lodash-es";
("../ApiRequestOptions");

export interface MainProps {
  toggleTheme?: React.MouseEventHandler<HTMLInputElement>;
}

const Main = (props: MainProps) => {
  const [languageData, setLanguageData] = useState<any[]>([]);
  const [themes, setThemes] = useState("light");
  const [logoImage, setLogoImage] = useState("./assets/raaghu_logs.png");
  const [currentLanguage, setCurrentLanguage] = useState("en-GB");
  const [currentLanguageLabel, setCurrentLanguageLabel] = useState("");
  const [currentLanguageIcon, setCurrentLanguageIcon] = useState("");

  const [appTheme, setAppTheme] = useState<any[]>([]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const dataHost = useAppSelector(
    (state) => state.persistedReducer.host.callLogin
  );
  const dataHostPic = useAppSelector(
    (state) => state.persistedReducer.host.profilepic
  );

  function createImageFromBase64(
    base64String: string
  ): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = `data:image/png;base64,${base64String}`;
      img.addEventListener("load", () => {
        resolve(img);
      });
      img.addEventListener("error", (err) => {
        reject(err);
      });
    });
  }

  useEffect(() => {
    if (dataHostPic) {
      createImageFromBase64(dataHostPic.fileContent).then((image) => {
        setProfilePic(image.src);
      });
    }
  }, [dataHostPic]);

  let API_URL: string | undefined =
    process.env.REACT_APP_API_URL || "https://raaghu-react.azurewebsites.net";

  const currentPath = window.location.pathname;
  const [profilePic, setProfilePic] = useState(
    "./assets/profile-picture-circle.svg"
  );
  useEffect(() => {
    let id = localStorage.getItem("userId");
    dispatch(getProfilePictureHost(id) as any);
  }, [dispatch]);

  useEffect(() => {
    sessionStorage.setItem(
      "REACT_APP_API_URL",
      process.env.REACT_APP_API_URL || ""
    );
    if (localStorage.getItem("auth")) {
      if (currentPath !== "/dashboard" && currentPath !== "/") {
        navigate(currentPath);
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    showBreadCrum();
  }, [window.location.pathname]);

  async function tokenRefresh() {
    const url = "https://raaghu-react.azurewebsites.net/connect/token";
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("client_id", "raaghu");
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      params.append("refresh_token", refreshToken);
    }
    let token = sessionStorage.getItem("accessToken");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: params,
    });
    const data = await response.json();
    return data;
  }
  //Remember me
  const rememberMe = localStorage.getItem("rememberMe");
  if (
    rememberMe == "true" &&
    currentPath != "/login" &&
    (sessionStorage.getItem("accessToken") ||
      (!sessionStorage.getItem("accessToken") &&
        !sessionStorage.getItem("calledOnce")))
  ) {
    sessionStorage.setItem("calledOnce", "true");
    const loginAccessDate: any = localStorage.getItem("loginAccessDate");
    const savedDate: any = new Date(loginAccessDate);
    const currentDate: any = new Date();
    const diffInSeconds: number = Math.floor(
      (currentDate.getTime() - savedDate.getTime()) / 1000
    );
    const expiresIn: any = localStorage.getItem("expiresIn");
    if (diffInSeconds > expiresIn) {
      tokenRefresh()
        .then((data: any) => {
          if (
            sessionStorage.getItem("accessToken") == undefined ||
            sessionStorage.getItem("accessToken") == null
          ) {
            navigate("/dashboard");
          }
          sessionStorage.setItem("accessToken", data.access_token);
          localStorage.setItem("refreshToken", data.refresh_token);
          openApi.OpenAPI.TOKEN = data.access_token;
          localStorage.setItem("loginAccessDate", Date());
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  }

  const componentsList = [
    {
      label: "Account",
      val: "Account",
    },
    {
      label: "AddressInput",
      val: "AddressInput",
    },
  ];

  // useEffect(() => {
  //   dispatch(callLoginAction(null) as any);
  // }, [dispatch]);
  
  const objectArray = Object.entries(menus);

  
  const index = objectArray.findIndex(([key, value]) => key === "MainMenu");

  if (index !== -1) {
    objectArray.splice(0, 0, objectArray.splice(index, 1)[0]);
  }
  let newobjectArray = objectArray.map((item) => {
    return item[1];
  });


  const concatenated = newobjectArray.reduce(
    (acc: any, arr: any) => acc.concat(arr),
    []
   
  );

  const updatedMainMenu = concatenated.map((item:any) =>{
    if(item.label.startsWith("Menu_")){
      return {
        ...item,
        label:item.label.substring(5),
      };
    }
    return item;
  });
  // console.log(updatedMainMenu);
  const concatenatedExtended = concatenated.concat([
    {
      label: "Host Admin",
      path: "/host-admin",
      icon: "saas",
      children: [
        {
          label: "Linked Accounts",
          icon: "manage_linked",
          path: "/linked-accounts",
          subText: "Manage accounts linked to your account",
          id: "nav-LinkAccount",
        },
        {
          label: "My Account",
          icon: "manage_authority",
          path: "/my-account",
          subText: "Manage authority accounts",
          id: "nav-MyAccount",
        },
        {
          label: "Security Logs",
          icon: "login_attempts",
          path: "/security-logs",
          subText: "See recent login attempts for your account",
          id: "nav-SecuityLogs",
        },
        {
          label: "Personal Data",
          icon: "my_settings",
          path: "/personal-data",
          subText: "Change your account settings",
          id: "nav-PersonalData",
        },
      ],
    },
  ]);
  const { t, i18n } = useTranslation();
 
  const onClickHandler = (e: any, val: any) => {
    setCurrentLanguage(val);
  };

  const themeItems = [
    {
      id: 0,
      label: "Light",
      val: "Light",
      icon: "light",
      iconWidth: "17px",
      iconHeight: "17px",
    },
    {
      id: 1,
      label: "Dark",
      val: "Dark",
      icon: "dark",
      iconWidth: "17px",
      iconHeight: "17px",
    },
    {
      id: 2,
      label: "Semi Dark",
      val: "Semi Dark",
      icon: "semidark",
      iconWidth: "17px",
      iconHeight: "17px",
    },
  ];

  const onClicktheme = (e: any, val: any) => {
    if (val == "Light") {
      setThemes("light");
      setLogoImage("./assets/raaghu_logs.png");
    } else if (val == "Dark") {
      setThemes("dark");
      setLogoImage("./assets/raaghu-logo-white-text.png");
    } else if (val == "Semi Dark") {
      setThemes("semidark");
      setLogoImage("./assets/raaghu-logo-white-text.png");
    }
  };

  
  const configLocalization=()=> {
    configurationService(currentLanguage).then(async (res: any) => {
      if (res.currentUser.id) {
        localStorage.setItem("userId", res.currentUser.id);
        if (currentLanguage == "العربية") {
          document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
        } else {
          document.getElementsByTagName("html")[0].setAttribute("dir", "ltr");
        }
      }

      const tempdata: any[] = await res.localization?.languages?.map(
        (item: any) => {
          return {
            label: item.displayName,
            val: item.cultureName,
            icon:
              item.flagIcon !== null
                ? item.flagIcon
                : item.twoLetterISOLanguageName,
            iconWidth: "20px",
            iconHeight: "20px",
          };
        }
      );
      let index = tempdata.findIndex((item: any) => item.val === currentLanguage);
      index = index == -1 ? 0 : index;
      setCurrentLanguageLabel(tempdata[index].label);
      setCurrentLanguageIcon(tempdata[index].icon);
      setLanguageData(tempdata);

      localizationService(currentLanguage).then((resp: any) => {
        let data2 = {};
        const translation = resp?.resources;
        if (translation) {
          Object.keys(translation).forEach((key) => {
            Object.keys(translation[key].texts).map((k1) => { 
              let k2 = k1.replace(/[a-zA-Z]{0,20}[^\w\s]/gi,"");
              let k4 = k2.replace(/([a-z])([A-Z])/g, '$1 $2');
              let value1 = translation[key].texts[k1];
              data2 = { ...data2, [k4]: value1 };
            });
          });
          i18n.addResourceBundle(
            currentLanguage,
            "translation",
            data2,
            false,
            true
          );
          i18n.changeLanguage(currentLanguage);
        }
      });
    });
  }
  useEffect(() => {
    configLocalization();
  }, [currentLanguage]);

  const sideNavItems = concatenated;

  // OnClickHandler for side nav to reflect title and subtitle on TopNav
  const getLabelForPath: any = (path: string, navItems: any) => {
    let label = null;
    for (const navItem of navItems) {
      if (navItem.path === path) {
        return navItem.label;
      }
      if (navItem.children) {
        label = getLabelForPath(path, navItem.children);
        if (label) {
          return label;
        }
      }
    }
    return label;
  };

  const getSubTitle: any = (label: string, navItems: any) => {
    let subTitle = null;
    for (const navItem of navItems) {
      if (navItem.label === label) {
        return navItem.subTitle;
      }
      if (navItem.children) {
        subTitle = getSubTitle(label, navItem.children);
        if (subTitle) {
          return subTitle;
        }
      }
    }
    return subTitle;
  };

  const displayName = getLabelForPath(currentPath, sideNavItems);
  const subTitle = getSubTitle(displayName, sideNavItems);
  const [currentTitle, setCurrentTitle] = useState(displayName);
  const [currentSubTitle, setCurrentSubTitle] = useState(subTitle);
  const [breacrumItem, setBreadCrumItem] = useState<any[]>([]);

  const sideNavOnClickHandler = (e: any) => {
    const pageName = e.target.getAttribute("data-name");
    const subTitle = getSubTitle(pageName, sideNavItems);
    setCurrentSubTitle(subTitle);
    document.title = `raaghu-${pageName.toLowerCase()}`;
    setCurrentTitle(pageName);
    let a = recursiveFunction(concatenatedExtended, pageName);
    a = a.filter((res: any) => (res ? true : false));
    if (a[0].id) {
      a = a.map((res: any) => {
        return {
          id: res.id,
          label: t(res.label),
          icon: "",
        };
      });
      setBreadCrumItem(a);
      setCurrentTitle(a[0].label);
      document.title = `raaghu-${a[0].label.toLowerCase()}`;
    } else {
      a = a[0].reverse();
      a = a.map((res: any) => {
        return {
          id: res.id,
          label: t(res.label),
          icon: "",
        };
      });
      setBreadCrumItem(a);
      setCurrentTitle(a[a.length - 1].label);
      document.title = `raaghu-${a[a.length - 1].label.toLowerCase()}`;
    }
  };
  function showBreadCrum() {
    let breadcrumData = recursiveFunction1(concatenatedExtended, currentPath);

    breadcrumData = breadcrumData.filter((res: any) => (res ? true : false));
    if (breadcrumData.length && breadcrumData[0].id) {
      breadcrumData = breadcrumData.map((res: any) => {
        return {
          id: res.id,
          label: t(res.label),
          icon: "",
        };
      });
      setCurrentTitle(breadcrumData[0].label);
      document.title = `raaghu-${breadcrumData[0].label.toLowerCase()}`;
      setBreadCrumItem(breadcrumData);
    } else if (breadcrumData.length) {
      breadcrumData = breadcrumData[0].reverse();
      breadcrumData = breadcrumData.map((res: any) => {
        return {
          id: res.id,
          label: t(res.label),
          icon: "",
        };
      });
      setBreadCrumItem(breadcrumData);
      document.title = `raaghu-${breadcrumData[
        breadcrumData.length - 1
      ].label.toLowerCase()}`;
      setCurrentTitle(breadcrumData[breadcrumData.length - 1].label);
    }
  }

  // useEffect(() => {
  //    localizationService("en-GB").then((resp: any) => {
  //     let data2 = {};
  //     const translation = resp?.resources;
  //     if (translation) {
  //       Object.keys(translation).forEach((key) => {
  //         Object.keys(translation[key].texts).forEach((k1) => {
  //           let k2 = k1.replace(/[^\w\s]/gi, "_");
  //           let value1 = translation[key].texts[k1];
  //           data2 = { ...data2, [k2]: value1 };
  //         });
  //       });
  //       i18n.addResourceBundle(
  //         currentLanguage,
  //         "translation",
  //         data2,
  //         false,
  //         true
  //       );
  //       i18n.changeLanguage(currentLanguage);
  //       showBreadCrum();
  //     }
  //   });
  // }, []);



  // useEffect(() => {
  //   configurationService(currentLanguage).then(async (res: any) => {
  //     if (res.currentUser.id) {
  //       localStorage.setItem("userId", res.currentUser.id);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (dataHost && dataHost.email != "" && dataHost.password != "") {
      localStorage.setItem("datahostEmail", dataHost.email);
      sessionStorage.setItem(
        "REACT_APP_API_URL",
        process.env.REACT_APP_API_URL || ""
      );
      sessionService(
        openidConfig.issuer,
        openidConfig.grant_type,
        dataHost.email,
        dataHost.password,
        openidConfig.clientId,
        openidConfig.scope
      )
        .then(async (res: any) => {
          if (res.access_token) {
            await dispatch(
              invalidCredentialAction({ invalid: false, message: "" })
            );
            localStorage.setItem("auth", JSON.stringify(true));
   
    navigate("/dashboard");
    setCurrentTitle("Dashboard");
            await configLocalization();
            sessionStorage.setItem("accessToken", res.access_token);
            localStorage.setItem("refreshToken", res.refresh_token);
            localStorage.setItem("expiresIn", res.expires_in);
            localStorage.setItem("loginAccessDate", Date());
          }
        })
        .catch((error: any) => {
          dispatch(
            invalidCredentialAction({
              invalid: true,
              message: error.response.data.error_description,
            })
          );
        });
      dispatch(callLoginAction(null) as any);
    }
  }, [dataHost]);

  function recursiveFunction(menus: any, searchName: string) {
    return menus.map((res: any) => {
      if (res.label == searchName) {
        const item = {
          id: res.label,
          label: res.label,
          icon: "",
        };
        return item;
      } else {
        if (res.children) {
          let item = recursiveFunction(res.children, searchName);
          item = item.filter((res: any) => (res ? true : false));
          if (item != null && item[0] != null) {
            if (!item[0].id) {
              return item[0].concat([
                { id: res.label, label: res.label, icon: "" },
              ]);
            } else {
              return item.concat([
                { id: res.label, label: res.label, icon: "" },
              ]);
            }
          }
        }
        return null;
      }
    });
  }
  function recursiveFunction1(menus: any, searchName: string) {
    return menus.map((res: any) => {
      if (res.path && res.path == searchName) {
        const item = {
          id: res.label,
          label: res.label,
          icon: "",
        };
        return item;
      } else {
        if (res.children) {
          let item = recursiveFunction1(res.children, searchName);
          item = item.filter((res: any) => (res ? true : false));
          if (item != null && item[0] != null) {
            if (!item[0].id) {
              return item[0].concat([
                { id: res.label, label: res.label, icon: "" },
              ]);
            } else {
              return item.concat([
                { id: res.label, label: res.label, icon: "" },
              ]);
            }
          }
        }
        return null;
      }
    });
  }

  const logout = () => {
    localStorage.clear();
    //store.accessToken = null;
    navigate("/login");
  };

  let logo = "./assets/raaghu_logs.png";
  document.documentElement.setAttribute("theme", themes);
  return (
    <Suspense>
      <Routes>
        <Route path="/login" element={<LoginCompo />}></Route>
        <Route
          path="/forgot-password"
          element={<ForgotPasswordCompo />}
        ></Route>
        <Route path="/changepassword" element={<ChangePasswordCompo />}></Route>
        <Route path="/register" element={<RegisterCompo />} />
      </Routes>
      {localStorage.getItem("auth") && (
        <>
          {location.pathname != "/login" &&
            location.pathname != "/forgot-password" &&
            location.pathname != "/changepassword" &&
            location.pathname != "/register" && (
              <div className="d-flex flex-column flex-root">
                <div className="page d-flex flex-column flex-column-fluid">
                  <div
                    className="
							page
        d-flex
        flex-column-fluid
        align-items-stretch
        container-fluid 
        px-0"
                  >
                    <div className="d-flex flex-column-fluid align-items-stretch container-fluid px-0">
                      <div className="aside ng-tns-c99-0" id="aside">
                        <div
                          onClick={() => navigate("/dashboard")}
                          id="raaghuLogo"
                        >
                          <img
                            className="ms-1 cursor-pointer sidenav-logo"
                            src={logoImage}
                            alt="logo"
                          ></img>
                        </div>

                        <div className="mx-2 mt-6">
                           <RdsCompSideNavigation
                            sideNavItems={sideNavItems}
                            onClick={sideNavOnClickHandler}
                            toggleTheme={props.toggleTheme}
                          ></RdsCompSideNavigation>
                        </div>
                      </div>
                      <div
                        className="wrapper d-flex flex-column flex-row-fluid rds-scrollable-wrapper px-sm-0"
                        id="FixedHeaderOverFlow"
                      >
                        <div className="align-items-stretch position-sticky top-0 w-100 shadow-sm top-navigation-zindex">
                          <RdsCompTopNavigation
                            languageLabel={currentLanguageLabel}
                            themeLabel="Theme"
                            profilePic={profilePic}
                            breacrumItem={breacrumItem}
                            languageIcon={currentLanguageIcon}
                            languageItems={languageData}
                            componentsList={componentsList}
                            onClick={onClickHandler}
                            onClickThemeCheck={onClicktheme}
                            profileTitle="Host Admin"
                            profileName="admin"
                            onLogout={logout}
                            // logo={logo}
                            // toggleTheme={toggleTheme}
                            themeItems={themeItems}
                            navbarTitle={t(currentTitle) || ""}
                            navbarSubTitle={t(currentSubTitle) || ""}
                            onChatClickHandler={() => {}}
                            toggleItems={[]}
                            elementList={[]}
                          />
                        </div>
                        <div className="layoutmargin mb-top-margin h-100 m-4">
                          <Suspense>
                            <Routes>
                              <Route
                                path="/dashboard"
                                element={<DashboardCompo />}
                              ></Route>
                              <Route
                                path="/tenant"
                                element={<TenantCompo></TenantCompo>}
                              ></Route>
                              <Route
                                path="/edition"
                                element={<EditionCompo></EditionCompo>}
                              ></Route>
                              <Route
                                path="/settings"
                                element={<SettingsCompo></SettingsCompo>}
                              ></Route>
                              <Route
                                path="/audit-logs"
                                element={<AuditlogsCompo></AuditlogsCompo>}
                              ></Route>
                              <Route
                                path="/users"
                                element={<UsersCompo />}
                              ></Route>
                              <Route
                                path="/role"
                                element={<RolesCompo></RolesCompo>}
                              ></Route>
                              <Route
                                path="/organization-unit"
                                element={
                                  <OrganizationUnitsCompo></OrganizationUnitsCompo>
                                }
                              ></Route>
                              <Route
                                path="/language"
                                element={<LanguageCompo></LanguageCompo>}
                              ></Route>
                              <Route
                                path="/language-text"
                                element={
                                  <LanguageTextCompo></LanguageTextCompo>
                                }
                              ></Route>
                              <Route
                                path="/dynamic-properties"
                                element={
                                  <DynamicPropertyCompo></DynamicPropertyCompo>
                                }
                              ></Route>
                              <Route
                                path="/security-logs"
                                element={<SecurityLogsCompo />}
                              ></Route>

                              <Route
                                path="/icons"
                                element={<IconListCompo />}
                              ></Route>
                              <Route
                                path="/claim-types"
                                element={<ClaimTypesCompo />}
                              />
                              <Route
                                path="/text-template"
                                element={<TextTemplateCompo />}
                              ></Route>
                              <Route
                                path="/applications"
                                element={<ApplicationsCompo />}
                              ></Route>
                              <Route
                                path="/identityResources"
                                element={<IdentityResourcesCompo />}
                              />

                              <Route
                                path="/api-scope"
                                element={<ApiScopeCompo />}
                              />
                              <Route
                                path="/apiResources"
                                element={<ApiResourcesCompo />}
                              />
                              <Route path="/blogs" element={<BlogsCompo />} />
                              <Route path="/chats" element={<ChatsCompo />} />
                              <Route
                                path="/fileManagement"
                                element={<FileManagementCompo />}
                              />
                              <Route path="/forms" element={<FormsCompo />} />
                              <Route
                                path="/formsView/:id"
                                element={<FormsViewCompo />}
                              />
                              <Route
                                path="/formsPreview/:id"
                                element={<FormsPreviewCompo />}
                              />
                              <Route path="/polls" element={<PollsCompo />} />
                              <Route
                                path="/blogger"
                                element={<BloggerCompo />}
                              />
                              <Route path="/client" element={<ClientCompo />} />
                              <Route
                                path="/url-forwarding"
                                element={<UrlForwardingCompo />}
                              />
                              <Route
                                path="/paymentPlans"
                                element={<PaymentPlansCompo />}
                              />
                              <Route
                                path="/paymentRequests"
                                element={<PaymentRequestsCompo />}
                              />
                              <Route
                                path="/comments"
                                element={<CommentsCompo />}
                              />
                              <Route path="/tags" element={<TagsCompo />} />
                              <Route
                                path="/globalResources"
                                element={<GlobalResourcesCompo />}
                              />
                              <Route
                                path="/elements/:type"
                                element={<ElementsCompo />}
                              />
                              <Route
                                path="/personal-data"
                                element={<PersonalDataCompo />}
                              />
                              <Route
                                path="/my-account"
                                element={<MyAccountCompo />}
                              />
                              <Route
                                path="/linked-accounts"
                                element={<RdsCompLinkedAccount />}
                              />

                              <Route path="/menus" element={<MenusCompo />} />
                              <Route
                                path="/components/:type"
                                element={<ComponentsCompo />}
                              />
                              <Route path="/pages" element={<PagesCompo />} />
                              <Route
                                path="/**/*"
                                element={<RdsCompPageNotFound />}
                              />
                              <Route
                                path="/blog-post"
                                element={<BlogPostCompo />}
                              />
                              <Route
                                path="/newsletters"
                                element={<NewslettersCompo />}
                              />
                              <Route
                                path="/charts/:type"
                                element={<ChartCompo />}
                              />
                            </Routes>
                          </Suspense>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </>
      )}
    </Suspense>
  );
};
export default Main;
