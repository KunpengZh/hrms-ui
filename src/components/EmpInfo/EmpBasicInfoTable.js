import React, { Component } from 'react';
import './Employee.css';
import { Loading } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';
import EmpDataGrid from './EmpDataGrid';

import ReactDataGrid from 'react-data-grid'
const { Editors, Formatters } = require('react-data-grid-addons');
const { DropDownEditor } = Editors;
const { DropDownFormatter } = Formatters;

class EmpBasicInfoTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            fullscreen: true,
            columns: [],
            rowKey: 'empId',
            cascaderMenu: []
        }
    }
    getCascaderMenu(data) {
        return [
            {
                value: "Dept",
                label: "部门",
                children: data.map((item) => {
                    return {
                        value: item.value,
                        label: item.value
                    }
                })
            }
        ]
    }
    componentDidMount() {
        let nstate = Object.assign({}, this.state);
        AppStore.getConfigData().then((configData) => {
            if (configData.status !== 200) AppStore.showError(configData.message);
            nstate.cascaderMenu = this.getCascaderMenu(configData.data.Department);
            const departments = configData.data.Department;
            const DepartmentEditor = <DropDownEditor options={departments} />;
            const DepartmentFormatter = <DropDownFormatter options={departments} value="value" />;
            const jobRoles = configData.data.JobRole;
            const jobRolesEditor = <DropDownEditor options={jobRoles} />;
            const jobRolesFormatter = <DropDownFormatter options={jobRoles} value="value" />;
            const genders = [{ id: '01', value: '男' }, { id: '02', value: '女' }];
            const gendersEditor = <DropDownEditor options={genders} />;
            const gendersFormatter = <DropDownFormatter options={genders} value="value" />;
            const wcategory = configData.data.WorkerCategory;
            const wcategoryEditor = <DropDownEditor options={wcategory} />;
            const wcategoryFormatter = <DropDownFormatter options={wcategory} value="value" />;
            nstate.columns = [
                {
                    key: 'empId',
                    name: '员工号',
                    editable: false,
                },
                {
                    key: 'name',
                    name: '员工姓名',
                    editable: true,
                },
                {
                    key: 'department',
                    name: '部门',
                    editable: true,
                    editor: DepartmentEditor,
                    formatter: DepartmentFormatter
                },
                {
                    key: 'jobRole',
                    name: '岗位',
                    editable: true,
                    editor: jobRolesEditor,
                    formatter: jobRolesFormatter
                },
                {
                    key: 'workAge',
                    name: '工龄',
                    editable: true,
                },
                {
                    key: 'age',
                    name: '年龄',
                    editable: true,
                },
                {
                    key: 'gender',
                    name: '性别',
                    editable: true,
                    editor: gendersEditor,
                    formatter: gendersFormatter
                },
                {
                    key: 'workerCategory',
                    name: '员工类别',
                    editable: true,
                    editor: wcategoryEditor,
                    formatter: wcategoryFormatter
                },
                {
                    key: 'comment',
                    name: '备注',
                    editable: true,
                },
            ]
        }).then(() => {
            AppStore.getAllEmpBasicInfo().then((employees) => {
                if (employees.status === 200) {
                    nstate.rows = employees.data;
                    nstate.fullscreen = false;
                    this.setState(nstate);
                } else {
                    this.setState({ fullscreen: false });
                    AppStore.showError(employees.message);
                }
            })
        })
    }
    handleCreateNew() {
        let self = this;
        return new Promise(function (rel, rej) {
            AppStore.getUnicKey("EmpID").then((empId) => {
                if (empId.status === 200) {
                    const newRow = {
                        empId: empId.data,
                        name: '',
                        department: '',
                        jobRole: '',
                        workAge: '',
                        age: '',
                        gender: '',
                        workerCategory: '',
                        comment: ''
                    };
                    rel(newRow);
                } else {
                    AppStore.showError(empId.message);
                }
            })

        })
    }
    saveData() {

    }
    // handleMenuActions(menuItem) {
    //     switch (menuItem) {
    //         case "CreateNew":
    //             this.props.history.push("/EmpBasicNew");
    //             break;
    //     }
    // }
    render() {
        console.log(this.state.cascaderMenu);
        return (
            <div className="EmpBodyContainer">
                {
                    this.state.fullscreen && <Loading fullscreen={true} />
                }
                {/* <div className="topMenuContainer">
                    <TopMenu handleMenuActions={this.handleMenuActions.bind(this)}/>
                </div> */}

                <EmpDataGrid
                    columns={this.state.columns}
                    rows={this.state.rows}
                    rowKey={this.state.rowKey}
                    showConfigActionBar='none'
                    showEmpBasicTableActionBar=''
                    showDelete={true}
                    showCreateNew={true}
                    createNew={this.handleCreateNew.bind(this)}
                    showSave={true}
                    saveData={this.saveData.bind(this)}
                    cascaderMenu={this.state.cascaderMenu}
                />
            </div>
        );
    }
}

export default EmpBasicInfoTable;