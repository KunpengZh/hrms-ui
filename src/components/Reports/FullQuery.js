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
                { key: 'empId', name: '员工号' },
                { key: 'name', name: '姓名', width: 150 },
                { key: 'department', name: '部门', width: 150 },
                { key: 'jobRole', name: '岗位', width: 150 },
                { key: 'workerCategory', name: '工作类别', width: 150 },
                { key: 'salaryCycle', name: '工资周期', width: 150 },
                { key: 'jinengGongzi', name: '技能工资', editable: false, width: 150 },
                { key: 'gangweiGongzi', name: '岗位工资', editable: false, width: 150 },
                { key: 'jichuButie', name: '基础补贴', editable: false, width: 150 },
                { key: 'xilifei', name: '洗理费', editable: false, width: 150 },
                { key: 'gonglingGongzi', name: '工龄工资', editable: false, width: 150 },
                { key: 'daySalary', name: '日工资(非全日制)', editable: false, width: 150 },
                { key: 'workDays', name: '工作天数(非全日制)', editable: false, width: 150 },
                { key: 'jibengongzi', name: '基本工资', width: 150 },
                { key: 'zhiwuJintie', name: '职务津贴', editable: false, width: 150 },
                { key: 'gongliBuzhu', name: '公里补助', editable: false, width: 150 },
                { key: 'kaoheJiangjin', name: '考核奖金', editable: false, width: 150 },
                { key: 'gudingJiangjin', name: '固定奖金', editable: false, width: 150 },
                { key: 'tongxunButie', name: '通讯补贴', editable: false, width: 150 },
                { key: 'qitaJiangjin', name: '其他奖励', editable: false, width: 150 },
                { key: 'xiaxiangBuzhu', name: '下乡补助', editable: false, width: 150 },
                { key: 'yingyetingBuzhu', name: '营业厅补助', editable: false, width: 150 },
                { key: 'NormalOT', name: '夜间值班费', width: 150 },
                { key: 'WeekendOT', name: '周末值班费', width: 150 },
                { key: 'HolidayOT', name: '节假日值班费' },
                { key: 'anquanJiangli', name: '安全奖励(非全日制)', width: 200 },
                { key: 'wuweizhangJiangli', name: '无违章奖励(非全日制)', width: 200 },
                { key: 'OTJiangjin', name: '加班奖金(非全日制)', width: 200 },
                { key: 'kouchu', name: '扣工资', width: 150, editable: false },
                { key: 'kaohekoukuan', name: '其它罚款', width: 150, editable: false },
                { key: 'yingfagongzi', name: '应发工资', width: 150 },
                { key: 'preAnnuallyIncom', name: '上年月平均收入', width: 150, editable: false },
                { key: 'nianjin', name: '年金', width: 150 },
                { key: 'yanglaobaoxian', name: '养老保险', width: 150 },
                { key: 'shiyebaoxian', name: '失业保险', width: 150 },
                { key: 'zhufanggongjijin', name: '住房公积金', width: 150 },
                { key: 'yiliaobaoxian', name: '医疗保险', width: 150 },
                { key: 'qiyeNianjin', name: '企业年金', width: 150 },
                { key: 'qiyeYanglaobaoxian', name: '企业养老保险', width: 150 },
                { key: 'qiyeShiyebaoxian', name: '企业失业保险', width: 150 },
                { key: 'qiyeZhufanggongjijin', name: '企业住房公积金', width: 150 },
                { key: 'qiyeYiliaobaoxian', name: '企业医疗保险', width: 150 },
                { key: 'yingshuigongzi', name: '应税工资', width: 150 },
                { key: 'tax', name: '个人所得税', width: 150, width: 150 },
                { key: 'yicixingjiangjin', name: '年终奖金', width: 150 },
                { key: 'yicixingjiangjinTax', name: '年终奖金税', width: 150 },
                { key: 'buchongyiliaobaoxian', name: '补充医疗保险', width: 150, editable: false },
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

        AppStore.payrollFullQuery(query).then(res => {
            if (res.status === 200) {
                this.setState({
                    rows: res.data,
                    fullscreen: false,
                    downloadLink: AppStore.getPreHostURLLink() + '/payrollquery/download?criteria=' + JSON.stringify(query)
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
                </div>
            </div>
        );
    }
}


export default EmpInfoConfig;

// { key: 'gender', name: '姓别', width: 150 },
// { key: 'idCard', name: '身份证', width: 150 },
// { key: 'bankAccount', name: '银行帐号', width: 150 },
// { key: 'comment', name: '备注', width: 150 },