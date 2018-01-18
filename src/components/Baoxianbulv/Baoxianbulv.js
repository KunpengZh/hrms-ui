import React, { Component } from 'react';
import './Baoxianbulv.css';
import { Loading } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';
import DataGrid from '../DataGrid/DataGrid';

//import ReactDataGrid from 'react-data-grid'
// const { Editors, Formatters } = require('react-data-grid-addons');
// const { DropDownEditor } = Editors;
// const { DropDownFormatter } = Formatters;

const ColumnKeysNeedValidate = [
    'nianjin',
    'yanglaobaoxian',
    'shiyebaoxian',
    'zhufanggongjijin',
    'yiliaobaoxian',
    'qiyeNianjin',
    'qiyeYanglaobaoxian',
    'qiyeShiyebaoxian',
    'qiyeZhufanggongjijin',
    'qiyeYiliaobaoxian',
    'buchongyiliaobaoxian',
    'shengyubaoxian',
    'gongshangbaoxian'];
const validateFailMsg = '只能填写数字';

class WelFaresComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            fullscreen: true,
            columns: [],
            rowKey: 'empId',
            YearMonthPeriod: AppStore.getYearMonthPeriod(),
            curYearMonth: '',
        }
    }
    handleSalaryCycleChange(value) {
        this.setState({ curYearMonth: value });
    }
    componentDidMount() {
        let nstate = Object.assign({}, this.state);
        if (nstate.curYearMonth === "") nstate.curYearMonth = nstate.YearMonthPeriod[0].value;
        AppStore.getBaoxianbulvByCycle(nstate.curYearMonth).then((welfares) => {
            if (welfares.status === 200) {
                nstate.columns = [
                    {
                        key: 'empId',
                        name: '员工号',
                        sortable: true,
                        editable: 'true',
                        width: 100
                    },
                    {
                        key: 'name',
                        name: '员工姓名',
                        filterable: true,
                        width: 100
                    },
                    {
                        key: 'department',
                        name: '部门',
                        sortable: true,
                        width: 100
                    },
                    {
                        key: 'jobRole',
                        name: '岗位',
                        sortable: true,
                        width: 100
                    },
                    {
                        key: 'workerCategory',
                        name: '员工类别',
                        sortable: true,
                        width: 150
                    },
                    {
                        key: 'salaryCycle',
                        name: '福利周期',
                        width: 100,
                        editable: 'true'
                    },
                    { name: '年金', key: 'nianjin', width: 100, editable: 'true' },
                    { name: '养老保险', key: 'yanglaobaoxian', width: 100, editable: 'true' },
                    { name: '失业保险', key: 'shiyebaoxian', width: 100, editable: 'true' },
                    { name: '住房公积金', key: 'zhufanggongjijin', width: 100, editable: 'true' },
                    { name: '医疗保险', key: 'yiliaobaoxian', width: 100, editable: 'true' },
                    { name: '企业年金', key: 'qiyeNianjin', width: 100, editable: 'true' },
                    { name: '企业养老保险', key: 'qiyeYanglaobaoxian', width: 100, editable: 'true' },
                    { name: '企业失业保险', key: 'qiyeShiyebaoxian', width: 100, editable: 'true' },
                    { name: '企业住房公积金', key: 'qiyeZhufanggongjijin', width: 100, editable: 'true' },
                    { name: '企业医疗保险', key: 'qiyeYiliaobaoxian', width: 100, editable: 'true' },
                    { name: '补充医疗保险', key: 'buchongyiliaobaoxian', width: 100, editable: 'true' },
                    { name: '生育保险', key: 'shengyubaoxian', width: 100, editable: 'true' },
                    { name: '工伤保险', key: 'gongshangbaoxian', width: 100, editable: 'true' },
                ]
                nstate.rows = welfares.data;
                nstate.fullscreen = false;
                this.setState(nstate);
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(welfares.message);
            }
        })
    }
    handleSync() {
        this.setState({ fullscreen: true });
        AppStore.initialBaoxianbulvByCycle(this.state.curYearMonth).then((res) => {

            if (res.status === 200) {

                let newrows = [];
                for (let i = 0; i < 10; i++) {

                    newrows.push(res.data[i]);
                };

                this.setState({
                    rows: newrows,
                    fullscreen: false
                });
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(res.message);
            }
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
            AppStore.updateBaoxianbulvData(changedData, this.state.curYearMonth).then((res) => {
                AppStore.showInfo(res.message);
            });
        }

        if (deletedEmpIds.length > 0) {
            AppStore.deleteBaoxianbulvData(deletedEmpIds, this.state.curYearMonth).then(res => {
                if (res.status === 700) {

                } else if (res.status === 200) {
                    AppStore.showSuccess(res.message);
                } else {
                    AppStore.showError(res.message);
                }
            })
        }
    }

    handleQuery(criteria) {

        this.setState({ fullscreen: true });
        AppStore.queryBaoxianbulvByCriteria(criteria).then((weldata) => {

            if (weldata.status === 200) {
                this.setState({
                    rows: weldata.data,
                    fullscreen: false
                })
                AppStore.showSuccess("成功")
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(weldata.message)
            }
        })
    }

    handleCreateNew() {
        return new Promise(function (rel, rej) {
            rel({
                empId: '',
                name: '',
                department: '',
                jobRole: '',
                workerCategory: '',
                salaryCycle: '',
                nianjin: 0,
                qiyeNianjin: 0,
                yanglaobaoxian: 0,
                qiyeYanglaobaoxian: 0,
                shiyebaoxian: 0,
                qiyeShiyebaoxian: 0,
                zhufanggongjijin: 0,
                qiyeZhufanggongjijin: 0,
                yiliaobaoxian: 0,
                qiyeYiliaobaoxian: 0,
                buchongyiliaobaoxian: 0,
                shengyubaoxian: 0,
                gongshangbaoxian: 0
            })
        })
    }


    render() {
        return (
            <div className="OTContainer">
                <div className="OTBodyContainer">
                    {
                        this.state.fullscreen && <Loading fullscreen={true} />
                    }
                    <DataGrid
                        columns={this.state.columns}
                        rows={this.state.rows}
                        rowKey={this.state.rowKey}
                        showSync={true}
                        handleSync={this.handleSync.bind(this)}
                        syncButtonText={'初始化'}
                        showActionBar=''
                        showDelete={true}
                        showCreateNew={true}
                        createNew={this.handleCreateNew.bind(this)}
                        showSave={true}
                        saveData={this.saveData.bind(this)}
                        showUploader={true}
                        uploadLink={'/bulv/uploadot'}
                        showDownload={true}
                        downloadLink={AppStore.getPreHostURLLink() + '/bulv/downloadwelbulvs?salaryCycle=' + this.state.curYearMonth}
                        minWidth={1500}
                        ColumnKeysNeedValidate={ColumnKeysNeedValidate}
                        validateFailMsg={validateFailMsg}
                        showSelectMenu={true}
                        salaryCycleOptions={this.state.YearMonthPeriod}
                        handleQuery={this.handleQuery.bind(this)}
                        salaryCycle={this.state.curYearMonth}
                        showQuery={true}
                        queryText={"显示"}
                        handleSalaryCycleChange={this.handleSalaryCycleChange.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

export default WelFaresComponent;



