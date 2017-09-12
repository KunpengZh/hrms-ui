import React, { Component } from 'react';
import './AccessManagement.css';
import { Button } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';


class AccessManagement extends Component {
    handchange() {
        console.log(this.props);
        this.props.history.push('/empSensitiveInfo')
    }
    render() {
        return (
            <div className="EmpContainer">
                AccessManagement
            </div>
        );
    }
}

export default AccessManagement;