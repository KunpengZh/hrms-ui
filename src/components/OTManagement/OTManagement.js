import React, { Component } from 'react';
import './OTManagemetn.css';
import { Loading } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';
import DataGrid from '../DataGrid/DataGrid';

import ReactDataGrid from 'react-data-grid'
// const { Editors, Formatters } = require('react-data-grid-addons');
// const { DropDownEditor } = Editors;
// const { DropDownFormatter } = Formatters;

const ColumnKeysNeedValidate = ['NormalOT', 'WeekendOT', 'HolidayOT', 'kouchu', 'kaohekoukuan', 'yiliaobaoxian', 'yicixingjiangjin'];
const validateFailMsg = '只能填写数字';

class EmpOT extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            fullscreen: true,
            columns: [],
            rowKey: 'empId',
            YearMonthPeriod: AppStore.getYearMonthPeriod(),
            curYearMonth: ''
        }
    }
    handleSalaryCycleChange(value) {
        this.setState({ curYearMonth: value });
    }
    componentDidMount() {
        let nstate = Object.assign({}, this.state);
        if (nstate.curYearMonth === "") nstate.curYearMonth = nstate.YearMonthPeriod[0].value;
        AppStore.getOTByCycle(nstate.curYearMonth).then((OTs) => {
            if (OTs.status === 200) {
                nstate.columns = [
                    {
                        key: 'empId',
                        name: '员工号',
                        sortable: true,
                        width:100
                    },
                    {
                        key: 'name',
                        name: '员工姓名',
                        filterable: true,
                        width:100
                    },
                    {
                        key: 'department',
                        name: '部门',
                        sortable: true,
                        width:100
                    },
                    {
                        key: 'jobRole',
                        name: '岗位',
                        sortable: true,
                        width:100
                    },
                    {
                        key: 'workerCategory',
                        name: '员工类别',
                        sortable: true,
                        width:150
                    },
                    {
                        key: 'OTCycle',
                        name: '加班周期',
                        width:100
                    },
                    {
                        key: 'NormalOT',
                        name: '平时加班(小时数)',
                        editable: true,
                        width:150
                    },
                    {
                        key: 'WeekendOT',
                        name: '周末加班(小时数)',
                        editable: true,
                        width:150
                    },
                    {
                        key: 'HolidayOT',
                        name: '节假日加班(小时数)',
                        editable: true,
                        width:150
                    },
                    { key: 'kouchu', name: '扣除项', width: 100, editable: 'true' },
                    { key: 'kaohekoukuan', name: '考核扣款', width: 100, editable: 'true' },
                    { key: 'yiliaobaoxian', name: '医疗保险', width: 100, editable: 'true' },
                    { key: 'yicixingjiangjin', name: '年终奖金', width: 100, editable: 'true' }
                ]
                nstate.rows = OTs.data;
                nstate.fullscreen = false;
                this.setState(nstate);
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(OTs.message);
            }
        })
    }
    handleSync() {
        this.setState({ fullscreen: true });
        AppStore.initialOTByCycle(this.state.curYearMonth).then((res) => {
            this.setState({ fullscreen: false });
            if (res.status === 200) {
                this.setState({ rows: res.data });
            } else {
                AppStore.showError(res.message);
            }
        })
    }

    saveData(data, keysObj) {
        let { newcreated, deleted, updated } = keysObj;
        let newCreatedKeys = [], deletedKeys = [], updatedKeys = [];
        AppStore.deleteEmpOTData(deleted, this.state.curYearMonth).then(res => {
            if (res.status === 700) {

            } else if (res.status === 200) {
                AppStore.showSuccess(res.message);
            } else {
                AppStore.showError(res.message);
            }
        }).then(() => {
            AppStore.updateEmpOTData(data, this.state.curYearMonth).then((res) => {
                AppStore.showInfo(res.message);
            });
        })
    }

    handleQuery(criteria) {
       
        this.setState({ fullscreen: true });
        AppStore.queryOTByCriteria(criteria).then((OTs) => {

            if (OTs.status === 200) {
                this.setState({
                    rows: OTs.data,
                    fullscreen: false
                })
                AppStore.showSuccess("成功")
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(OTs.message)
            }
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
                        showActionBar=''
                        showDelete={true}
                        showCreateNew={false}
                        showSave={true}
                        saveData={this.saveData.bind(this)}
                        showUploader={true}
                        uploadLink={'/ot/uploadot'}
                        showDownload={true}
                        downloadLink={AppStore.getPreHostURLLink() + '/ot/downloadot?OTCycle=' + this.state.curYearMonth}
                        minWidth={2000}
                        ColumnKeysNeedValidate={ColumnKeysNeedValidate}
                        validateFailMsg={validateFailMsg}
                        showSync={true}
                        handleSync={this.handleSync.bind(this)}
                        syncButtonText={'初始化'}
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

export default EmpOT;