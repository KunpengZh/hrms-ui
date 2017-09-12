import React, { Component } from 'react';
import './Payroll.css';
import { Button } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';


class PayrollConfig extends Component {
    handchange() {
        console.log(this.props);
        this.props.history.push('/empSensitiveInfo')
    }
    render() {
        return (
            <div className="EmpContainer">
                Payroll Config
            </div>
        );
    }
}

export default PayrollConfig;