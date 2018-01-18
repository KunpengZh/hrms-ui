import React, { Component } from 'react';
import './DanweiWelfares.css';
import { Loading } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';
import DataGrid from '../DataGrid/DataGrid';

//import ReactDataGrid from 'react-data-grid'
// const { Editors, Formatters } = require('react-data-grid-addons');
// const { DropDownEditor } = Editors;
// const { DropDownFormatter } = Formatters;

const ColumnKeysNeedValidate = ["Shitangjingfei", "CompanyQitafuli"];
const validateFailMsg = '只能填写数字';

class WelFaresComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            fullscreen: true,
            columns: [],
            rowKey: 'id',
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
        AppStore.getDanweiWelfaresAll().then((welfares) => {
            if (welfares.status === 200) {
                nstate.columns = [
                    {
                        key: 'id',
                        name: 'ID',
                        width: 100
                    },
                    {
                        key: 'salaryCycle',
                        name: '福利周期',
                        width: 100,
                        editable: 'true'
                    },

                    { name: '食堂经费', key: 'Shitangjingfei', editable: 'true', width: 100 },

                    { name: '单位其它福利', key: 'CompanyQitafuli', editable: 'true', width: 100 }
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
            if (newCreatedEmpIds.indexOf(employee.id) >= 0 || updatedEmpIds.indexOf(employee.id) >= 0) changedData.push(employee)
        });

        if (changedData.length > 0) {
            AppStore.updateDanweiWelfaresData(changedData).then((res) => {
                AppStore.showInfo(res.message);
            });
        }

        if (deletedEmpIds.length > 0) {
            AppStore.deleteDanweiWelfaresData(deletedEmpIds).then(res => {
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
        AppStore.queryDanweiWelfaresByCriteria(criteria).then((weldata) => {

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
        let self=this;
        return new Promise(function (rel, rej) {
            rel({
                id: '',
                salaryCycle: self.state.curYearMonth,
                Shitangjingfei: 0,
                CompanyQitafuli: 0
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
                        showSync={false}
                        showActionBar=''
                        showDelete={true}
                        showCreateNew={true}
                        createNew={this.handleCreateNew.bind(this)}
                        showSave={true}
                        saveData={this.saveData.bind(this)}
                        showUploader={false}
                        uploadLink={''}
                        showDownload={false}
                        downloadLink={''}
                        minWidth={1000}
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



