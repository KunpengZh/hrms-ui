import React, { Component } from 'react';
import './Payroll.css';
import { Button, Select, Loading } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'


import AppStore from '../../share/AppStore';
import EmpGongziDan from './EmpGongziDan'

class EmpBasicInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullscreen: true,
            selectMenu: '',
            selectMenuOptions: AppStore.getYearMonthPeriod(),
            rows: []
        }
    }
    componentDidMount() {
        let nstate = Object.assign({}, this.state);
        if (nstate.selectMenu === "") nstate.selectMenu = nstate.selectMenuOptions[0].value;
        AppStore.getGongZiDanByCycle(nstate.selectMenu).then(res => {
            if (res.status === 200) {
                nstate.rows = res.data;
                nstate.fullscreen = false;
                this.setState(nstate);
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(res.message);
            }
        })
    }
    handleSelectMenuChange(value) {
        this.setState({ selectMenu: value });
    }
    handleSelection() {
        let nstate = Object.assign({}, this.state);
        this.setState({ fullscreen: true });
        AppStore.getGongZiDanByCycle(this.state.selectMenu).then(res => {
            if (res.status === 200) {
                nstate.rows = res.data;
                nstate.fullscreen = false;
                this.setState(nstate);
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(res.message);
            }
        })
    }
    handlePrint() {
        AppStore.setGongziData(this.state.rows);
        let rootRouter = AppStore.getRouter();
        rootRouter.push("/print");
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
                {
                    this.state.fullscreen && <Loading fullscreen={true} />
                }
                <div className="topMenuContainer">
                    <Select value={this.state.selectMenu} onChange={this.handleSelectMenuChange.bind(this)} style={{ marginRight: "20px" }}>
                        {
                            this.state.selectMenuOptions.map(el => {
                                return <Select.Option key={el.value} label={el.label} value={el.value} />
                            })
                        }
                    </Select>
                    <Button type="primary" icon="view" onClick={this.handleSelection.bind(this)}>显示所选月份数所</Button>
                    <Button type="primary" icon="view" onClick={this.handlePrint.bind(this)}>打印工资单</Button>
                </div>
                {gongzidan}
            </div>
        );
    }
}

export default EmpBasicInfo;