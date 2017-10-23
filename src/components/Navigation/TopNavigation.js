import React, { Component } from 'react';
import './TopNavigation.css';
import { Menu } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from "../../share/AppStore"

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
            case 'NonRegular':
                this.props.history.push("/NonRegularEmp");
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
            case 'QueryReporting':
                this.props.history.push("/QueryReporting");
                break;
            case 'GongZiDanByWorkerCategory':
                this.props.history.push("/GongZiDanByWorkerCategory");
                break;
            case 'GongZiDanByDepartment':
                this.props.history.push("/GongZiDanByDepartment");
                break;
            case 'DanweiJitiYanglaobaoxian':
                this.props.history.push("/DanweiJitiYanglaobaoxian");
                break;
            case 'DanweiJitiShiyebaoxian':
                this.props.history.push("/DanweiJitiShiyebaoxian");
                break;
            case 'DanweiJitiYiliaobaoxian':
                this.props.history.push("/DanweiJitiYiliaobaoxian");
                break;
            case 'DanweiJitiZhufanggongjijin':
                this.props.history.push("/DanweiJitiZhufanggongjijin");
                break;
            case 'DanweiJitiNianjin':
                this.props.history.push("/DanweiJitiNianjin");
                break;
        }

    }
    render() {
        let jobRole = AppStore.getAppUser().jobRole;
        return (
            <div className="NavContainer">
                <div className="logoContainer">
                    <img className="logoIcon" src={require("../../images/hrmlogo2.png")} alt="" />
                </div>
                <div className="menuContainer">
                    <Menu className="el-menu-demo" mode="horizontal" onSelect={this.handleRouteChange.bind(this)}>
                        <Menu.SubMenu index="Emp" title="员工信息管理">
                            <Menu.Item index="EmpBasicInfo">员工基本信息</Menu.Item>
                            {(jobRole === 'SysAdmin' || jobRole === 'HRAdmin') ? (
                                <Menu.Item index="EmpSensitiveInfo">员工敏感信息</Menu.Item>
                            ) : (null)}
                            {(jobRole === 'SysAdmin' || jobRole === 'HRAdmin') ? (
                                <Menu.Item index="EmpInfoConfig">员工信息配置</Menu.Item>
                            ) : (null)}
                        </Menu.SubMenu>
                        {(jobRole === 'SysAdmin' || jobRole === 'HRAdmin' || jobRole === 'PayrollAdmin') ? (
                            <Menu.SubMenu index="OTAndWorkTime" title="当月工资数据申报">
                                <Menu.Item index="OTManagement">全日制人员申报</Menu.Item>
                                <Menu.Item index="NonRegular">非全日制人员申报</Menu.Item>
                            </Menu.SubMenu>
                        ) : (null)}
                        {(jobRole === 'SysAdmin' || jobRole === 'PayrollAdmin') ? (
                            <Menu.SubMenu index="Payroll" title="工资计算管理">
                                <Menu.Item index="PayrollDetails">当期工资计算</Menu.Item>
                                <Menu.Item index="PayrollPreview">工资单预览</Menu.Item>
                                {/* <Menu.Item index="PayrollConfig">工资配置管理</Menu.Item> */}
                            </Menu.SubMenu>
                        ) : (null)}
                        {(jobRole === 'SysAdmin' || jobRole === 'PayrollAdmin') ? (
                            <Menu.SubMenu index="Reporting" title="查询汇总">
                                <Menu.Item index="QueryReporting">查询汇总</Menu.Item>
                                <Menu.Item index="GongZiDanByWorkerCategory">按类别汇总</Menu.Item>
                                <Menu.Item index="GongZiDanByDepartment">按部门汇总</Menu.Item>
                                <Menu.Item index="DanweiJitiYanglaobaoxian">单位计提养老保险</Menu.Item>
                                <Menu.Item index="DanweiJitiShiyebaoxian">单位计提失业保险</Menu.Item>
                                <Menu.Item index="DanweiJitiYiliaobaoxian">单位计提医疗保险</Menu.Item>
                                <Menu.Item index="DanweiJitiZhufanggongjijin">单位计提住房公积金</Menu.Item>
                                <Menu.Item index="DanweiJitiNianjin">单位计提年金</Menu.Item>
                            </Menu.SubMenu>
                        ) : (null)}
                        {(jobRole === 'SysAdmin') ? (
                            <Menu.Item index="AccessManagement">访问权限管理</Menu.Item>
                        ) : (null)}
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
