import React, { Component } from 'react';
import './Home.css';
import '../../font-awesome/css/font-awesome.min.css'
import AppStore from '../../share/AppStore';

import TopNavigation from '../Navigation/TopNavigation';
import EmpBasicInfo from '../EmpInfo/EmpBasicInfo'
import EmpSensitiveInfo from '../EmpInfo/EmpSensitiveInfo';
import AccessManagement from '../AccessManagement/AccessManagement'
import OTManagement from '../OTManagement/OTManagement'
import PayrollConfig from '../Payroll/PayrollConfig'
import PayrollCalculation from '../Payroll/PayrollCalculation'



import {
    BrowserRouter,
    Route
} from 'react-router-dom'

class Home extends Component {
    componentDidMount() {
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
                        <div>
                            <Route exact path="/" component={EmpBasicInfo} />
                            <Route exact path="/EmpBasicInfo" component={EmpBasicInfo} />
                            <Route exact path="/EmpSensitiveInfo" component={EmpSensitiveInfo} />
                            <Route exact path="/AccessManagement" component={AccessManagement} />
                            <Route exact path="/OTManagement" component={OTManagement} />
                            <Route exact path="/PayrollConfig" component={PayrollConfig} />
                            <Route exact path="/PayrollCalculation" component={PayrollCalculation} />
                        </div>

                    </div>
                    <div className="BottomNavContainer">

                    </div>
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
