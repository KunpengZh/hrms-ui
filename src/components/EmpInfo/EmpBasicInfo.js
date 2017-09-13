import React, { Component } from 'react';
import './Employee.css';
import { Button } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'
import {
    BrowserRouter,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import AppStore from '../../share/AppStore';


import EmpBasicInfoTable from './EmpBasicInfoTable';
import EmpBasicNew from './EmpBasicNew';


class EmpBasicInfo extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <BrowserRouter basename={"/home/EmpBasicInfo"}>
                <div className="EmpContainer">
                    <Switch>
                        <Route exact path="/" render={() => <Redirect to="/EmpBasicInfoTable" />} />
                        <Route exact path="/EmpBasicInfoTable" component={EmpBasicInfoTable} />
                        <Route exact path="/EmpBasicNew" component={EmpBasicNew} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default EmpBasicInfo;