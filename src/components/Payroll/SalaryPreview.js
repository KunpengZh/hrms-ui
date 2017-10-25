import React, { Component } from 'react';
import './Payroll.css';
import { Button, Select, Loading, Form, Input } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'


import AppStore from '../../share/AppStore';
import EmpGongziDan from './EmpGongziDan'

class EmpBasicInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullscreen: true,
            selectMenu: '',
            selectMenuOptions: AppStore.getYearMonthPeriod(),
            rows: [],
            name: '',
            department: '',
            workerCategory: '',
            departmentSource: [],
            workerCategorySource: [],
            fullrows: [],
            oriSalaryCycle: ''
        }
    }
    componentDidMount() {
        AppStore.getAllAvailableSalaryCycle().then(res => {
            let nstate = Object.assign({}, this.state);
            if (res.status === 200) {
                nstate.selectMenuOptions = res.data.salaryCycle.slice(1);
                nstate.departmentSource = res.data.department;
                nstate.workerCategorySource = res.data.workerCategory;
                if (nstate.selectMenu === "") {
                    nstate.selectMenu = nstate.selectMenuOptions[0].value;
                    nstate.oriSalaryCycle = nstate.selectMenu;
                }
                AppStore.getGongZiDanByCycle(nstate.selectMenu).then(res => {
                    if (res.status === 200) {
                        nstate.rows = res.data;
                        nstate.fullrows = Object.assign([], res.data);
                        nstate.fullscreen = false;
                        this.setState(nstate);
                    } else {
                        nstate.fullscreen = false;
                        this.setState(nstate);
                        AppStore.showError(res.message);
                    }
                })
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
        if (this.state.selectMenu !== this.state.oriSalaryCycle) {
            let nstate = Object.assign({}, this.state);
            this.setState({ fullscreen: true });
            AppStore.getGongZiDanByCycle(this.state.selectMenu).then(res => {
                if (res.status === 200) {
                    nstate.fullrows = res.data;
                    nstate.rows = this.fileterData(res.data);
                    nstate.oriSalaryCycle = nstate.selectMenu
                    nstate.fullscreen = false;
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
    handlePrint() {
        AppStore.setGongziData(this.state.rows);
        let rootRouter = AppStore.getRouter();
        rootRouter.push("/print");
    }
    render() {
        let key = 1;
        let gongzidan = [];
        this.state.rows.forEach(row => {
            gongzidan.push(
                <EmpGongziDan data={row} key={key++} />
            )
        })

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
                            <Button type="primary" icon="view" onClick={this.handleSelection.bind(this)}>查新</Button>
                            <Button type="primary" icon="view" onClick={this.handlePrint.bind(this)}>打印工资单</Button>
                        </Form.Item>
                    </Form>


                </div>
                {gongzidan}
            </div>
        );
    }
}

export default EmpBasicInfo;