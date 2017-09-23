import React, { Component } from 'react';
import './Reports.css';
import { Tabs, Loading, Select, Form, Input, Button } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';
import DataGrid from '../DataGrid/DataGrid';

class EmpInfoConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: AppStore.getExistConfigData(),
            fullscreen: true,
            columns: [],
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
            }
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
        console.log(this.state.query);
    }
    render() {
        return (
            <div className="ReportContainer">
                {
                    this.state.fullscreen && <Loading fullscreen={true} />
                }
                <div className="ReportMenuContainer">
                    {/* <label>从:</label>
                    <Select value={this.state.startSalaryCycle} onChange={this.handleStartSalaryCycleChange.bind(this)} style={{ marginRight: "10px", marginLeft: '10px' }}>
                        {
                            this.state.availableSalaryCycles.map(el => {
                                return <Select.Option key={el.value} label={el.label} value={el.value} />
                            })
                        }
                    </Select> */}
                    <Form labelWidth="50">
                        <Form.Item label="从:" style={{ display: "inline-block" }}>
                            <Select value={this.state.query.startSalaryCycle} onChange={this.handleStartSalaryCycleChange.bind(this)}>
                                {
                                    this.state.availableSalaryCycles.map(el => {
                                        return <Select.Option key={el.value} label={el.label} value={el.value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="到:" style={{ display: "inline-block" }}>
                            <Select value={this.state.query.endSalaryCycle} onChange={this.handleEndSalaryCycleChange.bind(this)} >
                                {
                                    this.state.availableSalaryCycles.map(el => {
                                        return <Select.Option key={el.value} label={el.label} value={el.value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="姓名:" style={{ display: "inline-block" }}>
                            <Input value={this.state.query.name} onChange={this.haneleNameChange.bind(this)}></Input>
                        </Form.Item>
                        <Form.Item label="部门:" style={{ display: "inline-block" }}>
                            <Select value={this.state.query.department} onChange={this.handleDepartmentChange.bind(this)} >
                                {
                                    this.state.department.map(el => {
                                        return <Select.Option key={el.value} label={el.label} value={el.value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="岗位:" style={{ display: "inline-block" }}>
                            <Select value={this.state.query.jobRole} onChange={this.handleJobRoleChange.bind(this)} >
                                {
                                    this.state.jobRole.map(el => {
                                        return <Select.Option key={el.value} label={el.label} value={el.value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="类别:" style={{ display: "inline-block" }}>
                            <Select value={this.state.query.workerCategory} onChange={this.handleWokerCategoryChange.bind(this)} >
                                {
                                    this.state.workerCategory.map(el => {
                                        return <Select.Option key={el.value} label={el.label} value={el.value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item style={{ display: "inline-block" }}>
                            <Button type="primary" onClick={this.handleQuery.bind(this)}>查询</Button>
                        </Form.Item>
                    </Form>

                </div>
                <div className="ReportTabContainer">
                    <Tabs activeName="Department" onTabClick={this.handTabChange.bind(this)}>
                        <Tabs.Pane label="部门" name="Department">
                            page first
                        </Tabs.Pane>
                        <Tabs.Pane label="岗位" name="JobRole">
                            <DataGrid
                                columns={this.state.columns.JobRole}
                                rows={this.state.rows.JobRole}
                                rowKey="id"
                                showActionBar={false}
                                minWidth={700}
                            />
                        </Tabs.Pane>
                    </Tabs>
                </div>
            </div>
        );
    }
}


export default EmpInfoConfig;