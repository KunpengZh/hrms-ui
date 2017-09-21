import React, { Component } from 'react';
import './Home.css';
import '../../font-awesome/css/font-awesome.min.css'
import AppStore from '../../share/AppStore';

import TopNavigation from '../Navigation/TopNavigation';
import EmpBasicInfo from '../EmpInfo/EmpBasicInfoTable';
import EmpSensitiveInfo from '../EmpInfo/EmpSensitiveInfo';
import AccessManagement from '../AccessManagement/AccessManagement'
import OTManagement from '../OTManagement/OTManagement'
import PayrollConfig from '../Payroll/PayrollConfig'
import EmpInfoConfig from '../EmpInfo/EmpInfoConfig'
import PayrollPreview from '../Payroll/SalaryPreview';
import PayrollDetails from '../Payroll/PayrollDetails';


import {
    BrowserRouter,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

class Home extends Component {
    componentDidMount() {
        AppStore.setRouter(this.props.history);
        if (!AppStore.isUserLoggedIn()) {
            this.props.history.push("/login");
        }
    }
    render() {
        return (
            <BrowserRouter basename={"/home"}>
                <div className="HomeContainer">
                    <div className="TopNavContainer">
                        <Route component={TopNavigation} />
                    </div>
                    <div className="BodyContainer">
                        <Switch>
                            <Route exact path="/" render={() => <Redirect to="/EmpBasicInfo" />} />
                            <Route path="/EmpBasicInfo" component={EmpBasicInfo} />
                            <Route exact path="/EmpSensitiveInfo" component={EmpSensitiveInfo} />
                            <Route exact path="/AccessManagement" component={AccessManagement} />
                            <Route exact path="/EmpInfoConfig" component={EmpInfoConfig} />
                            <Route exact path="/OTManagement" component={OTManagement} />
                            <Route exact path="/PayrollConfig" component={PayrollConfig} />
                            <Route exact path="/PayrollPreview" component={PayrollPreview} />
                            <Route exact path="/PayrollDetails" component={PayrollDetails} />
                        </Switch>
                    </div>
                    {/* <div className="BottomNavContainer">
                        <img className="bottomReminder" src={require("../../images/reminder.PNG")} alt="" />
                    </div> */}
                </div>
            </BrowserRouter>
        );
    }
}

// class HomeLayout extends Component {
//     render() {
//         console.log(this.props);
//         return (
//             <BrowserRouter
//                 basename={"/home"}>
//                 <div>
//                     <Route path="/home" component={Home} />
//                     <Route path="/news" component={Login} />
//                 </div>
//             </BrowserRouter>

//         )
//     }
// }



export default Home;
