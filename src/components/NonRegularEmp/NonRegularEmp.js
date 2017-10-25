import React, { Component } from 'react';
import './NonRegularEmp.css';
import { Loading } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';
import DataGrid from '../DataGrid/DataGrid';

import ReactDataGrid from 'react-data-grid'

const ColumnKeysNeedValidate = ['daySalary', 'workDays', 'anquanJiangli', 'wuweizhangJiangli', 'OTJiangjin'];
const validateFailMsg = '只能填写数字';

class NonRegularSalary extends Component {
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
        AppStore.getNRByCycle(nstate.curYearMonth).then((data) => {
            if (data.status === 200) {
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
                        key: 'salaryCycle',
                        name: '工资周期',
                        width:100
                    },
                    {
                        key: 'daySalary',
                        name: '日工资',
                        editable: true,
                        width:100
                    },
                    {
                        key: 'workDays',
                        name: '工作天数',
                        editable: true,
                        width:100
                    },
                    {
                        key: 'anquanJiangli',
                        name: '安全奖励',
                        editable: true,
                        width:100
                    },
                    {
                        key: 'wuweizhangJiangli',
                        name: '无违章奖励',
                        editable: true,
                        width:100
                    },
                    {
                        key: 'OTJiangjin',
                        name: '加班奖金',
                        editable: true,
                        width:100
                    },
                ]
                nstate.rows = data.data;
                nstate.fullscreen = false;
                this.setState(nstate);
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(data.message);
            }
        })
    }
    handleSync() {
        console.log("am I executed")
        this.setState({ fullscreen: true });
        AppStore.initialNRByCycle(this.state.curYearMonth).then((res) => {
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

        AppStore.deleteNRSalaryData(deleted, this.state.curYearMonth).then(res => {
            console.log(res);
            if (res.status === 700) {

            } else if (res.status === 200) {
                AppStore.showInfo("删除成功");
            } else {
                AppStore.showError("更新成功");
            }
        }).then(() => {
            AppStore.updateNRSalaryData(data, this.state.curYearMonth).then((res) => {
                if(res.status===200){
                    AppStore.showSuccess("更新成功");
                }else{
                    AppStore.showError(res.message);
                }
               
            });
        })
    }
    handleQuery(criteria) {
        
        this.setState({ fullscreen: true });
        AppStore.queryNRByCriteria(criteria).then((data) => {

            if (data.status === 200) {
                this.setState({
                    rows: data.data,
                    fullscreen: false
                })
                AppStore.showSuccess("成功")
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(data.message)
            }
        })
    }

    render() {
        return (
            <div className="NRContainer">
                <div className="NRBodyContainer">
                    {
                        this.state.fullscreen && <Loading fullscreen={true} />
                    }
                    <DataGrid
                        columns={this.state.columns}
                        rows={this.state.rows}
                        rowsCount={this.state.rows.length}
                        rowKey={this.state.rowKey}
                        showActionBar=''
                        showDelete={true}
                        showCreateNew={false}
                        showSave={true}
                        saveData={this.saveData.bind(this)}
                        showUploader={true}
                        uploadLink={'/nonregular/upload'}
                        showDownload={true}
                        downloadLink={AppStore.getPreHostURLLink() + '/nonregular/download?salaryCycle=' + this.state.curYearMonth}
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

export default NonRegularSalary;