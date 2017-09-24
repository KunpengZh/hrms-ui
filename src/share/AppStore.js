import { Notification } from 'element-react';
import 'element-theme-default';

var AppStore = (function () {

    var AppUser = {
        "username": "",
        "isAuthenticated": false,
        "jobRole": "",
        "empId": "",
        "empName": ""
    }

    let getAppUser = () => {
        return AppUser;
    }
    let setAppUser = (user) => {
        if (user.isAuthenticated) {
            AppUser = {
                "username": user.username,
                "isAuthenticated": true,
                "jobRole": user.jobRole,
                "empId": user.empId,
                "empName": user.empName
            }
        }
    }
    var isUserLoggedIn = function () {
        return AppUser.isAuthenticated;
    }
    var doAppLogin = function (username, password) {
        return new Promise(function (reslove, rej) {
            if (!username || !password || username === "" || password === "") {
                reslove({
                    isAuthenticated: false,
                    message: "UserName and Password is mandatory required"
                });
            }

            fetch('/login/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36',
                    'Host': 'hrms.guangda.com'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            }).then((response) => response.json()).then((responseJson) => {
                if (responseJson.isAuthenticated) {
                    setAppUser(responseJson);
                    reslove({
                        isAuthenticated: true,
                        message: ''
                    })
                } else {
                    reslove({
                        isAuthenticated: false,
                        message: responseJson
                    })
                }
            }).catch((error) => {
                console.error(error);
                reslove({ isAuthenticated: false, message: "Unable to connect with Server" })
            });
        })
    }


    /**
     * functions to manage configuration data
     */

    var ConfigData = {
        Department: [],
        JobRole: [],
        WorkerCategory: [],
        ConfigPercentage: []
    }
    var getExistConfigData = () => {
        return ConfigData;
    }
    var getConfigData = () => {
        return new Promise(function (rel, rej) {
            if (ConfigData.Department.length > 0) {
                rel({
                    status: 200,
                    data: ConfigData,
                    message: ''
                });
                return;
            } else {
                fetch('/AppConfig?configKey=' + 'ConfigData').then((response) => response.json()).then((res) => {
                    if (res.status === 200) {
                        ConfigData = res.data;
                        if (res.message !== '') AppStore.showError(res.message);
                        rel({
                            status: 200,
                            message: '',
                            data: ConfigData
                        })
                    } else {
                        rel({
                            status: res.status,
                            message: res.message,
                            data: {
                                Department: [],
                                JobRole: [],
                                WorkerCategory: []
                            }
                        })
                    }
                }).catch((error) => {
                    console.error(error);
                    rel({
                        status: 500,
                        message: "Unable to connect with Server",
                        data: {
                            Department: [],
                            JobRole: [],
                            WorkerCategory: []
                        }
                    })
                });
            }
        })
    }

    var saveConfigData = (configData) => {
        return new Promise(function (rel, rej) {
            fetch('/AppConfig/save', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36',
                    'Host': 'hrms.guangda.com'
                },
                body: JSON.stringify({
                    configKey: 'ConfigData',
                    data: configData,
                })
            }).then((response) => response.json()).then((res) => {
                if (res.status === 200) {
                    ConfigData = configData;
                    rel({
                        status: 200,
                        message: '保存成功'
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            }).catch((error) => {
                console.error(error);
                rel({ status: 500, message: "Unable to connect with Server" })
            });
        })
    }

    /**
     * functions to show notification
     */

    var showSuccess = (message) => {
        Notification({
            title: '成功',
            message: message,
            type: 'success'
        });
    }
    var showWarning = (message) => {
        Notification({
            title: '警告',
            message: message,
            type: 'warning'
        });
    }
    var showInfo = (message) => {
        Notification.info({
            title: '消息',
            message: message
        });
    }
    var showError = (message) => {
        Notification.error({
            title: '错误',
            message: message
        });
    }

    /**
     * Functions to generate Unic Key
     */

    var getUnicKey = (key) => {
        return new Promise(function (rel, rej) {
            fetch('/getUnicKey?key=' + key).then((response) => response.json()).then((res) => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            }).catch((error) => {
                console.error(error);
                rel({ status: 500, message: "Unable to connect with Server" })
            });
        })
    }

    /**
     * Functions for Employee Basic Information
     */

    var getAllEmpBasicInfo = () => {
        return new Promise(function (rel, rej) {
            fetch('/emp').then((response) => response.json()).then((res) => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            }).catch((error) => {
                console.error(error);
                rel({ status: 500, message: "Unable to connect with Server" })
            });
        })
    }

    var saveEmpBasicData = (employees) => {
        return new Promise(function (rel, rej) {
            fetch('/emp/update', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36',
                    'Host': 'hrms.guangda.com'
                },
                body: JSON.stringify({
                    data: employees,
                })
            }).then((response) => response.json()).then((res) => {
                if (res.status === 200) {

                    rel({
                        status: 200,
                        message: '保存成功'
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            }).catch((error) => {
                console.error(error);
                rel({ status: 500, message: "Unable to connect with Server" })
            });
        })
    }

    var deleteEmpBasicData = (empIds) => {
        return new Promise(function (rel, rej) {
            fetch('/emp/delete', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36',
                    'Host': 'hrms.guangda.com'
                },
                body: JSON.stringify({
                    data: empIds,
                })
            }).then((response) => response.json()).then((res) => {
                if (res.status === 200) {

                    rel({
                        status: 200,
                        message: '保存成功'
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            }).catch((error) => {
                console.error(error);
                rel({ status: 500, message: "Unable to connect with Server" })
            });
        })
    }

    /**
     * Functions for Sensitive Employee  Information
     */

    var getAllEmpSensitiveInfo = () => {
        return new Promise(function (rel, rej) {
            fetch('/empsen').then((response) => response.json()).then((res) => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            }).catch((error) => {
                console.error(error);
                rel({ status: 500, message: "Unable to connect with Server" })
            });
        })
    }

    var SyncEmpSenWithBasicTable = function () {

        return new Promise(function (rel, rej) {
            fetch('/empsen/syncempsensitive').then((response) => response.json()).then((res) => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            }).catch((error) => {
                console.error(error);
                rel({ status: 500, message: "Unable to connect with Server" })
            });
        })
    }

    var saveEmpSensitiveData = (employees) => {
        return new Promise(function (rel, rej) {
            fetch('/empsen/update', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36',
                    'Host': 'hrms.guangda.com'
                },
                body: JSON.stringify({
                    data: employees,
                })
            }).then((response) => response.json()).then((res) => {
                if (res.status === 200) {

                    rel({
                        status: 200,
                        message: '保存成功'
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            }).catch((error) => {
                console.error(error);
                rel({ status: 500, message: "Unable to connect with Server" })
            });
        })
    }

    /**
     * common Get and Post functions 
     */

    var doGet = function (url) {
        return new Promise(function (rel, rej) {
            fetch(url).then((response) => response.json()).then((res) => {
                rel(res)
            }).catch((error) => {
                console.error(error);
                rel({ status: 500, message: "Unable to connect with Server", data: '' })
            });
        })
    }
    var doPost = function (url, dataObj) {
        return new Promise(function (rel, rej) {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36',
                    'Host': 'hrms.guangda.com'
                },
                body: JSON.stringify(dataObj)
            }).then((response) => response.json()).then((res) => {
                rel(res);
            }).catch((error) => {
                console.error(error);
                rel({ status: 500, message: "Unable to connect with Server", data: '' })
            });
        })
    }
    /**
     * functions related with Payroll Config
     */

    var getAllPayrollConfigs = () => {
        return new Promise(function (rel, rej) {
            doGet('/categoryConfig').then((res) => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: ''
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            })
        })
    }
    var savePayrollConfigs = function (data) {
        return new Promise(function (rel, rej) {
            doPost('/categoryConfig/update', { data: data }).then(res => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: '保存成功'
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            })
        })
    }

    var deletePayrollConfigs = function (keys) {

        return new Promise(function (rel, rej) {

            if (!keys || !(keys instanceof Array) || keys.length <= 0) {
                rel({
                    status: 700,
                    message: '',
                    data: ''
                })
                return;
            }

            doPost('/categoryConfig/delete', { data: keys }).then(res => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: "删除成功"
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            })
        })
    }
    /**
     * OT related functions
     */


    var getOTByCycle = function (OTCycle) {
        return new Promise(function (rel, rej) {
            if (!OTCycle || OTCycle === "") {
                rel({
                    status: 500,
                    message: '必须指定加班周期',
                    data: ''
                })
                return;
            }
            doGet('/ot?OTCycle=' + OTCycle).then((res) => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: ''
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            })
        })
    }

    var initialOTByCycle = function (OTCycle) {
        return new Promise(function (rel, rej) {
            if (!OTCycle || OTCycle === "") {
                rel({
                    status: 700,
                    message: '必须指定加班周期',
                    data: ''
                })
                return;
            }
            doGet('/ot/initialOT?OTCycle=' + OTCycle).then((res) => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: ''
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            })
        })
    }

    var deleteEmpOTData = function (keys, OTCycle) {
        return new Promise(function (rel, rej) {
            if (!keys || !(keys instanceof Array) || keys.length <= 0) {
                rel({
                    status: 700,
                    message: '',
                    data: ''
                })
                return;
            }
            if (!OTCycle || OTCycle === "") {
                rel({
                    status: 500,
                    message: '必须指定加班周期',
                    data: ''
                })
                return;
            }
            doPost('/ot/delete', { data: keys, OTCycle: OTCycle }).then(res => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: "删除成功"
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            })
        })
    }

    var updateEmpOTData = function (data, OTCycle) {
        return new Promise(function (rel, rej) {
            if (!data || !(data instanceof Array) || data.length <= 0) {
                rel({
                    status: 700,
                    message: '',
                    data: ''
                })
                return;
            }
            if (!OTCycle || OTCycle === "") {
                rel({
                    status: 500,
                    message: '必须指定加班周期',
                    data: ''
                })
                return;
            }
            doPost('/ot/update', { data: data, OTCycle: OTCycle }).then(res => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: res.message
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message,
                        data: []
                    })
                }
            })
        })
    }

    var getYearMonthPeriod = function () {

        var date = new Date;
        var year = date.getFullYear();
        var month = date.getMonth() + 2;
        var YearMonthPeriod = [];

        for (let i = 0; i < 4; i++) {
            month = month - 1;
            if (month < 1) {
                year = year - 1;
                month = 12;
            }
            let item = year.toString() + (month < 10 ? "0" + month : month).toString();
            YearMonthPeriod.push({ value: item, label: item });
        }

        return YearMonthPeriod;
    }

    /**
     * Funcitons related with Salary Details
     */

    var getSDByCycle = function (salaryCycle) {
        return new Promise(function (rel, rej) {
            if (!salaryCycle || salaryCycle === "") {
                rel({
                    status: 500,
                    message: '必须指定周期',
                    data: ''
                })
                return;
            }
            doGet('/sdd?salaryCycle=' + salaryCycle).then((res) => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: ''
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            })
        })
    }

    var initialSDByCycle = function (salaryCycle) {
        return new Promise(function (rel, rej) {
            if (!salaryCycle || salaryCycle === "") {
                rel({
                    status: 700,
                    message: '必须指定周期',
                    data: ''
                })
                return;
            }
            doGet('/sdd/initialSD?salaryCycle=' + salaryCycle).then((res) => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: ''
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            })
        })
    }

    var SyncSDEmpData = function (salaryCycle) {
        return new Promise(function (rel, rej) {
            if (!salaryCycle || salaryCycle === "") {
                rel({
                    status: 700,
                    message: '必须指定周期',
                    data: ''
                })
                return;
            }
            doGet('/sdd/syncdata?salaryCycle=' + salaryCycle).then((res) => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: ''
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            })
        })
    }

    var updateEmpSDData = function (data, salaryCycle) {
        return new Promise(function (rel, rej) {
            if (!data || !(data instanceof Array) || data.length <= 0) {
                rel({
                    status: 700,
                    message: '',
                    data: ''
                })
                return;
            }
            if (!salaryCycle || salaryCycle === "") {
                rel({
                    status: 500,
                    message: '必须指定周期',
                    data: ''
                })
                return;
            }
            doPost('/sdd/update', { data: data, salaryCycle: salaryCycle }).then(res => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: res.message
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message,
                        data: []
                    })
                }
            })
        })
    }

    var reCalculateSDData = function (salaryCycle) {
        return new Promise(function (rel, rej) {
            if (!salaryCycle || salaryCycle === "") {
                rel({
                    status: 500,
                    message: '必须指定周期',
                    data: ''
                })
                return;
            }
            doGet('/sdd/recalculate?salaryCycle=' + salaryCycle).then((res) => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: ''
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            })
        })
    }


    /**
     * GongZiDan functions
     */
    var getGongZiDanByCycle = function (salaryCycle) {
        return new Promise(function (rel, rej) {
            if (!salaryCycle || salaryCycle === "") {
                rel({
                    status: 500,
                    message: '必须指定周期',
                    data: ''
                })
                return;
            }
            doGet('/gongzidan?salaryCycle=' + salaryCycle).then((res) => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: ''
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            })
        })
    }

    var queryGongZiDataByCriteria = function (criteria) {
        return new Promise(function (rel, rej) {
            if (!criteria) {
                rel({
                    status: 200,
                    message: '',
                    data: []
                })
                return;
            }
            doPost('/gongzidan/query', { data: criteria }).then(res => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: res.message
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message,
                        data: []
                    })
                }
            })
        })
    }

    /**
     * GongziDan related functions
     */
    var GongziData = [];

    var setGongziData = function (data) {
        GongziData = data;
    }
    var getGongziData = function () {
        return GongziData;
    }

    var rootRouter = {};

    var setRouter = function (router) {
        rootRouter = router
    }
    var getRouter = function () {
        return rootRouter;
    }

    var getPreHostURLLink = function () {
        return 'http://localhost:8080'
    }

    var getAllAvailableSalaryCycle = function () {
        return new Promise(function (rel, rej) {

            doGet('/gongzidan/getAllAvailableSalaryCycle').then((res) => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: ''
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            })
        })
    }


    /**
     * UserMangement Fucntions
     */

    var getAllApplicationUsers = function () {
        return new Promise(function (rel, rej) {
            doGet('/appuser').then((res) => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: ''
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            })
        })
    }

    var deleteApplicationUsers = function (username) {
        return new Promise(function (rel, rej) {
            if (!username) {
                rel({
                    status: 500,
                    message: '请输入要删除的用户名',
                    data: []
                });
                return;
            }
            doGet('/appuser/delete?username=' + username).then((res) => {
                console.log(res)
                if (res.status === 200) {
                    console.log("here")
                    rel({
                        status: 200,
                        data: res.data,
                        message: ''
                    })
                } else {
                    console.log("err")
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            })
        })
    }

    var createNewApplicationUser = function (user) {
        return new Promise(function (rel, rej) {
            if (!user) {
                rel({
                    status: 500,
                    message: '请输入要新创建的用户信息',
                    data: []
                });
                return;
            }
            doPost('/appuser/create', { data: user }).then(res => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: ''
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            })
        })
    }

    var updateApplicationUser = function (user) {
        return new Promise(function (rel, rej) {
            if (!user) {
                rel({
                    status: 500,
                    message: '请输入要更新的用户信息',
                    data: []
                });
                return;
            }
            doPost('/appuser/update', { data: user }).then(res => {
                if (res.status === 200) {
                    rel({
                        status: 200,
                        data: res.data,
                        message: ''
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message
                    })
                }
            })
        })
    }
    /**
     * Return the object will be export from App Utils
     */
    return {
        deleteApplicationUsers: deleteApplicationUsers,
        createNewApplicationUser: createNewApplicationUser,
        updateApplicationUser: updateApplicationUser,
        getAllApplicationUsers: getAllApplicationUsers,
        getPreHostURLLink: getPreHostURLLink,
        getAllAvailableSalaryCycle: getAllAvailableSalaryCycle,
        setRouter: setRouter,
        getRouter: getRouter,
        queryGongZiDataByCriteria: queryGongZiDataByCriteria,
        getGongziData: getGongziData,
        setGongziData: setGongziData,
        getGongZiDanByCycle: getGongZiDanByCycle,
        reCalculateSDData: reCalculateSDData,
        SyncSDEmpData: SyncSDEmpData,
        getSDByCycle: getSDByCycle,
        initialSDByCycle: initialSDByCycle,
        updateEmpSDData: updateEmpSDData,
        updateEmpOTData: updateEmpOTData,
        getYearMonthPeriod: getYearMonthPeriod,
        getOTByCycle: getOTByCycle,
        initialOTByCycle: initialOTByCycle,
        deleteEmpOTData: deleteEmpOTData,
        deletePayrollConfigs: deletePayrollConfigs,
        savePayrollConfigs: savePayrollConfigs,
        getAllPayrollConfigs: getAllPayrollConfigs,
        saveEmpSensitiveData: saveEmpSensitiveData,
        SyncEmpSenWithBasicTable: SyncEmpSenWithBasicTable,
        getAllEmpSensitiveInfo: getAllEmpSensitiveInfo,
        deleteEmpBasicData: deleteEmpBasicData,
        saveEmpBasicData: saveEmpBasicData,
        getAllEmpBasicInfo: getAllEmpBasicInfo,
        getUnicKey: getUnicKey,
        showError: showError,
        showInfo: showInfo,
        showWarning: showWarning,
        showSuccess: showSuccess,
        getExistConfigData: getExistConfigData,
        getConfigData: getConfigData,
        saveConfigData: saveConfigData,
        getAppUser: getAppUser,
        isUserLoggedIn: isUserLoggedIn,
        doAppLogin: doAppLogin
    }

})()

export default AppStore;