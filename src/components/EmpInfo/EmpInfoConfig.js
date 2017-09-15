import React, { Component } from 'react';
import './Employee.css';
import { Tabs, Loading } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';
import EmpDataGrid from './EmpDataGrid';

class EmpInfoConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: AppStore.getExistConfigData(),
            fullscreen: true,
            columns: {
                Department: [
                    {
                        key: 'id',
                        name: 'ID',
                        editable: false,
                    },
                    {
                        key: 'value',
                        name: '工作部门',
                        editable: true,
                    }],
                JobRole: [
                    {
                        key: 'id',
                        name: 'ID',
                        editable: false,
                    },
                    {
                        key: 'value',
                        name: '工作岗位',
                        editable: true,
                    }],
                WorkerCategory: [
                    {
                        key: 'id',
                        name: 'ID',
                        editable: false,
                    },
                    {
                        key: 'value',
                        name: '工作类别',
                        editable: true,
                    }],
            }
        };
        this.activeKey = 'Department'
    }
    componentDidMount() {
        AppStore.getConfigData().then((conRes) => {
            if (conRes.status === 200) {
                this.setState({ rows: conRes.data, fullscreen: false });
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(conRes.message);
            }
        })
    }
    handleCreateNew() {
        let self = this;
        return new Promise(function (rel, rej) {
            AppStore.getUnicKey("ConfigDocID").then((res) => {
                if (res.status === 200) {
                    const newRow = {
                        id: res.data,
                        value: ''
                    };
                    rel(newRow);
                } else {
                    AppStore.showError(res.message);
                }
            })

        })
    }
    saveData(data) {
        let newState = Object.assign({}, this.state.rows);
        newState[this.activeKey] = data;
        this.setState({ fullscreen: true });
        AppStore.saveConfigData(newState).then((res) => {
            if (res.status === 200) {
                AppStore.showSuccess("保存成功");
                this.setState({ rows: newState, fullscreen: false });
            } else {
                AppStore.showError(res.message);
                this.setState({ fullscreen: false });
            }
        })

    }
    handTabChange(tab) {
        this.activeKey = tab.props.name
    }
    render() {
        return (
            <div className="EmpTabContainer">
                {
                    this.state.fullscreen && <Loading fullscreen={true} />
                }
                <Tabs activeName="Department" onTabClick={this.handTabChange.bind(this)}>
                    <Tabs.Pane label="部门" name="Department">
                        <EmpDataGrid
                            columns={this.state.columns.Department}
                            rows={this.state.rows.Department}
                            rowKey="id"
                            showConfigActionBar=''
                            showEmpBasicTableActionBar='none'
                            showDelete={true}
                            showCreateNew={true}
                            minWidth={700}
                            createNew={this.handleCreateNew.bind(this)}
                            showSave={true}
                            saveData={this.saveData.bind(this)}
                        />
                    </Tabs.Pane>
                    <Tabs.Pane label="岗位" name="JobRole">
                        <EmpDataGrid
                            columns={this.state.columns.JobRole}
                            rows={this.state.rows.JobRole}
                            rowKey="id"
                            showConfigActionBar=''
                            showEmpBasicTableActionBar='none'
                            showDelete={true}
                            showCreateNew={true}
                            minWidth={700}
                            createNew={this.handleCreateNew.bind(this)}
                            showSave={true}
                            saveData={this.saveData.bind(this)}
                        />
                    </Tabs.Pane>
                    <Tabs.Pane label="工作类别" name="WorkerCategory">
                        <EmpDataGrid
                            columns={this.state.columns.WorkerCategory}
                            rows={this.state.rows.WorkerCategory}
                            rowKey="id"
                            showConfigActionBar=''
                            showEmpBasicTableActionBar='none'
                            showDelete={true}
                            showCreateNew={true}
                            minWidth={700}
                            createNew={this.handleCreateNew.bind(this)}
                            showSave={true}
                            saveData={this.saveData.bind(this)}
                        />
                    </Tabs.Pane>
                </Tabs>
            </div>
        );
    }
}


export default EmpInfoConfig;