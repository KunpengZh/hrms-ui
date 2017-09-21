import React, { Component } from 'react';
import './Print.css';
import { Button, Input, Checkbox } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'
import AppStore from '../../share/AppStore';
import EmpGongziDan from '../Payroll/EmpGongziDan'
class Print extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: []
        }
    }
    componentDidMount() {
        let nstate = Object.assign({}, this.state);
        nstate.rows = AppStore.getGongziData()
        this.setState(nstate);
    }

    render() {
        let key = 1;
        let gongzidan = [];
        this.state.rows.forEach(row => {
            gongzidan.push(
                <EmpGongziDan data={row} key={key++} />
            )
        })

        return (
            <div className="GongziDanContainer">
                {gongzidan}
            </div>
        );
    }
}

export default Print;
