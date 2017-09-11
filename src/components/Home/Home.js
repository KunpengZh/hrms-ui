import React, { Component } from 'react';
import './Home.css';
import { Button } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'
import TopNavigation from '../Navigation/TopNavigation';
import Login from '../Login/Login';

import AppStore from '../../share/AppStore';

import {
    BrowserRouter,
    Route,
    Link
} from 'react-router-dom'

class Home extends Component {
    render() {
        console.log("hiiiii")
        console.log(AppStore.loggedIn);
        return (
            <div className="HomeContainer">
                <div className="TopNavContainer">
                    <TopNavigation />
                </div>
                <div className="BodyContainer">
                    <BrowserRouter
                        basename={"/home"}>
                        <div>
                            <Route path="/empInfo" render={() => <div>Emp INfo</div>} />
                            <Route path="/ot" render={() => <div>OT</div>} />
                        </div>
                    </BrowserRouter>
                </div>
                <div className="BottomNavContainer">

                </div>
            </div>
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
