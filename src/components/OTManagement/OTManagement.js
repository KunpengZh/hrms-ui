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

const ColumnKeysNeedValidate = ['NormalOT', 'WeekendOT', 'HolidayOT'];
const validateFailMsg = '加班只能填写小时数';

class EmpOT extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            fullscreen: true,
            columns: [],
            rowKey: 'empId',
            YearMonthPeriod: AppStore.getYearMonthPeriod(),
            curYearMonth:''
        }
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
                    },
                    {
                        key: 'name',
                        name: '员工姓名',
                        filterable: true
                    },
                    {
                        key: 'department',
                        name: '部门',
                        sortable: true
                    },
                    {
                        key: 'jobRole',
                        name: '岗位',
                        sortable: true
                    },
                    {
                        key: 'workerCategory',
                        name: '员工类别',
                        sortable: true
                    },
                    {
                        key: 'OTCycle',
                        name: '加班周期',
                    },
                    {
                        key: 'NormalOT',
                        name: '平时加班',
                        editable: true,
                    },
                    {
                        key: 'WeekendOT',
                        name: '周末加班',
                        editable: true,
                    },
                    {
                        key: 'HolidayOT',
                        name: '节假日加班',
                        editable: true,
                    },
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

    handleYearMonthChange(value) {
        this.setState({curYearMonth:value});
    }
    handleLoading(){
        this.setState({ fullscreen: true });
        AppStore.getOTByCycle(this.state.curYearMonth).then((OTs) => {
            
            if(OTs.status===200){
                this.setState({
                    rows:OTs.data,
                    fullscreen: false
                })
                AppStore.showSuccess("成功")
            }else{
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
                        downloadLink={AppStore.getPreHostURLLink() +'/ot/downloadot?OTCycle='+this.state.curYearMonth}
                        minWidth={2000}
                        ColumnKeysNeedValidate={ColumnKeysNeedValidate}
                        validateFailMsg={validateFailMsg}
                        showSync={true}
                        handleSync={this.handleSync.bind(this)}
                        syncButtonText={'初始化加班数据'}
                        showSelectMenu={true}
                        selectMenuOptions={this.state.YearMonthPeriod}
                        handleSelectMenuChange={this.handleYearMonthChange.bind(this)}
                        selectMenuSelectedItem={this.state.curYearMonth}
                        showLoading={true}
                        handleLoading={this.handleLoading.bind(this)}
                        loadingText={"显示所选月份数据"}
                    />
                </div>
            </div>
        );
    }
}

export default EmpOT;