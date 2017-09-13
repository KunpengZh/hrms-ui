import React, { Component } from 'react';
import './Employee.css';
import { Button } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';
import TopMenu from './TopMenu';

class EmpBasicInfoTable extends Component {
    handleMenuActions(menuItem) {
        switch (menuItem) {
            case "CreateNew":
                this.props.history.push("/EmpBasicNew");
                break;
        }
    }
    render() {
        return (
            <div className="EmpInfoTableContainer">
                <div className="topMenuContainer">
                    <TopMenu handleMenuActions={this.handleMenuActions.bind(this)}/>
                </div>
                <div className="EmpBodyContainer">
                    Employee Basic Table
                </div>
            </div>
        );
    }
}

export default EmpBasicInfoTable;