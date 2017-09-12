import React, { Component } from 'react';
import './OTManagemetn.css';
import { Button } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';


class OTManagement extends Component {
    handchange() {
        console.log(this.props);
        this.props.history.push('/empSensitiveInfo')
    }
    render() {
        return (
            <div className="EmpContainer">
                OTManagement
            </div>
        );
    }
}

export default OTManagement;