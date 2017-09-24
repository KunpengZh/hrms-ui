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





    render() {

        return (
            <div className="DataGrid">
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
                        onGridSort={this.handleGridSort.bind(this)}
                    />
                </div>
            </div>
        );
    }
};

export default DataGrid;

// minHeight={this.props.minHeight ? this.props.minHeight : (document.body.clientHeight - 150)}