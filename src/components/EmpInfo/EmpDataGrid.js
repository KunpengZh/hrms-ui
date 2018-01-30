import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid'
import { Button, Upload, Select, Form, } from 'element-react';
import 'element-theme-default';
import './Employee.css';
import 'bootstrap/dist/css/bootstrap.css';
import AppStore from '../../share/AppStore';



class ConfigGrid extends Component {
    constructor(props) {
        super(props)
        // this._columns.push(
        //     {
        //         name: 'Actions',
        //         key: 'id',
        //         getRowMetaData: (row) => row,
        //         formatter: ({ dependentValues }) => (
        //             <Button type="danger" size="mini" onClick={() => this.deleteRows(dependentValues.id)}>x</Button>
        //         //   <span>
        //         //     <a href="javascript:;" onClick={() => this.deleteRows(dependentValues.id)}>Delete</a>
        //         //   </span>
        //         ),
        //       }
        // )
        this.state = {
            rows: [],
            _columns: [],
            selectedIndexes: [],
            rowKey: props.rowKey ? props.rowKey : 'id',
            originalRows: [],
            filters: {},
            department: [],
            jobRole: [],
            workerCategory: [],
            query: {
                department: 'All',
                jobRole: 'All',
                workerCategory: 'All',
                empStatus: 'Active'
            },
            appUserRole: AppStore.getAppUerRole()
        };
        this.selectedKeys = [];
        this.newCreatedKey = [];
        this.updatedKey = [];
        this.deletedKey = [];
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
    componentDidMount() {
        AppStore.getAllAvailableSalaryCycle().then(res => {
            let nstate = Object.assign({}, this.state);
            if (res.status === 200) {
                nstate.department = res.data.department;
                nstate.jobRole = res.data.jobRole;
                nstate.workerCategory = res.data.workerCategory;
                nstate.fullscreen = false;
                this.setState(nstate);
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(res.message);
            }
        })

    }
    componentWillReceiveProps(newProps) {
        let nstate = {
            originalRows: Object.assign([], newProps.rows),
            rows: newProps.rows,
            _columns: newProps.columns,
            selectedIndexes: [],
            selectedKeys: [],
            rowKey: newProps.rowKey ? newProps.rowKey : 'id',
        };
        this.setState(nstate);
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

    _validateOnlyNumber(text) {
        if (text.trim() == "") return true;
        let numbers = '0123456789.';
        let validate = true;
        for (var i = 0; i < text.length && validate; i++) {
            if (numbers.indexOf(text[i]) < 0) {
                AppStore.showError(this.props.validateFailMsg)
                validate = false;
                break;
            }
        }
        return validate;
    }
    _isDate(dateString) {
        if (dateString.trim() == "") return true;
        var r = dateString.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if (r == null) {
            AppStore.showError(this.props.validateDateFailMsg)
            return false;
        }
        var d = new Date(r[1], r[3] - 1, r[4]);
        var num = (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
        if (num == 0) {
            AppStore.showError(this.props.validateDateFailMsg)
            return false
        }
        return true;
    }

    handleGridRowsUpdated({ fromRow, toRow, updated }) {
        let rowKey = this.state.rowKey;
        let rows = this.state.rows.slice();
        let ColumnKeysNeedValidate = this.props.ColumnKeysNeedValidate;
        let ColumnKeyNeedDate = this.props.ColumnKeyNeedDate;
        let validationPass = true;

        for (let key in updated) {
            if (ColumnKeysNeedValidate && ColumnKeysNeedValidate.indexOf(key) >= 0) {
                validationPass = this._validateOnlyNumber(updated[key]);
            }

            if (ColumnKeyNeedDate && ColumnKeyNeedDate.indexOf(key) >= 0) {
                validationPass = this._isDate(updated[key]);
            }
            if (!validationPass) {
                this.setState({ rows });
                return;
            }
        }


        if (this.props.ColumnsNotEditableForNonRegularEmp && this.props.ColumnsNotEditableForNonRegularEmp.length > 0) {
            if (rows[fromRow].workerCategory === this.props.NonRegularEmployeeCategory) {
                let haveFailedItem = false;
                this.props.ColumnsNotEditableForNonRegularEmp.forEach(function (propName) {
                    for (let key in updated) {
                        if (key === propName) {
                            updated[propName] = "";
                            haveFailedItem = true;
                        }
                    }
                });
                if (haveFailedItem) {
                    AppStore.showError("对于非全日制的员工来说，这些项目不能编辑");
                    this.setState({ rows });
                    return;
                }
            }
        }


        let updatedRow = Object.assign(rows[fromRow], updated);
        rows[fromRow] = updatedRow;
        let updateKey = rows[fromRow][rowKey];
        if (this.updatedKey.indexOf(updateKey) < 0) this.updatedKey.push(updateKey);

        // for (let i = fromRow; i <= toRow; i++) {
        //     let rowToUpdate = rows[i];
        //     let updatedRow = Object.assign(rowToUpdate, updated);
        //     rows[i] = updatedRow;

        //     let updateKey = rows[i][rowKey];
        //     if (this.updatedKey.indexOf(updateKey) < 0) this.updatedKey.push(updateKey);
        // }
        this.setState({ rows });
    }
    handleAddRow() {
        let rowKey = this.state.rowKey;
        this.props.createNew().then((newRow) => {
            let rows = this.state.rows.slice();
            rows.push(newRow);

            this.newCreatedKey.push(newRow[rowKey]);

            this.setState({ rows });
        });
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
        this.props.saveData(this.state.rows, keysObj);
    }
    handleSyncEmpInfo() {
        this.props.handleSyncEmpInfo();
    }
    onCellSelected({ rowIdx, idx }) {
        //this.grid.openCellEditor(rowIdx, idx);
    }

    onCellDeSelected({ rowIdx, idx }) {

    }

    handleWokerCategoryChange(value) {
        let query = this.state.query;
        query.workerCategory = value;
        this.setState({ query: query });
    }
    handleDepartmentChange(value) {
        let query = this.state.query;
        query.department = value;
        this.setState({ query: query });
    }
    handleJobRoleChange(value) {
        let query = this.state.query;
        query.jobRole = value;
        this.setState({ query: query });
    }
    handleEmpStatusChange(value) {
        let query = this.state.query;
        query.empStatus = value;
        this.setState({ query: query });
    }
    handleQuery() {
        let query = {};
        if (this.state.query.workerCategory !== 'All' && this.state.query.workerCategory !== '') query.workerCategory = this.state.query.workerCategory;
        if (this.state.query.department !== 'All' && this.state.query.department !== '') query.department = this.state.query.department;
        if (this.state.query.jobRole !== 'All' && this.state.query.jobRole !== '') query.jobRole = this.state.query.jobRole;
        if (this.state.query.empStatus !== 'All' && this.state.query.empStatus !== '') query.empStatus = this.state.query.empStatus;

        this.props.handleQuery(query).then(res => {
            if (res.status === 200) {
                let nstate = {
                    originalRows: Object.assign([], res.data),
                    rows: res.data,
                    selectedIndexes: [],
                    selectedKeys: []
                };
                this.setState(nstate);
            }
        })
    }
    handleUploadSuccess(res) {
        console.log(res);
        if (res.message) {
            AppStore.showInfo(res.message);
        }
    }
    render() {
        let self = this;
        return (
            <div className="EmpDataGrid">
                <div style={{ 'display': this.props.showActionBar, 'marginBottom': '5px' }}>
                    <Form labelWidth="50" style={{ textAlign: 'left' }}>
                        {this.props.showFilters ? (
                            <Form.Item label="在职:" style={{ display: "inline-block", paddingLeft: "5px" }}>
                                <Select value={this.state.query.empStatus} onChange={this.handleEmpStatusChange.bind(this)} style={{ width: "120px" }}>
                                    <Select.Option key="在职员工" label="在职员工" value="Active" />
                                    <Select.Option key="离职员工" label="离职员工" value="InActive" />
                                    <Select.Option key="退休员工" label="退休员工" value="Retire" />
                                    <Select.Option key="全部员工" label="全部员工" value="All" />
                                </Select>
                            </Form.Item>
                        ) : (null)}
                        {this.props.showFilters ? (
                            <Form.Item label="部门:" style={{ display: "inline-block", paddingLeft: "5px" }}>
                                <Select value={this.state.query.department} onChange={this.handleDepartmentChange.bind(this)} style={{ width: "120px" }}>
                                    {
                                        this.state.department.map(el => {
                                            return <Select.Option key={el.value} label={el.label} value={el.value} />
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        ) : (null)}
                        {this.props.showFilters ? (
                            <Form.Item label="岗位:" style={{ display: "inline-block", paddingLeft: "5px" }}>
                                <Select value={this.state.query.jobRole} onChange={this.handleJobRoleChange.bind(this)} style={{ width: "120px" }}>
                                    {
                                        this.state.jobRole.map(el => {
                                            return <Select.Option key={el.value} label={el.label} value={el.value} />
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        ) : (null)}
                        {this.props.showFilters ? (
                            <Form.Item label="类别:" style={{ display: "inline-block", paddingLeft: "5px" }}>
                                <Select value={this.state.query.workerCategory} onChange={this.handleWokerCategoryChange.bind(this)} style={{ width: "120px" }}>
                                    {
                                        this.state.workerCategory.map(el => {
                                            return <Select.Option key={el.value} label={el.label} value={el.value} />
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        ) : (null)}
                        <Form.Item labelWidth="0" style={{ display: "inline-block" }}>
                            <Button type="primary" icon="search" onClick={this.handleQuery.bind(this)}>查询</Button>
                            {this.props.showDownload ? (<div className="aToButton"><a className="linkButton" href={this.props.downloadLink} target="_blank"><i className="el-icon-document"></i>点击下载</a></div>) : (null)}
                            {this.props.showCreateNew && this.state.appUserRole!=="ReadOnlyUser"? (<Button type="primary" icon="plus" onClick={this.handleAddRow.bind(this)}>添加</Button>) : (null)}
                            {this.props.showDelete && this.state.appUserRole!=="ReadOnlyUser"? (<Button type="primary" icon="delete" onClick={this.handleDelete.bind(this)}>删除</Button>) : (null)}
                            {this.props.showSave && this.state.appUserRole!=="ReadOnlyUser"? (<Button type="primary" icon="circle-check" onClick={this.handleSaveData.bind(this)}>保存</Button>) : (null)}
                            {this.props.showSyncEmpInfo && this.state.appUserRole!=="ReadOnlyUser"? (<Button type="primary" icon="circle-check" onClick={this.handleSyncEmpInfo.bind(this)}>同步</Button>) : (null)}
                            {this.props.showUploader && this.state.appUserRole!=="ReadOnlyUser" ? (
                                <Upload
                                    className="FileUPloader"
                                    action={this.props.uploadLink}
                                    multiple={false}
                                    showFileList={false}
                                    onSuccess={this.handleUploadSuccess.bind(this)}
                                >
                                    <Button icon="upload" type="primary">点击上传</Button>
                                </Upload>
                            ) : (null)}
                        </Form.Item>
                    </Form>


                </div>

                <div className="EmpInfoTableContainer">
                    <ReactDataGrid
                        ref={node => this.grid = node}
                        rowKey={this.state.rowKey}
                        enableCellSelect={true}
                        columns={this.state._columns}
                        rowGetter={this.rowGetter.bind(this)}
                        rowsCount={this.state.rows.length}
                        minWidth={this.props.minWidth ? this.props.minWidth : (document.body.clientWidth - 50 < 1280 ? 1280 : document.body.clientWidth - 50)}
                        minHeight={this.props.minHeight ? this.props.minHeight : (document.body.clientHeight - 150)}
                        onGridRowsUpdated={this.handleGridRowsUpdated.bind(this)}
                        rowSelection={{
                            showCheckbox: (self.props.enableCheckBox === true || self.props.enableCheckBox === undefined) ? true : false,
                            enableShiftSelect: true,
                            onRowsSelected: this.onRowsSelected.bind(this),
                            onRowsDeselected: this.onRowsDeselected.bind(this),
                            selectBy: {
                                indexes: this.state.selectedIndexes
                            }
                        }}
                        onGridSort={this.handleGridSort.bind(this)}
                        onCellSelected={this.onCellSelected}
                        onCellDeSelected={this.onCellDeSelected}
                    />
                </div>
            </div>
        );
    }
};

export default ConfigGrid;

// minHeight={this.props.minHeight ? this.props.minHeight : (document.body.clientHeight - 150)}

// {this.props.showDownload ? (<div className="aToButton"><a className="linkButton" href={this.props.downloadLink} target="_blank"><i className="el-icon-document"></i>点击下载</a></div>) : (null)}
// {this.props.showCreateNew ? (<Button type="primary" icon="plus" onClick={this.handleAddRow.bind(this)}>添加</Button>) : (null)}
// {this.props.showDelete ? (<Button type="primary" icon="delete" onClick={this.handleDelete.bind(this)}>删除</Button>) : (null)}
// {this.props.showSave ? (<Button type="primary" icon="circle-check" onClick={this.handleSaveData.bind(this)}>保存</Button>) : (null)}
// {this.props.showSyncEmpInfo ? (<Button type="primary" icon="circle-check" onClick={this.handleSyncEmpInfo.bind(this)}>同步</Button>) : (null)}
// {this.props.showUploader ? (
//     <Upload
//         className="FileUPloader"
//         action={this.props.uploadLink}
//         multiple={false}
//         showFileList={false}
//     >
//         <Button icon="upload" type="primary">点击上传</Button>
//     </Upload>
// ) : (null)}

{/* <Form.Item style={{ display: "inline-block" }}>
                            <Button type="primary" onClick={this.handleQuery.bind(this)}>查询</Button>
                        </Form.Item>
                        {this.props.showDownload ? (<Form.Item style={{ display: "inline-block" }}><div className="aToButton"><a className="linkButton" href={this.props.downloadLink} target="_blank"><i className="el-icon-document"></i>点击下载</a></div></Form.Item>) : (null)}
                        {this.props.showCreateNew ? (<Form.Item style={{ display: "inline-block" }}><Button type="primary" icon="plus" onClick={this.handleAddRow.bind(this)}>添加</Button></Form.Item>) : (null)}
                        {this.props.showDelete ? (<Form.Item style={{ display: "inline-block" }}><Button type="primary" icon="delete" onClick={this.handleDelete.bind(this)}>删除</Button></Form.Item>) : (null)}
                        {this.props.showSave ? (<Form.Item style={{ display: "inline-block" }}><Button type="primary" icon="circle-check" onClick={this.handleSaveData.bind(this)}>保存</Button></Form.Item>) : (null)}
                        {this.props.showSyncEmpInfo ? (<Form.Item style={{ display: "inline-block" }}><Button type="primary" icon="circle-check" onClick={this.handleSyncEmpInfo.bind(this)}>同步</Button></Form.Item>) : (null)}
                        {this.props.showUploader ? (
                            <Form.Item style={{ display: "inline-block" }}>
                                <Upload
                                    className="FileUPloader"
                                    action={this.props.uploadLink}
                                    multiple={false}
                                    showFileList={false}
                                >
                                    <Button icon="upload" type="primary">点击上传</Button>
                                </Upload>
                            </Form.Item>
                        ) : (null)} */}