import React, { Component } from 'react';
import logo from '../../images/htmlogo1.png';
import './Login.css';
import { Button, Input, Checkbox } from 'element-react';
import 'element-theme-default';
import FontAwesome from 'react-fontawesome';
import '../../font-awesome/css/font-awesome.min.css'

class Login extends Component {
    render() {
        return (
            <div className="LoginContainer">
                <div className="formContainer">
                    <div className="loginHeaderContainer">
                        <div className="logoContainer">
                            <img className="logoIcon" src={require("../../images/hrmlogo2.png")} />
                        </div>
                        <div className="titleContainer">
                            <img className="sysTitle" src={require("../../images/hrsys.PNG")} />
                            <img className="companyTitle" src={require("../../images/guangdacompany.PNG")} />
                        </div>
                    </div>
                    <div className="loginFormInput">
                        <Input placeholder="请输入内容" prepend="用户:" autofocus={true} />
                    </div>
                    <div className="loginFormInput">
                        <Input placeholder="请输入密码" type="password" prepend="密码:" />
                    </div>
                    <div className="checkBoxContainer">
                        <Checkbox  checked><span className="checkBox">记住我的用户名</span></Checkbox>
                    </div>
                    <div className="loginButtonContainer">
                        <Button className="loginButton" type="success">登&nbsp;&nbsp;陆&nbsp;&nbsp;系&nbsp;&nbsp;统</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
