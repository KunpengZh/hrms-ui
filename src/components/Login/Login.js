import React, { Component } from 'react';
import './Login.css';
import { Button, Input, Checkbox } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'
import AppStore from '../../share/AppStore';

class Login extends Component {
    state = {
        username: '',
        password: '',
        showError: false,
        errMsg: ""
    }
    handleUsernameChange = (value) => {
        this.setState({ username: value });
    }
    handlePasswordChange = (value) => {
        this.setState({ password: value });
    }
    doAppLogin = () => {
    
        AppStore.doAppLogin(this.state.username, this.state.password).then((res) => {
            if (res.isAuthenticated) {
                this.props.history.push("/home/empInfo");
            } else {
                let errState = {
                    showError: true,
                    errMsg: res.message
                }
                this.setState(errState);
            }
        })

    }
    render() {
        return (
            <div className="LoginContainer">
                <div className="formContainer">
                    <div className="loginHeaderContainer">
                        <div className="logoContainer">
                            <img className="hrLoginIcon" src={require("../../images/hrmlogo2.png")} />
                        </div>
                        <div className="titleContainer">
                            <img className="sysTitle" src={require("../../images/hrsys.PNG")} alt="" />
                            <img className="companyTitle" src={require("../../images/guangdacompany.PNG")} alt="" />
                        </div>
                    </div>
                    <div className="loginFormInput">
                        <Input placeholder="请输入用户名" prepend="用户:" value={this.state.username} onChange={this.handleUsernameChange} autoFocus={true} />
                    </div>
                    <div className="loginFormInput">
                        <Input placeholder="请输入密码" type="password" value={this.state.password} onChange={this.handlePasswordChange} prepend="密码:" />
                    </div>
                    <div className="checkBoxContainer">
                        <Checkbox checked><span className="checkBox">记住我的用户名</span></Checkbox>
                    </div>
                    {this.state.showError ? (
                        <div className="errorDiv">
                            <span className="errorMsg">{this.state.errMsg}</span>
                        </div>
                    ) : (null)}
                    <div className="loginButtonContainer">
                        <Button className="loginButton" onClick={this.doAppLogin.bind(this)} type="success">登&nbsp;&nbsp;陆&nbsp;&nbsp;系&nbsp;&nbsp;统</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
