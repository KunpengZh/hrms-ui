import { Notification } from 'element-react';
import 'element-theme-default';

var AppStore = (function () {

    var AppUser = {
        "username": "",
        "isAuthenticated": true,
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
     * 
     */

    var DataOptions = {
        EmpInfo: {
            CascaderMenu: [
                {
                    value: "Dept",
                    label: "部门",
                    children: [
                        {
                            value: "dept1",
                            label: "dept1"
                        },
                        {
                            value: "dept2",
                            label: "dept2"
                        },
                        {
                            value: "dept3",
                            label: "dept4"
                        },
                    ]
                }
            ],
        },

    }

    var setDataOptions = (key, val) => {
        DataOptions[key] = val;
    }
    var getDataOptions = (key) => {
        return DataOptions[key];
    }

    /**
     * functions to manage configuration data
     */

    var ConfigData = {
        Department: [],
        JobRole: [],
        WorkerCategory: []
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
            }
            fetch('/AppConfig?configKey=' + 'ConfigData').then((response) => response.json()).then((res) => {
                if (res.status === 200) {
                    console.log
                    ConfigData = JSON.parse(res.data.configDoc);
                    rel({
                        status: 200,
                        message: '',
                        data: ConfigData
                    })
                } else {
                    rel({
                        status: res.status,
                        message: res.message,
                        data: null
                    })
                }
            }).catch((error) => {
                console.error(error);
                rel({ status: 500, message: "Unable to connect with Server" })
            });
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
     * Return the object will be export from App Utils
     */
    return {
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
        setDataOptions: setDataOptions,
        getDataOptions: getDataOptions
    }

})()

export default AppStore;