import React, { Component } from 'react';
import './TopNavigation.css';
import { Menu } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

class Home extends Component {
    handleRouteChange(val) {
        console.log(val);
        switch (val) {
            case 'EmpBasicInfo':
                this.props.history.push("/EmpBasicInfo");
                break;
            case 'EmpSensitiveInfo':
                this.props.history.push("/EmpSensitiveInfo");
                break;
            case 'EmpInfoConfig':
                this.props.history.push("/EmpInfoConfig");
                break;
            case 'OTManagement':
                this.props.history.push("/OTManagement");
                break;
            case 'PayrollCalculation':
                this.props.history.push("/PayrollCalculation");
                break;
            case 'PayrollDetails':
                this.props.history.push("/PayrollDetails");
                break;
            case 'PayrollPreview':
                this.props.history.push("/PayrollPreview");
                break;
            case 'PayrollConfig':
                this.props.history.push("/PayrollConfig");
                break;
            case 'AccessManagement':
                this.props.history.push("/AccessManagement");
                break;
        }

    }
    render() {
        return (
            <div className="NavContainer">
                <div className="logoContainer">
                    <img className="logoIcon" src={require("../../images/hrmlogo2.png")} alt="" />
                </div>
                <div className="menuContainer">
                    <Menu className="el-menu-demo" mode="horizontal" onSelect={this.handleRouteChange.bind(this)}>
                        <Menu.SubMenu index="Emp" title="员工信息管理">
                            <Menu.Item index="EmpBasicInfo">员工基本信息</Menu.Item>
                            <Menu.Item index="EmpSensitiveInfo">员工敏感信息</Menu.Item>
                            <Menu.Item index="EmpInfoConfig">员工信息配置</Menu.Item>
                        </Menu.SubMenu>
                        <Menu.Item index="OTManagement">加班申报管理</Menu.Item>
                        <Menu.SubMenu index="Payroll" title="工资计算管理">
                            <Menu.Item index="PayrollDetails">当期工资计算</Menu.Item>
                            <Menu.Item index="PayrollPreview">工资单预览</Menu.Item>
                            <Menu.Item index="PayrollConfig">工资配置管理</Menu.Item>
                        </Menu.SubMenu>
                        <Menu.SubMenu index="Query" title="查询汇总">
                            <Menu.Item index="2-1">按月查询</Menu.Item>
                            <Menu.Item index="2-2">选项2</Menu.Item>
                            <Menu.Item index="2-3">选项3</Menu.Item>
                        </Menu.SubMenu>
                        <Menu.Item index="AccessManagement">访问权限管理</Menu.Item>
                    </Menu>
                </div>
                <div className="rightContainer">
                    <Menu className="el-menu-demo" mode="horizontal" onSelect={((val) => { console.log(val) })}>
                        <Menu.Item index="Logout">退出登陆</Menu.Item>
                    </Menu>
                </div>
            </div>
        );
    }
}

export default Home;
