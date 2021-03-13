import { Notification } from 'element-react';
import 'element-theme-default';

var AppStore = (function () {

    var getPreHostURLLink = function () {
        return 'http://localhost:8080'
        // return ''
    }

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
                credentials: 'include',
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
     * common Get and Post functions 
     */

    var doGet = function (url) {
        return new Promise(function (rel, rej) {
            fetch(url, { credentials: 'include' }).then((response) => response.json()).then((res) => {
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
                credentials: 'include',
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
                doGet('/AppConfig?configKey=' + 'ConfigData').then((res) => {
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
            doPost('/AppConfig/save', {
                configKey: 'ConfigData',
                data: configData,
            }).then((res) => {
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
            doGet('/getUnicKey?key=' + key).then((res) => {
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
            doGet('/emp').then((res) => {
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
            doPost('/emp/update', {
                data: employees,
            }).then((res) => {
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
            doPost('/emp/delete', {
                data: empIds,
            }).then((res) => {
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

    var queryEmpBasicDataByCriteria = function (criteria) {
        return new Promise(function (rel, rej) {
            if (!criteria) {
                rel({
                    status: 200,
                    message: '',
                    data: []
                })
                return;
            }
            doPost('/emp/querybycriteria', { data: criteria }).then(res => {
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
     * Functions for Sensitive Employee  Information
     */

    var getAllEmpSensitiveInfo = () => {
        return new Promise(function (rel, rej) {
            doGet('/empsen').then((res) => {
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
            doGet('/empsen/syncempsensitive').then((res) => {
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
            doPost('/empsen/update', {
                data: employees,
            }).then((res) => {
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
    var queryEmpSensitiveDataByCriteria = function (criteria) {
        return new Promise(function (rel, rej) {
            if (!criteria) {
                rel({
                    status: 200,
                    message: '',
                    data: []
                })
                return;
            }
            doPost('/empsen/querybycriteria', { data: criteria }).then(res => {
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
    var queryOTByCriteria = function (criteria) {
        return new Promise(function (rel, rej) {
            if (!criteria) {
                rel({
                    status: 200,
                    message: '',
                    data: []
                })
                return;
            }

            doPost('/ot/querybycriteria', { data: criteria }).then(res => {

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
     * Non Regular Salary related functions
     */
    var queryNRByCriteria = function (criteria) {
        return new Promise(function (rel, rej) {
            if (!criteria) {
                rel({
                    status: 200,
                    message: '',
                    data: []
                })
                return;
            }
            doPost('/nonregular/querybycriteria', { data: criteria }).then(res => {
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

    var getNRByCycle = function (salaryCycle) {
        return new Promise(function (rel, rej) {
            if (!salaryCycle || salaryCycle === "") {
                rel({
                    status: 500,
                    message: '必须指定工资周期',
                    data: ''
                })
                return;
            }
            doGet('/nonregular?salaryCycle=' + salaryCycle).then((res) => {
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

    var initialNRByCycle = function (salaryCycle) {
        return new Promise(function (rel, rej) {
            if (!salaryCycle || salaryCycle === "") {
                rel({
                    status: 700,
                    message: '必须指定工资周期',
                    data: ''
                })
                return;
            }
            doGet('/nonregular/initialNRSalary?salaryCycle=' + salaryCycle).then((res) => {
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

    var deleteNRSalaryData = function (keys, salaryCycle) {
        return new Promise(function (rel, rej) {
            if (!keys || !(keys instanceof Array) || keys.length <= 0) {
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
                    message: '必须指定工资周期',
                    data: ''
                })
                return;
            }
            doPost('/nonregular/delete', { data: keys, salaryCycle: salaryCycle }).then(res => {
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

    var updateNRSalaryData = function (data, salaryCycle) {
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
                    message: '必须指定加班周期',
                    data: ''
                })
                return;
            }
            doPost('/nonregular/update', { data: data, salaryCycle: salaryCycle }).then(res => {
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
     * Funcitons related with Salary Details
     */
    var querySDDataByCriteria = function (criteria) {
        return new Promise(function (rel, rej) {
            if (!criteria) {
                rel({
                    status: 200,
                    message: '',
                    data: []
                })
                return;
            }
            doPost('/sdd/querybycriteria', { data: criteria }).then(res => {
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
    var GongZiDanByDepartment = function (criteria) {
        return new Promise(function (rel, rej) {
            if (!criteria || criteria === "") {
                rel({
                    status: 500,
                    message: '必须指定查询条件',
                    data: ''
                })
                return;
            }
            doGet('/gongzidan/gatherByDepartment?criteria=' + JSON.stringify(criteria)).then((res) => {
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
    var GongZiDanByWorkerCategory = function (criteria) {
        return new Promise(function (rel, rej) {
            if (!criteria || criteria === "") {
                rel({
                    status: 500,
                    message: '必须指定周期',
                    data: ''
                })
                return;
            }

            doGet('/gongzidan/gatherByWorkerCategory?criteria=' + JSON.stringify(criteria)).then((res) => {
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
     * 单位计提 
     */
    var queryYanglaobaoxian = function (criteria) {
        return new Promise(function (rel, rej) {
            if (!criteria) {
                rel({
                    status: 500,
                    message: '必须指定查询条件',
                    data: []
                })
                return;
            }
            doGet('/danweijiti/yanglaobaoxian?criteria=' + JSON.stringify(criteria)).then(res => {
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

    var queryShiyebaoxian = function (criteria) {
        return new Promise(function (rel, rej) {
            if (!criteria) {
                rel({
                    status: 500,
                    message: '必须指定查询条件',
                    data: []
                })
                return;
            }
            doGet('/danweijiti/shiyebaoxian?criteria=' + JSON.stringify(criteria)).then(res => {
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

    var queryYiliaobaoxian = function (criteria) {
        return new Promise(function (rel, rej) {
            if (!criteria) {
                rel({
                    status: 500,
                    message: '必须指定查询条件',
                    data: []
                })
                return;
            }
            doGet('/danweijiti/yiliaobaoxian?criteria=' + JSON.stringify(criteria)).then(res => {
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

    var queryZhufanggongjijin = function (criteria) {
        return new Promise(function (rel, rej) {
            if (!criteria) {
                rel({
                    status: 500,
                    message: '必须指定查询条件',
                    data: []
                })
                return;
            }
            doGet('/danweijiti/zhufanggongjijin?criteria=' + JSON.stringify(criteria)).then(res => {
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

    var queryNianjin = function (criteria) {
        return new Promise(function (rel, rej) {
            if (!criteria) {
                rel({
                    status: 500,
                    message: '必须指定查询条件',
                    data: []
                })
                return;
            }
            doGet('/danweijiti/nianjin?criteria=' + JSON.stringify(criteria)).then(res => {
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
     * Return the object will be export from App Utils
     */
    return {
        queryShiyebaoxian: queryShiyebaoxian,
        queryNianjin: queryNianjin,
        queryYanglaobaoxian: queryYanglaobaoxian,
        queryYiliaobaoxian: queryYiliaobaoxian,
        queryZhufanggongjijin: queryZhufanggongjijin,
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
        GongZiDanByWorkerCategory: GongZiDanByWorkerCategory,
        GongZiDanByDepartment: GongZiDanByDepartment,
        getGongZiDanByCycle: getGongZiDanByCycle,
        reCalculateSDData: reCalculateSDData,
        SyncSDEmpData: SyncSDEmpData,
        getSDByCycle: getSDByCycle,
        querySDDataByCriteria: querySDDataByCriteria,
        initialSDByCycle: initialSDByCycle,
        updateEmpSDData: updateEmpSDData,
        updateEmpOTData: updateEmpOTData,
        getYearMonthPeriod: getYearMonthPeriod,
        getOTByCycle: getOTByCycle,
        queryOTByCriteria: queryOTByCriteria,
        initialOTByCycle: initialOTByCycle,
        deleteEmpOTData: deleteEmpOTData,
        deletePayrollConfigs: deletePayrollConfigs,
        savePayrollConfigs: savePayrollConfigs,
        getAllPayrollConfigs: getAllPayrollConfigs,
        saveEmpSensitiveData: saveEmpSensitiveData,
        SyncEmpSenWithBasicTable: SyncEmpSenWithBasicTable,
        getAllEmpSensitiveInfo: getAllEmpSensitiveInfo,
        queryEmpSensitiveDataByCriteria: queryEmpSensitiveDataByCriteria,
        deleteEmpBasicData: deleteEmpBasicData,
        saveEmpBasicData: saveEmpBasicData,
        getAllEmpBasicInfo: getAllEmpBasicInfo,
        queryEmpBasicDataByCriteria: queryEmpBasicDataByCriteria,
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
        doAppLogin: doAppLogin,
        updateNRSalaryData: updateNRSalaryData,
        deleteNRSalaryData: deleteNRSalaryData,
        initialNRByCycle: initialNRByCycle,
        getNRByCycle: getNRByCycle,
        queryNRByCriteria: queryNRByCriteria
    }

})()

export default AppStore;