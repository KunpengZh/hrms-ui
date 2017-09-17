import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid'
import { Button, Upload } from 'element-react';
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
            filters: {}
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

    handleGridRowsUpdated({ fromRow, toRow, updated }) {
        let rowKey = this.state.rowKey;
        let rows = this.state.rows.slice();
        for (let i = fromRow; i <= toRow; i++) {
            let rowToUpdate = rows[i];
            let updatedRow = Object.assign(rowToUpdate, updated);
            rows[i] = updatedRow;

            let updateKey = rows[i][rowKey];
            if (this.updatedKey.indexOf(updateKey) < 0) this.updatedKey.push(updateKey);
        }
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
    render() {

        return (
            <div className="EmpDataGrid">
                <div className="topMenuContainer" style={{ 'display': this.props.showActionBar }}>
                    {this.props.showDownload ? (<div className="aToButton"><a className="linkButton" href="http://localhost:8080/emp/downloadempbasicinfo" target="_blank"><i className="el-icon-document"></i>点击下载</a></div>) : (null)}
                    {this.props.showCreateNew ? (<Button type="primary" icon="plus" onClick={this.handleAddRow.bind(this)}>添加</Button>) : (null)}
                    {this.props.showDelete ? (<Button type="primary" icon="delete" onClick={this.handleDelete.bind(this)}>删除</Button>) : (null)}
                    {this.props.showSave ? (<Button type="primary" icon="circle-check" onClick={this.handleSaveData.bind(this)}>保存</Button>) : (null)}
                    {this.props.showSyncEmpInfo ? (<Button type="primary" icon="circle-check" onClick={this.handleSyncEmpInfo.bind(this)}>同步</Button>) : (null)}
                    {this.props.showUploader ? (
                        <Upload
                            className="FileUPloader"
                            action="/emp/uploadempbasicinfo"
                            multiple={false}
                            showFileList={false}
                        >
                            <Button icon="upload" type="primary">点击上传</Button>
                        </Upload>
                    ) : (null)}

                </div>

                <div className="EmpInfoTableContainer">
                    <ReactDataGrid
                        rowKey={this.state.rowKey}
                        enableCellSelect={true}
                        columns={this.state._columns}
                        rowGetter={this.rowGetter.bind(this)}
                        rowsCount={this.state.rows.length}
                        minWidth={this.props.minWidth ? this.props.minWidth : (document.body.clientWidth - 50 < 1280 ? 1280 : document.body.clientWidth - 50)}
                        minHeight={this.props.minHeight ? this.props.minHeight : (document.body.clientHeight - 150)}
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
        );
    }
};

export default ConfigGrid;

// minHeight={this.props.minHeight ? this.props.minHeight : (document.body.clientHeight - 150)}