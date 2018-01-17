import React, { Component } from 'react';
import './Payroll.css';
import { Button, Select, Loading, Form, Input } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import EmpDeskAccountTable from './EmpDeskAccountTable';
import AppStore from '../../share/AppStore';
import DataGrid from '../DataGrid/DataGridWithoutMenu';



class EmpDeskAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullscreen: true,
            selectMenu: '',
            selectMenuOptions: [],
            rows: [],
            name: '',
            department: '',
            workerCategory: '',
            departmentSource: [],
            workerCategorySource: [],
            fullrows: [],
            oriYear: '',
            downloadLink: '#',
            rowKey: 'empId',
            columns: [
                { key: 'empId', name: '员工号', sortable: true, width: 150 },
                { key: 'name', name: '姓名', sortable: true, width: 150 },
                { key: 'department', name: '部门', width: 150 },
                { key: 'jobRole', name: '岗位', width: 150 },
                { key: 'workerCategory', name: '类别', width: 150 },
                { key: 'JANXiaoji', name: '一月小计', width: 150 },
                { key: 'JANGongzi', name: '一月工资', width: 150 },
                { key: 'JANJiangjin', name: '一月奖金', width: 150 },
                { key: 'JANWuxiangfuli', name: '一月福利', width: 150 },
                { key: 'FEBXiaoji', name: '二月小计', width: 150 },
                { key: 'FEBGongzi', name: '二月工资', width: 150 },
                { key: 'FEBJiangjin', name: '二月奖金', width: 150 },
                { key: 'FEBWuxiangfuli', name: '二月福利', width: 150 },
                { key: 'MARXiaoji', name: '三月小计', width: 150 },
                { key: 'MARGongzi', name: '三月工资', width: 150 },
                { key: 'MARJiangjin', name: '三月奖金', width: 150 },
                { key: 'MARWuxiangfuli', name: '三月福利', width: 150 },
                { key: 'APRXiaoji', name: '四月小计', width: 150 },
                { key: 'APRGongzi', name: '四月工资', width: 150 },
                { key: 'APRJiangjin', name: '四月奖金', width: 150 },
                { key: 'APRWuxiangfuli', name: '四月福利', width: 150 },
                { key: 'MAYXiaoji', name: '五月小计', width: 150 },
                { key: 'MAYGongzi', name: '五月工资', width: 150 },
                { key: 'MAYJiangjin', name: '五月奖金', width: 150 },
                { key: 'MAYWuxiangfuli', name: '五月福利', width: 150 },
                { key: 'JUNXiaoji', name: '六月小计', width: 150 },
                { key: 'JUNGongzi', name: '六月工资', width: 150 },
                { key: 'JUNJiangjin', name: '六月奖金', width: 150 },
                { key: 'JUNWuxiangfuli', name: '六月福利', width: 150 },
                { key: 'JULXiaoji', name: '七月小计', width: 150 },
                { key: 'JULGongzi', name: '七月工资', width: 150 },
                { key: 'JULJiangjin', name: '七月奖金', width: 150 },
                { key: 'JULWuxiangfuli', name: '七月福利', width: 150 },
                { key: 'AUGXiaoji', name: '八月小计', width: 150 },
                { key: 'AUGGongzi', name: '八月工资', width: 150 },
                { key: 'AUGJiangjin', name: '八月奖金', width: 150 },
                { key: 'AUGWuxiangfuli', name: '八月福利', width: 150 },
                { key: 'SEPXiaoji', name: '九月小计', width: 150 },
                { key: 'SEPGongzi', name: '九月工资', width: 150 },
                { key: 'SEPJiangjin', name: '九月奖金', width: 150 },
                { key: 'SEPWuxiangfuli', name: '九月福利', width: 150 },
                { key: 'OCTXiaoji', name: '一十月小计', width: 150 },
                { key: 'OCTGongzi', name: '一十月工资', width: 150 },
                { key: 'OCTJiangjin', name: '一十月奖金', width: 150 },
                { key: 'OCTWuxiangfuli', name: '一十月福利', width: 150 },
                { key: 'NOVXiaoji', name: '十一月小计', width: 150 },
                { key: 'NOVGongzi', name: '十一月工资', width: 150 },
                { key: 'NOVJiangjin', name: '十一月奖金', width: 150 },
                { key: 'NOVWuxiangfuli', name: '十一月福利', width: 150 },
                { key: 'DECXiaoji', name: '十二月小计', width: 150 },
                { key: 'DECGongzi', name: '十二月工资', width: 150 },
                { key: 'DECJiangjin', name: '十二月奖金', width: 150 },
                { key: 'DECWuxiangfuli', name: '十二月福利', width: 150 },
                { key: 'JANTODECXiaoji', name: '1-12月小计', width: 150 },
                { key: 'JANTODECGongzi', name: '1-12月工资', width: 150 },
                { key: 'JANTODECJiangjin', name: '1-12月奖金', width: 150 },
                { key: 'JANTODECWuxiangfuli', name: '1-12月福利', width: 150 },
            ]
        }
    }
    componentDidMount() {
        AppStore.getEmpDeskAccountAvailableCalendarYear().then(res => {
            let nstate = Object.assign({}, this.state);
            if (res.status === 200) {
                nstate.selectMenuOptions = res.data.calendarYears;
                nstate.departmentSource = res.data.department;
                nstate.workerCategorySource = res.data.workerCategory;
                nstate.fullscreen = false;
                this.setState(nstate);
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(res.message);
            }
        })
    }
    handleSelectMenuChange(value) {
        this.setState({ selectMenu: value });
    }
    handleSelection() {
        if (this.state.selectMenu !== this.state.oriYear) {
            let nstate = Object.assign({}, this.state);
            this.setState({ fullscreen: true });
            AppStore.getEmpDeskAccountByYear(this.state.selectMenu).then(res => {

                if (res.status === 200) {
                    nstate.fullrows = res.data;
                    nstate.rows = this.fileterData(res.data);
                    nstate.oriSalaryCycle = nstate.selectMenu
                    nstate.fullscreen = false;
                    nstate.downloadLink = AppStore.getPreHostURLLink() + '/deskaccount/downloadEmpDeskAccountByYear?calendarYear=' + nstate.selectMenu
                    this.setState(nstate);
                } else {
                    this.setState({ fullscreen: false });
                    AppStore.showError(res.message);
                }
            })
        } else {
            let fullrows = Object.assign([], this.state.fullrows);
            let newrows = this.fileterData(fullrows);
            this.setState({ rows: newrows })
        }
    }
    fileterData(data) {
        let username = this.state.name;

        let department = this.state.department;
        department = department === 'All' ? '' : department;

        let workerCategory = this.state.workerCategory;
        workerCategory = workerCategory === 'All' ? '' : workerCategory;

        if (username === "" && department === "" && workerCategory === "") {
            return data;
        }

        let newdata = [];
        if (username !== "") {
            for (let i = 0; i < data.length; i++) {
                if (data[i].name === username) {
                    newdata.push(data[i])
                }
            }
            data = newdata;
            newdata = [];
        }
        if (department !== "") {
            for (let i = 0; i < data.length; i++) {
                if (data[i].department === department) {
                    newdata.push(data[i])
                }
            }
            data = newdata;
            newdata = [];
        }

        if (workerCategory !== "") {
            for (let i = 0; i < data.length; i++) {
                if (data[i].workerCategory === workerCategory) {
                    newdata.push(data[i])
                }
            }
            data = newdata;
            newdata = [];
        }

        return data;
    }
    haneleNameChange(value) {

        this.setState({ name: value });
    }
    handleWokerCategoryChange(value) {

        this.setState({ workerCategory: value });
    }
    handleDepartmentChange(value) {

        this.setState({ department: value });
    }

    render() {


        return (
            <div className="GongziDanContainer">
                {
                    this.state.fullscreen && <Loading fullscreen={true} />
                }
                <div className="topMenuContainer">
                    <Form labelWidth="50" style={{ textAlign: 'left' }}>
                        <Form.Item label="姓名:" style={{ display: "inline-block" }}>
                            <Input value={this.state.name} onChange={this.haneleNameChange.bind(this)} style={{ width: "120px" }}></Input>
                        </Form.Item>
                        <Form.Item label="部门:" style={{ display: "inline-block" }}>
                            <Select value={this.state.department} onChange={this.handleDepartmentChange.bind(this)} style={{ width: "120px" }}>
                                {
                                    this.state.departmentSource.map(el => {
                                        return <Select.Option key={el.value} label={el.label} value={el.value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="类别:" style={{ display: "inline-block", paddingLeft: "5px" }}>
                            <Select value={this.state.workerCategory} onChange={this.handleWokerCategoryChange.bind(this)} style={{ width: "120px" }}>
                                {
                                    this.state.workerCategorySource.map(el => {
                                        return <Select.Option key={el.value} label={el.label} value={el.value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="周期:" style={{ display: "inline-block", paddingLeft: "5px" }}>
                            <Select value={this.state.selectMenu} onChange={this.handleSelectMenuChange.bind(this)} style={{ marginRight: "20px", width: "120px" }}>
                                {
                                    this.state.selectMenuOptions.map(el => {
                                        return <Select.Option key={el.value} label={el.label} value={el.value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item labelWidth="0" style={{ display: "inline-block" }}>
                            <Button type="primary" icon="view" onClick={this.handleSelection.bind(this)}>查询</Button>
                            <div className="aToButton"><a className="linkButton" href={this.state.downloadLink} target="_blank"><i className="el-icon-document"></i>下载</a></div>
                        </Form.Item>
                    </Form>
                </div>
                <div className="ReportTabContainer">
                    <DataGrid
                        columns={this.state.columns}
                        rows={this.state.rows}
                        rowKey={this.state.rowKey}
                        showActionBar={false}
                        enableCheckBox={false}
                    />
                </div>

            </div>
        );
    }
}

export default EmpDeskAccount;