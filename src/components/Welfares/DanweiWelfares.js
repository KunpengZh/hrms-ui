import React, { Component } from 'react';
import './Welfares.css';
import { Loading,Button, Upload, Select, Form } from 'element-react';
import ReactDataGrid from 'react-data-grid'
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
            curYearMonth: '',
            availableSalaryCycles: AppStore.getYearMonthPeriod(),
            query: {
                startSalaryCycle: 'All',
                endSalaryCycle: 'All',
            },
            downloadLink: "#",
            selectedIndexes: [],
            originalRows: [],
            appUserRole: AppStore.getAppUerRole()
        }
        this.selectedKeys = [];
        this.newCreatedKey = [];
        this.updatedKey = [];
        this.deletedKey = [];
    }
    componentDidMount() {
        let nstate = Object.assign({}, this.state);
        //if (nstate.curYearMonth === "") nstate.curYearMonth = nstate.YearMonthPeriod[0].value;
        if (nstate.curYearMonth === "") nstate.curYearMonth = nstate.availableSalaryCycles[0].value;
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

    handleQuery() {
        let query = {};
        if (this.state.query.startSalaryCycle !== 'All' && this.state.query.startSalaryCycle !== '') query.startSalaryCycle = this.state.query.startSalaryCycle;
        if (this.state.query.endSalaryCycle !== 'All' && this.state.query.endSalaryCycle !== '') query.endSalaryCycle = this.state.query.endSalaryCycle;


        if (JSON.stringify(query) === '{}') {
            AppStore.showError("请先选择查询条件！！！");
            return;
        }
        this.setState({ fullscreen: true });
        AppStore.queryDanweiWelfaresByCriteria(query).then((weldata) => {

            if (weldata.status === 200) {
                this.setState({
                    rows: weldata.data,
                    fullscreen: false,
                    downloadLink: AppStore.getPreHostURLLink() + '/danweiwelfares/download?criteria=' + JSON.stringify(query)
                })
                AppStore.showSuccess("成功")
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(weldata.message)
            }
        })
    }

    handleCreateNew() {
        let rowKey = this.state.rowKey;
        let newRow = {
            id: '',
            salaryCycle: this.state.curYearMonth,
            Shitangjingfei: 0,
            CompanyQitafuli: 0
        };

        let rows = this.state.rows.slice();
        rows.push(newRow);

        this.newCreatedKey.push(newRow[rowKey]);
        this.setState({ rows });
    }


    onRowsSelected(rows) {
        let rowKey = this.state.rowKey;
        this.selectedKeys = this.selectedKeys.concat(rows.map(r => r.row[rowKey]));
        this.setState({ selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx)) });
    }
    onRowsDeselected(rows) {
        let rowKey = this.state.rowKey;
        let rowIndexes = rows.map(r => r.rowIdx);
        let selKey = rows.map(r => r.row[rowKey]);
        this.selectedKeys = this.selectedKeys.filter(i => selKey.indexOf(i) === -1);
        this.setState({ selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1) });
    }
    rowGetter(i) {
        return this.state.rows[i];
    }
    handleGridRowsUpdated({ fromRow, toRow, updated }) {
        let rowKey = this.state.rowKey;
        let rows = this.state.rows.slice();



        let updatedRow = Object.assign(rows[fromRow], updated);
        rows[fromRow] = updatedRow;
        let updateKey = rows[fromRow][rowKey];
        if (this.updatedKey.indexOf(updateKey) < 0) this.updatedKey.push(updateKey);

        this.setState({ rows });
    }
    handleDelete() {
        var self = this;
        let rowKey = this.state.rowKey;
        let rows = this.state.rows.slice();
        this.selectedKeys.map(function (selIndex) {
            rows.forEach(function (row, rowIndex) {
                if (row[rowKey] === selIndex) {
                    rows.splice(rowIndex, 1);

                    self.deletedKey.push(selIndex);
                }
            });
        });
        this.setState({ rows });
    }
    handleSaveData() {
        let keysObj = {
            updated: this.updatedKey,
            newcreated: this.newCreatedKey,
            deleted: this.deletedKey
        }
        this.saveData(this.state.rows, keysObj);
    }
    handleGridSort(sortColumn, sortDirection) {
        const comparer = (a, b) => {
            if (sortDirection === 'ASC') {
                return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
            } else if (sortDirection === 'DESC') {
                return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
            }
        };

        const rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.state.rows.sort(comparer);

        this.setState({ rows });
    }
    handleStartSalaryCycleChange(value) {
        let query = this.state.query;
        query.startSalaryCycle = value;
        this.setState({ query: query });
    }
    handleEndSalaryCycleChange(value) {
        let query = this.state.query;
        query.endSalaryCycle = value;
        this.setState({ query: query });
    }

    render() {
        return (
            <div className="OTContainer">
                <div className="OTBodyContainer">
                    {
                        this.state.fullscreen && <Loading fullscreen={true} />
                    }
                    <div>
                        <Form labelWidth="50" style={{ textAlign: 'left' }}>
                            <Form.Item label="从:" style={{ display: "inline-block" }}>
                                <Select value={this.state.query.startSalaryCycle} onChange={this.handleStartSalaryCycleChange.bind(this)} style={{ width: "120px" }}>
                                    {
                                        this.state.availableSalaryCycles.map(el => {
                                            return <Select.Option key={el.value} label={el.label} value={el.value} />
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="到:" style={{ display: "inline-block" }}>
                                <Select value={this.state.query.endSalaryCycle} onChange={this.handleEndSalaryCycleChange.bind(this)} style={{ width: "120px" }}>
                                    {
                                        this.state.availableSalaryCycles.map(el => {
                                            return <Select.Option key={el.value} label={el.label} value={el.value} />
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item labelWidth="0" style={{ display: "inline-block" }}>
                                <Button type="primary" icon="search" onClick={this.handleQuery.bind(this)}>查询</Button>
                                <Button type="primary" icon="plus" onClick={this.handleCreateNew.bind(this)}>添加</Button>
                                <Button type="primary" icon="circle-check" onClick={this.handleSaveData.bind(this)}>保存</Button>
                                <Button type="primary" icon="delete" onClick={this.handleDelete.bind(this)}>删除</Button>
                                <div className="aToButton"><a className="linkButton" href={this.state.downloadLink + "&columns=" + JSON.stringify(this.state.columns)} target="_blank"><i className="el-icon-document"></i>下载</a></div>
                            </Form.Item>
                        </Form>

                    </div>
                    <div className="DataGridInfoTableContainer">
                        <ReactDataGrid
                            ref={node => this.grid = node}
                            rowKey={this.state.rowKey}
                            enableCellSelect={true}
                            columns={this.state.columns}
                            rowGetter={this.rowGetter.bind(this)}
                            rowsCount={this.state.rows.length}
                            minWidth={document.body.clientWidth - 50 < 1280 ? 1280 : document.body.clientWidth - 50}
                            minHeight={document.body.clientHeight - 150}
                            onGridRowsUpdated={this.handleGridRowsUpdated.bind(this)}
                            rowSelection={{
                                showCheckbox: true,
                                enableShiftSelect: true,
                                onRowsSelected: this.onRowsSelected.bind(this),
                                onRowsDeselected: this.onRowsDeselected.bind(this),
                                selectBy: {
                                    indexes: this.state.selectedIndexes
                                }
                            }}
                            onGridSort={this.handleGridSort.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default WelFaresComponent;



