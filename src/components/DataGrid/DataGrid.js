import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid'
import { Button, Upload, Select } from 'element-react';
import 'element-theme-default';
import './DataGrid.css';
import 'bootstrap/dist/css/bootstrap.css';
import AppStore from '../../share/AppStore';

class DataGrid extends Component {
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
            selectMenu: ''
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
    componentWillReceiveProps(newProps) {
        let nstate = {
            originalRows: Object.assign([], newProps.rows),
            rows: newProps.rows,
            _columns: newProps.columns,
            selectedIndexes: [],
            selectedKeys: [],
            rowKey: newProps.rowKey ? newProps.rowKey : 'id',
            selectMenu: newProps.selectMenuSelectedItem
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

        let validationPass = true;
        for (let key in updated) {
            let ColumnKeysNeedValidate = this.props.ColumnKeysNeedValidate;
            if (ColumnKeysNeedValidate && ColumnKeysNeedValidate.indexOf(key) >= 0) {
                validationPass = this._validateOnlyNumber(updated[key]);
            }
            let ColumnKeyNeedDate = this.props.ColumnKeyNeedDate;
            if (ColumnKeyNeedDate && ColumnKeyNeedDate.indexOf(key) >= 0) {
                validationPass = this._isDate(updated[key]);
            }
            if (!validationPass) {
                this.setState({ rows });
                return;
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
    handleSync() {
        this.props.handleSync();
    }
    handleInit() {
        this.props.handleInit();
    }
    onCellSelected({ rowIdx, idx }) {
        //this.grid.openCellEditor(rowIdx, idx);
    }

    onCellDeSelected({ rowIdx, idx }) {

    }
    handleSelectMenuChange(value) {
        this.props.handleSelectMenuChange(value);
    }
    onUploadSuccess(res) {
        AppStore.showSuccess(res.message);
    }
    handleFunc1() {
        this.props.handleFunc1();
    }
    render() {

        return (
            <div className="DataGrid">
                <div className="topMenuContainer" style={{ 'display': this.props.showActionBar }}>
                    {this.props.showSelectMenu ? (
                        <Select value={this.state.selectMenu} onChange={this.handleSelectMenuChange.bind(this)} style={{ marginRight: "20px" }}>
                            {
                                this.props.selectMenuOptions.map(el => {
                                    return <Select.Option key={el.value} label={el.label} value={el.value} />
                                })
                            }
                        </Select>
                    ) : (null)}
                    {this.props.showLoading ? (<Button type="primary" icon="view" onClick={this.props.handleLoading}>{this.props.loadingText}</Button>) : (null)}
                    {this.props.showInit ? (<Button type="primary" icon="circle-check" onClick={this.handleInit.bind(this)}>{this.props.initButtonText}</Button>) : (null)}
                    {this.props.showSync ? (<Button type="primary" icon="circle-check" onClick={this.handleSync.bind(this)}>{this.props.syncButtonText}</Button>) : (null)}
                    {this.props.showDownload ? (<div className="aToButton"><a className="linkButton" href={this.props.downloadLink} target="_blank"><i className="el-icon-document"></i>点击下载</a></div>) : (null)}
                    {this.props.showCreateNew ? (<Button type="primary" icon="plus" onClick={this.handleAddRow.bind(this)}>添加</Button>) : (null)}
                    {this.props.showDelete ? (<Button type="primary" icon="delete" onClick={this.handleDelete.bind(this)}>删除</Button>) : (null)}
                    {this.props.showSave ? (<Button type="primary" icon="circle-check" onClick={this.handleSaveData.bind(this)}>保存</Button>) : (null)}
                    {this.props.showUploader ? (
                        <Upload
                            className="FileUPloader"
                            action={this.props.uploadLink}
                            multiple={false}
                            showFileList={false}
                            onSuccess={this.onUploadSuccess.bind(this)}
                        >
                            <Button icon="upload" type="primary">点击上传</Button>
                        </Upload>
                    ) : (null)}
                    {this.props.showFunc1 ? (<Button type="primary" icon="menu" onClick={this.handleFunc1.bind(this)} style={{ marginRight: "20px", marginLeft: "20px" }}>{this.props.Func1Text}</Button>) : (null)}
                    {this.props.showDownloadTable?(<div className="aToButton"><a className="linkButton" href={this.props.downloadTableLink} target="_blank"><i className="el-icon-document"></i>下载表格</a></div>):(null)}
                </div>

                <div className="DataGridInfoTableContainer">
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
                            showCheckbox: (this.props.enableCheckBox === true || this.props.enableCheckBox === undefined) ? true : false,
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

export default DataGrid;

// minHeight={this.props.minHeight ? this.props.minHeight : (document.body.clientHeight - 150)}