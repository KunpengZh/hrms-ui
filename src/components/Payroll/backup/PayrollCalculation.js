import React, { Component } from 'react';
import './Payroll.css';
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


import PayrollPreview from './SalaryPreview';
import PayrollDetails from './PayrollDetails';
import PayrollConfig from './PayrollConfig';


class PayrollCalculation extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <BrowserRouter basename={"/home/PayrollCalculation"}>
                <div className="EmpContainer">
                    <Switch>
                        <Route exact path="/" render={() => <Redirect to="/PayrollDetails" />} />
                        <Route exact path="/PayrollDetails" component={PayrollDetails} />
                        <Route exact path="/PayrollConfig" component={PayrollConfig} />
                        <Route exact path="/PayrollPreview" component={PayrollPreview} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default PayrollCalculation;