import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid'
import { Button } from 'element-react';
import 'element-theme-default';
import './Employee.css';
import 'bootstrap/dist/css/bootstrap.css';
import AppStore from '../../share/AppStore';
import Cascader from '../Share/Cascader'


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
            cascaderMenu: null
        };
        this.selectedKeys = [];
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
            rows: newProps.rows,
            _columns: newProps.columns,
            selectedIndexes: [],
            selectedKeys: [],
            rowKey: newProps.rowKey ? newProps.rowKey : 'id',
            cascaderMenu: newProps.cascaderMenu ? newProps.cascaderMenu : null
        };
        this.setState(nstate);

    }
    handleGridRowsUpdated({ fromRow, toRow, updated }) {
        let rows = this.state.rows.slice();
        for (let i = fromRow; i <= toRow; i++) {
            let rowToUpdate = rows[i];
            let updatedRow = Object.assign(rowToUpdate, updated);
            rows[i] = updatedRow;
        }
        this.setState({ rows });
    }
    handleAddRow() {
        this.props.createNew().then((newRow) => {
            let rows = this.state.rows.slice();
            rows.push(newRow);
            this.setState({ rows });
        });
    }
    handleDelete() {
        let rowKey = this.state.rowKey;
        let rows = this.state.rows.slice();
        this.selectedKeys.map(function (selIndex) {
            rows.forEach(function (row, rowIndex) {
                if (row[rowKey] === selIndex) {
                    rows.splice(rowIndex, 1);
                }
            });
        });
        this.setState({ rows });
    }
    handleSaveData() {
        this.props.saveData(this.state.rows);
    }
    render() {
        
        return (
            <div className="EmpDataGrid">
                <div className="topMenuContainer" style={{ 'display': this.props.showConfigActionBar }}>
                    {this.props.showCreateNew ? (<Button type="primary" onClick={this.handleAddRow.bind(this)}>添加</Button>) : (null)}
                    {this.props.showDelete ? (<Button type="warning" onClick={this.handleDelete.bind(this)}>删除</Button>) : (null)}
                    {this.props.showSave ? (<Button type="primary" onClick={this.handleSaveData.bind(this)}>保存</Button>) : (null)}
                </div>
                <div className="topMenuContainer" style={{ 'display': this.props.showEmpBasicTableActionBar }}>
                    {this.state.cascaderMenu ? (<Cascader options={this.state.cascaderMenu} />) : (null)}
                    <Button type="primary" icon="search">过&nbsp;滤</Button>
                    <Button type="primary" icon="plus" onClick={this.handleAddRow.bind(this)}>新&nbsp;建</Button>
                    <Button type="primary" icon="upload">上&nbsp;传</Button>
                </div>
                <div className="EmpInfoTableContainer">
                    <ReactDataGrid
                        rowKey={this.state.rowKey}
                        enableCellSelect={true}
                        columns={this.state._columns}
                        rowGetter={this.rowGetter.bind(this)}
                        rowsCount={this.state.rows.length}
                        minWidth={this.props.minWidth ? this.props.minWidth : document.body.clientWidth}
                        onGridRowsUpdated={this.handleGridRowsUpdated.bind(this)}
                        rowSelection={{
                            showCheckbox: true,
                            enableShiftSelect: true,
                            onRowsSelected: this.onRowsSelected.bind(this),
                            onRowsDeselected: this.onRowsDeselected.bind(this),
                            selectBy: {
                                indexes: this.state.selectedIndexes
                            }
                        }} />
                </div>
            </div>
        );
    }
};

export default ConfigGrid;