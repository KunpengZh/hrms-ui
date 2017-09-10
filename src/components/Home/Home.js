import React, { Component } from 'react';
import './Home.css';
import { Button, Input, Checkbox } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

class Home extends Component {
    render() {
        return (
            <div className="HomeContainer">
                <div className="TopNavContainer">
                    <div className="logoContainer">
                        <img className="logoIcon" src={require("../../images/hrmlogo2.png")} alt="" />
                    </div>
                    <div className="menuContainer"></div>
                    <div className="rightContainer"></div>
                </div>
                <div className="BodyContainer">
                    adsfads
                </div>
                <div className="BottomNavContainer">

                </div>
            </div>
        );
    }
}

export default Home;
