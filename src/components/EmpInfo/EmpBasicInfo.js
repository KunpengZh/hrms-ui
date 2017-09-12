import React, { Component } from 'react';
import './Employee.css';
import { Button } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';


class EmpBasicInfo extends Component {
    handchange() {
        console.log(this.props);
        this.props.history.push('/empSensitiveInfo')
    }
    render() {
        return (
            <div className="EmpContainer">
                EmpBasicInfo
                <Button type="primary" onClick={this.handchange.bind(this)} />
            </div>
        );
    }
}

export default EmpBasicInfo;