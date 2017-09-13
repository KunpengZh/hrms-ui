import React, { Component } from 'react';
import './Employee.css';
import { Button } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';


class EmpBasicNew extends Component {
    render() {
        return (
            <div className="EmpContainer">
                Employee Create new
            </div>
        );
    }
}

export default EmpBasicNew;