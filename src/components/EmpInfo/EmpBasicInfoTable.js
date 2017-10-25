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

const ColumnKeysNeedValidate = [];
const validateFailMsg = '工龄, 年龄字段只能接受数字，请检查您是否在工龄或是年龄字段里输入的非数字字符';
const ColumnKeyNeedDate = ['entryTime', 'unEmpDate'];
const validateDateFailMsg = '您输入的出生日期字段不合法，请输入YYYY-MM-DD格式的日期';

class EmpBasicInfoTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            fullscreen: true,
            columns: [],
            rowKey: 'empId',
        }
    }

    componentDidMount() {
        let nstate = Object.assign({}, this.state);
        AppStore.getConfigData().then((configData) => {
            if (configData.status !== 200) AppStore.showError(configData.message);
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

            const EmployeementStatus = [{ id: '01', value: 'Active', text: '在职' }, { id: '02', value: 'InActive', text: '离职' }];
            const EmployeementStatusEditor = <DropDownEditor options={EmployeementStatus} />;
            const EmployeementStatusFormatter = <DropDownFormatter options={EmployeementStatus} value="value" />;
            nstate.columns = [
                {
                    key: 'empId',
                    name: '员工号',
                    sortable: true,
                    editable: false,
                    width:100
                },
                {
                    key: 'name',
                    name: '员工姓名',
                    editable: true,
                    width: 200,
                    sortable: true,
                    filterable: true,
                    width:100
                },
                {
                    key: 'workerCategory',
                    name: '员工类别',
                    editable: true,
                    editor: wcategoryEditor,
                    formatter: wcategoryFormatter,
                    sortable: true,
                    width:110
                },
                {
                    key: 'department',
                    name: '部门',
                    editable: true,
                    editor: DepartmentEditor,
                    formatter: DepartmentFormatter,
                    sortable: true,
                    width:100
                },
                {
                    key: 'jobRole',
                    name: '岗位',
                    editable: true,
                    editor: jobRolesEditor,
                    formatter: jobRolesFormatter,
                    sortable: true,
                    width:100
                },
                {
                    key: "entryTime",
                    name: "入职时间",
                    editable: true,
                    width:100
                },
                {
                    key: 'workAge',
                    name: '工龄',
                    editable: false,
                    width:80
                },
                {
                    key: 'gender',
                    name: '性别',
                    editable: true,
                    editor: gendersEditor,
                    formatter: gendersFormatter,
                    width:80
                },
                {
                    key: 'empStatus',
                    name: '是否在职',
                    editable: true,
                    editor: EmployeementStatusEditor,
                    formatter: EmployeementStatusFormatter,
                    width:100
                },
                {
                    key: 'unEmpDate',
                    name: '离职日期',
                    editable: true,
                    width:100
                },
                {
                    key: 'comment',
                    name: '备注',
                    editable: true,
                    width:200
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
                        workerCategory: '',
                        department: '',
                        jobRole: '',
                        entryTime: '',
                        workAge: '',
                        age: '',
                        gender: '',
                        comment: ''
                    };
                    rel(newRow);
                } else {
                    AppStore.showError(empId.message);
                }
            })

        })
    }
    saveData(data, keysObj) {
        let { newcreated, deleted, updated } = keysObj;
        let newCreatedEmpIds = [], deletedEmpIds = [], updatedEmpIds = [];

        newcreated.forEach(function (empId) {
            if (deleted.indexOf(empId) < 0) newCreatedEmpIds.push(empId);
        });

        updated.forEach(function (empId) {
            if (deleted.indexOf(empId) < 0 && newcreated.indexOf(empId) < 0) updatedEmpIds.push(empId);
        })

        deleted.forEach(function (empId) {
            if (newcreated.indexOf(empId) < 0) deletedEmpIds.push(empId);
        })

        let changedData = [];

        data.forEach(function (employee) {
            if (newCreatedEmpIds.indexOf(employee.empId) >= 0 || updatedEmpIds.indexOf(employee.empId) >= 0) changedData.push(employee)
        });


        if (changedData.length > 0) {
            AppStore.saveEmpBasicData(changedData).then((res) => {
                AppStore.showInfo(res.message);
            });
        }

        if (deletedEmpIds.length > 0) {
            AppStore.deleteEmpBasicData(deletedEmpIds).then((delres) => {
                AppStore.showInfo(delres.message);
            })
        }
    }
    _validateOnlyNumber(text) {
        let numbers = '0123456789.';
        let validate = true;
        for (var i = 0; i < text.length && validate; i++) {
            if (numbers.indexOf(text[i]) < 0) {
                AppStore.showError("工龄, 年龄字段只能接受数字，请检查您是否在工龄或是年龄字段里输入的非数字字符")
                validate = false;
                break;
            }
        }
        return validate;
    }
    _handleQuery(criteria) {
        return new Promise(function (rel, rej) {
            AppStore.queryEmpBasicDataByCriteria(criteria).then(res => {
                if (res.status === 200) {
                    rel(res);
                } else {
                    AppStore.showError(res.message);
                    rel(res);
                }
            })
        })
    }
    render() {
        return (
            <div className="EmpContainer">
                <div className="EmpBodyContainer">
                    {
                        this.state.fullscreen && <Loading fullscreen={true} />
                    }

                    <EmpDataGrid
                        columns={this.state.columns}
                        rows={this.state.rows}
                        rowKey={this.state.rowKey}
                        showActionBar=''
                        showDelete={true}
                        showCreateNew={true}
                        createNew={this.handleCreateNew.bind(this)}
                        showSave={true}
                        saveData={this.saveData.bind(this)}
                        showUploader={true}
                        uploadLink={'/emp/uploadempbasicinfo'}
                        showDownload={true}
                        downloadLink={AppStore.getPreHostURLLink() + '/emp/downloadempbasicinfo'}
                        ColumnKeysNeedValidate={ColumnKeysNeedValidate}
                        ColumnKeyNeedDate={ColumnKeyNeedDate}
                        validateDateFailMsg={validateDateFailMsg}
                        validateFailMsg={validateFailMsg}
                        enableCheckBox={true}
                        handleQuery={this._handleQuery.bind(this)}
                        showFilters={true}
                    />
                </div>
            </div>
        );
    }
}

export default EmpBasicInfoTable;