import React, { Component } from 'react';
import './OTManagemetn.css';
import { Loading } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';
import DataGrid from '../DataGrid/DataGrid';

//import ReactDataGrid from 'react-data-grid'
// const { Editors, Formatters } = require('react-data-grid-addons');
// const { DropDownEditor } = Editors;
// const { DropDownFormatter } = Formatters;

const ColumnKeysNeedValidate = ['Yiliaofeiyong', 'Liaoyangfeiyong', 'Gongnuanbutie', 'Dushengzinv', 'Sangzangbuzhu', 'Fuxufei',
    'Fangshujiangwen', 'Shitangjingfei', 'Personalqitafuli', 'CompanyQitafuli'];
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
            curYearMonth: ''
        }
    }
    handleSalaryCycleChange(value) {
        this.setState({ curYearMonth: value });
    }
    componentDidMount() {
        let nstate = Object.assign({}, this.state);
        if (nstate.curYearMonth === "") nstate.curYearMonth = nstate.YearMonthPeriod[0].value;
        AppStore.getWelfaresByCycle(nstate.curYearMonth).then((welfares) => {
            if (welfares.status === 200) {
                nstate.columns = [
                    {
                        key: 'empId',
                        name: '员工号',
                        sortable: true,
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
                        width: 100
                    },
                    
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
        AppStore.initialWelfaresByCycle(this.state.curYearMonth).then((res) => {

            if (res.status === 200) {
                console.log(res.data);
                this.setState({
                    rows: res.data,
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
        let newCreatedKeys = [], deletedKeys = [], updatedKeys = [];
        AppStore.deleteWelfaresData(deleted, this.state.curYearMonth).then(res => {
            if (res.status === 700) {

            } else if (res.status === 200) {
                AppStore.showSuccess(res.message);
            } else {
                AppStore.showError(res.message);
            }
        }).then(() => {
            AppStore.updateWelfaresData(data, this.state.curYearMonth).then((res) => {
                AppStore.showInfo(res.message);
            });
        })
    }

    handleQuery(criteria) {

        this.setState({ fullscreen: true });
        AppStore.queryWelfaresByCriteria(criteria).then((weldata) => {

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
                        
                    />
                </div>
            </div>
        );
    }
}

export default WelFaresComponent;

// { name: '医疗费用', key: 'Yiliaofeiyong', editable: 'true', width: 100 },
//                     { name: '疗养费用', key: 'Liaoyangfeiyong', editable: 'true', width: 100 },
//                     { name: '供暖补贴', key: 'Gongnuanbutie', editable: 'true', width: 100 },
//                     { name: '独生子女费', key: 'Dushengzinv', editable: 'true', width: 100 },
//                     { name: '丧葬补助', key: 'Sangzangbuzhu', editable: 'true', width: 100 },
//                     { name: '抚恤费', key: 'Fuxufei', editable: 'true', width: 100 },
//                     { name: '防暑降温费', key: 'Fangshujiangwen', editable: 'true', width: 100 },
//                     { name: '食堂经费', key: 'Shitangjingfei', editable: 'true', width: 100 },
//                     { name: '个人其它福利', key: 'Personalqitafuli', editable: 'true', width: 100 },
//                     { name: '单位其它福利', key: 'CompanyQitafuli', editable: 'true', width: 100 }

// showActionBar=''
//                         showDelete={true}
//                         showCreateNew={false}
//                         showSave={true}
//                         saveData={this.saveData.bind(this)}
//                         showUploader={true}
//                         uploadLink={'/welfares/uploadot'}
//                         showDownload={true}
//                         downloadLink={AppStore.getPreHostURLLink() + '/welfares/downloadwelfares?salaryCycle=' + this.state.curYearMonth}
//                         minWidth={2500}
//                         ColumnKeysNeedValidate={ColumnKeysNeedValidate}
//                         validateFailMsg={validateFailMsg}
                       
//                         showSelectMenu={true}
//                         salaryCycleOptions={this.state.YearMonthPeriod}
//                         handleQuery={this.handleQuery.bind(this)}
//                         salaryCycle={this.state.curYearMonth}
//                         showQuery={true}
//                         queryText={"显示"}
//                         handleSalaryCycleChange={this.handleSalaryCycleChange.bind(this)}