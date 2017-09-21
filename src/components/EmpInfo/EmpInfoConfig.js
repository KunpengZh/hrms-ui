import React, { Component } from 'react';
import './Employee.css';
import { Tabs, Loading } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';
import EmpDataGrid from './EmpDataGrid';
const { Editors, Formatters } = require('react-data-grid-addons');
const { DropDownEditor } = Editors;
const { DropDownFormatter } = Formatters;

const ColumnKeysNeedValidate = ['workAge', 'age'];
const validateFailMsg = '工龄, 年龄字段只能接受数字，请检查您是否在工龄或是年龄字段里输入的非数字字符';

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
                ConfigPercentage: [
                    {
                        key: 'id',
                        name: 'ID',
                        editable: false,
                    },
                    {
                        key: 'text',
                        name: '系数名称'
                    },
                    {
                        key: 'value',
                        name: '计算系数',
                        editable: true,
                    }
                ]
            }
        };
        this.activeKey = 'Department'
    }
    componentDidMount() {
        let nstate = Object.assign({}, this.state);
        AppStore.getConfigData().then((conRes) => {
            if (conRes.status === 200) {
                const ConfigPercentage = [
                    { text: '个人年金系数', value: 'NIANJINXISHU', id: 'NIANJINXISHU', title: '个人年金系数' },
                    { text: '养老保险系数', value: 'YANGLAOBAOXIANXISHU', id: 'YANGLAOBAOXIANXISHU', title: '养老保险系数' },
                    { text: '医疗保险系数', value: 'YILIAOBAOXIANXISHU', id: 'YILIAOBAOXIANXISHU', title: '医疗保险系数' },
                    { text: '失业保险系数', value: 'SHIYEBAOXIANXISHU', id: 'SHIYEBAOXIANXISHU', title: '失业保险系数' },
                    { text: '住房公积金系数', value: 'ZHUFANGGONGJIJINXISHU', id: 'ZHUFANGGONGJIJINXISHU', title: '住房公积金系数' },
                    { text: '企业部分年金系数', value: 'QIYENIANJINXISHU', id: 'QIYENIANJINXISHU', title: '企业部分年金系数' },
                    { text: '个人所得税计提基数', value: 'GERENSUODESHUISHUIJI', id: 'GERENSUODESHUISHUIJI', title: '个人所得税计提基数' }
                ];
                const ConfigPercentageEditor = <DropDownEditor options={ConfigPercentage} />;
                const ConfigPercentageFormatter = <DropDownFormatter options={ConfigPercentage} value="value" />;
                nstate.columns = {
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
                    ConfigPercentage: [
                        {
                            key: 'id',
                            name: 'ID',
                        },
                        {
                            key: 'text',
                            name: '系数名称',
                            editable: true,
                            editor: ConfigPercentageEditor,
                            formatter: ConfigPercentageFormatter,
                        },
                        {
                            key: 'value',
                            name: '计算系数',
                            editable: true,
                        }
                    ]
                }
                nstate.rows = conRes.data;
                nstate.fullscreen = false;

                this.setState(nstate);
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
                    if (self.activeKey = 'ConfigPercentage') {
                        const newRow = {
                            id: res.data,
                            text: '',
                            value: ''
                        };
                        rel(newRow);
                    } else {
                        const newRow = {
                            id: res.data,
                            value: ''
                        };
                        rel(newRow);
                    }
                } else {
                    AppStore.showError(res.message);
                }
            })

        })
    }
    saveData(data) {
        for (let i = 0; i < data.length; i++) {
            let hasDuplicateWokerCtaegory = false;
            for (let k = i + 1; k < data.length && !hasDuplicateWokerCtaegory; k++) {
                if (data[i].text === data[k].text) hasDuplicateWokerCtaegory = true;
            }
            if (hasDuplicateWokerCtaegory) {
                AppStore.showError("配置系数不允许有重复的，请仔细检查");
                return;
            }
        }

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
                            showActionBar=''
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
                            showActionBar=''
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
                            showActionBar=''
                            showDelete={true}
                            showCreateNew={true}
                            minWidth={700}
                            createNew={this.handleCreateNew.bind(this)}
                            showSave={true}
                            saveData={this.saveData.bind(this)}
                        />
                    </Tabs.Pane>
                    <Tabs.Pane label="工资计算系数" name="ConfigPercentage">
                        <EmpDataGrid
                            columns={this.state.columns.ConfigPercentage}
                            rows={this.state.rows.ConfigPercentage}
                            rowKey="id"
                            showActionBar=''
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