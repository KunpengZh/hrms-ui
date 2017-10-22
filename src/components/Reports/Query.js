import React, { Component } from 'react';
import './Reports.css';
import { Tabs, Loading, Select, Form, Input, Button } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';
import DataGrid from '../DataGrid/DataGridWithoutMenu';

class EmpInfoConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            fullscreen: true,
            columns: [
                { key: 'empId', name: '员工号', sortable: true, width: 150 },
                { key: 'name', name: '姓名', sortable: true, width: 150 },
                { key: 'gender', name: '姓别', width: 150 },
                { key: 'idCard', name: '身份证', width: 150 },
                { key: 'bankAccount', name: '银行帐号', width: 150 },
                { key: 'comment', name: '备注', width: 150 },
                { key: 'department', name: '部门', width: 150 },
                { key: 'jobRole', name: '岗位', width: 150 },
                { key: 'workerCategory', name: '类别', width: 150 },
                { key: 'salaryCycle', name: '工资周期', width: 150 },
                { key: 'jibengongzi', name: '工资', width: 150 },
                { key: 'totalJiangjin', name: '奖金', width: 150 },
                { key: 'totalOT', name: '加班费', width: 150 },
                { key: 'tongxunButie', name: '通讯补贴', width: 150 },
                { key: 'nianjin', name: '年金', width: 150 },
                { key: 'yanglaobaoxian', name: '养老保险', width: 150 },
                { key: 'shiyebaoxian', name: '医疗保险', width: 150 },
                { key: 'zhufanggongjijin', name: '住房公积金', width: 150 },
                { key: 'yiliaobaoxian', name: '医疗保险', width: 150 },
                { key: 'totalKouchu', name: '扣除', width: 150 },
                { key: 'tax', name: '个人所得税', width: 150 },
                { key: 'yicixingjiangjin', name: '年终奖金', width: 150 },
                { key: 'yicixingjiangjinTax', name: '年终奖金税', width: 150 },
                { key: 'buchongyiliaobaoxian', name: '补充医疗保险', width: 150 },
                { key: 'netIncome', name: '实发工资', width: 150 },
            ],
            activeKey: '',
            availableSalaryCycles: [],
            department: [],
            jobRole: [],
            workerCategory: [],
            query: {
                startSalaryCycle: 'All',
                endSalaryCycle: 'All',
                name: '',
                department: 'All',
                jobRole: 'All',
                workerCategory: 'All'
            },
            rowKey: 'empId',
            downloadLink: '#',
        };
    }
    componentDidMount() {
        AppStore.getAllAvailableSalaryCycle().then(res => {
            let nstate = Object.assign({}, this.state);
            if (res.status === 200) {
                nstate.availableSalaryCycles = res.data.salaryCycle;
                nstate.department = res.data.department;
                nstate.jobRole = res.data.jobRole;
                nstate.workerCategory = res.data.workerCategory;
                nstate.fullscreen = false;
                this.setState(nstate);
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(res.message);
            }
        })

    }

    handTabChange(tab) {
        this.state.activeKey = tab.props.name
    }
    handleStartSalaryCycleChange(value) {
        let query = this.state.query;
        query.startSalaryCycle = value;
        this.setState({ query: query });
    }
    handleEndSalaryCycleChange(value) {
        let query = this.state.query;
        query.endSalaryCycle = value;
        this.setState({ query: query });
    }
    haneleNameChange(value) {
        let query = this.state.query;
        query.name = value;
        this.setState({ query: query });
    }
    handleWokerCategoryChange(value) {
        let query = this.state.query;
        query.workerCategory = value;
        this.setState({ query: query });
    }
    handleDepartmentChange(value) {
        let query = this.state.query;
        query.department = value;
        this.setState({ query: query });
    }
    handleJobRoleChange(value) {
        let query = this.state.query;
        query.jobRole = value;
        this.setState({ query: query });
    }
    handleQuery() {
        let query = {};
        if (this.state.query.startSalaryCycle !== 'All' && this.state.query.startSalaryCycle !== '') query.startSalaryCycle = this.state.query.startSalaryCycle;
        if (this.state.query.endSalaryCycle !== 'All' && this.state.query.endSalaryCycle !== '') query.endSalaryCycle = this.state.query.endSalaryCycle;
        if (this.state.query.name !== 'All' && this.state.query.name !== '') query.name = this.state.query.name;
        if (this.state.query.workerCategory !== 'All' && this.state.query.workerCategory !== '') query.workerCategory = this.state.query.workerCategory;
        if (this.state.query.department !== 'All' && this.state.query.department !== '') query.department = this.state.query.department;
        if (this.state.query.jobRole !== 'All' && this.state.query.jobRole !== '') query.jobRole = this.state.query.jobRole;

        if (JSON.stringify(query) === '{}') {
            AppStore.showError("请先选择查询条件！！！");
            return;
        }
        this.setState({ fullscreen: true });
        AppStore.queryGongZiDataByCriteria(query).then(res => {
            if (res.status === 200) {
                this.setState({
                    rows: res.data,
                    fullscreen: false,
                    downloadLink: AppStore.getPreHostURLLink() + '/gongzidan/download?criteria=' + JSON.stringify(query)
                })
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(res.message);
            }
        })
    }
    render() {
        return (
            <div className="ReportContainer">
                {
                    this.state.fullscreen && <Loading fullscreen={true} />
                }
                <div>
                    <Form labelWidth="50" style={{ textAlign: 'left' }}>
                        <Form.Item label="从:" style={{ display: "inline-block" }}>
                            <Select value={this.state.query.startSalaryCycle} onChange={this.handleStartSalaryCycleChange.bind(this)} style={{ width: "120px" }}>
                                {
                                    this.state.availableSalaryCycles.map(el => {
                                        return <Select.Option key={el.value} label={el.label} value={el.value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="到:" style={{ display: "inline-block" }}>
                            <Select value={this.state.query.endSalaryCycle} onChange={this.handleEndSalaryCycleChange.bind(this)} style={{ width: "120px" }}>
                                {
                                    this.state.availableSalaryCycles.map(el => {
                                        return <Select.Option key={el.value} label={el.label} value={el.value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="姓名:" style={{ display: "inline-block", paddingLeft: "5px" }}>
                            <Input value={this.state.query.name} onChange={this.haneleNameChange.bind(this)} style={{ width: "120px" }}></Input>
                        </Form.Item>
                        <Form.Item label="部门:" style={{ display: "inline-block", paddingLeft: "5px" }}>
                            <Select value={this.state.query.department} onChange={this.handleDepartmentChange.bind(this)} style={{ width: "120px" }}>
                                {
                                    this.state.department.map(el => {
                                        return <Select.Option key={el.value} label={el.label} value={el.value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="岗位:" style={{ display: "inline-block", paddingLeft: "5px" }}>
                            <Select value={this.state.query.jobRole} onChange={this.handleJobRoleChange.bind(this)} style={{ width: "120px" }}>
                                {
                                    this.state.jobRole.map(el => {
                                        return <Select.Option key={el.value} label={el.label} value={el.value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="类别:" style={{ display: "inline-block", paddingLeft: "5px" }}>
                            <Select value={this.state.query.workerCategory} onChange={this.handleWokerCategoryChange.bind(this)} style={{ width: "120px" }}>
                                {
                                    this.state.workerCategory.map(el => {
                                        return <Select.Option key={el.value} label={el.label} value={el.value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item labelWidth="0" style={{ display: "inline-block" }}>
                            <Button type="primary" icon="search" onClick={this.handleQuery.bind(this)}>查询</Button>
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
                    {/* <Tabs activeName="Department" onTabClick={this.handTabChange.bind(this)}>
                        <Tabs.Pane label="汇总统计" name="Department">
                            page first
                        </Tabs.Pane>
                        <Tabs.Pane label="详细清单" name="JobRole">
                            <DataGrid
                                columns={this.state.columns}
                                rows={this.state.rows}
                                rowKey={this.state.rowKey}
                                showActionBar={false}
                                enableCheckBox={false}
                            />
                        </Tabs.Pane>
                    </Tabs> */}
                </div>
            </div>
        );
    }
}


export default EmpInfoConfig;