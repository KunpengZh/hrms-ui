import React, { Component } from 'react';
import './Reports.css';
import { Tabs, Loading, Select, Form, Input, Button } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';
import DataGrid from '../DataGrid/DataGridWithoutMenu';

class EmpInfoConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            fullscreen: true,
            columns: [
                { key: 'workerCategory', name: '类别', width: 150 },
                { key: 'jibengongzi', name: '工资', width: 150 },
                { key: 'totalJiangjin', name: '奖金', width: 150 },
                { key: 'totalOT', name: '加班费', width: 150 },
                { key: 'tongxunButie', name: '通讯补贴', width: 150 },
                { key: 'nianjin', name: '扣年金', width: 150 },
                { key: 'yanglaobaoxian', name: '扣养老保险', width: 150 },
                { key: 'shiyebaoxian', name: '扣失业保险', width: 150 },
                { key: 'zhufanggongjijin', name: '扣住房公积金', width: 150 },
                { key: 'yiliaobaoxian', name: '扣医疗保险', width: 150 },
                { key: 'totalKouchu', name: '扣除工资', width: 150 },
                { key: 'tax', name: '扣个人所得税', width: 150 },
                { key: 'yicixingjiangjin', name: '年终奖金', width: 150 },
                { key: 'yicixingjiangjinTax', name: '扣年终奖金税', width: 150 },
                { key: 'buchongyiliaobaoxian', name: '扣补充医疗保险', width: 150 },
                { key: 'netIncome', name: '实发工资', width: 150 },
            ],
            activeKey: '',
            availableSalaryCycles: [],
            query: {
                startSalaryCycle: 'All',
                endSalaryCycle: 'All',
            },
            rowKey: 'workerCategory',
            downloadLink: '#',
        };
    }
    componentDidMount() {
        AppStore.getAllAvailableSalaryCycle().then(res => {
            let nstate = Object.assign({}, this.state);
            if (res.status === 200) {
                nstate.availableSalaryCycles = res.data.salaryCycle;
                nstate.fullscreen = false;
                this.setState(nstate);
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(res.message);
            }
        })

    }
    handleStartSalaryCycleChange(value) {
        let query = this.state.query;
        query.startSalaryCycle = value;
        this.setState({ query: query });
    }
    handleEndSalaryCycleChange(value) {
        let query = this.state.query;
        query.endSalaryCycle = value;
        this.setState({ query: query });
    }
    handleQuery() {
        let query = {};
        if (this.state.query.startSalaryCycle !== 'All' && this.state.query.startSalaryCycle !== '') query.startSalaryCycle = this.state.query.startSalaryCycle;
        if (this.state.query.endSalaryCycle !== 'All' && this.state.query.endSalaryCycle !== '') query.endSalaryCycle = this.state.query.endSalaryCycle;

        if (JSON.stringify(query) === '{}') {
            AppStore.showError("请先选择查询条件！！！");
            return;
        }
        this.setState({ fullscreen: true });
        AppStore.GongZiDanByWorkerCategory(query).then(res => {
            if (res.status === 200) {
                this.setState({
                    rows: res.data,
                    fullscreen: false,
                    downloadLink: AppStore.getPreHostURLLink() + '/gongzidan/downloadbywokercategory?criteria=' + JSON.stringify(query)
                })
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(res.message);
            }
        })
    }
    render() {
        return (
            <div className="ReportContainer">
                {
                    this.state.fullscreen && <Loading fullscreen={true} />
                }
                <div>
                    <Form labelWidth="50" style={{ textAlign: 'left' }}>
                        <Form.Item label="从:" style={{ display: "inline-block" }}>
                            <Select value={this.state.query.startSalaryCycle} onChange={this.handleStartSalaryCycleChange.bind(this)} style={{ width: "120px" }}>
                                {
                                    this.state.availableSalaryCycles.map(el => {
                                        return <Select.Option key={el.value} label={el.label} value={el.value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="到:" style={{ display: "inline-block" }}>
                            <Select value={this.state.query.endSalaryCycle} onChange={this.handleEndSalaryCycleChange.bind(this)} style={{ width: "120px" }}>
                                {
                                    this.state.availableSalaryCycles.map(el => {
                                        return <Select.Option key={el.value} label={el.label} value={el.value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item labelWidth="0" style={{ display: "inline-block" }}>
                            <Button type="primary" icon="search" onClick={this.handleQuery.bind(this)}>查询</Button>
                            <div className="aToButton"><a className="linkButton" href={this.state.downloadLink} target="_blank"><i className="el-icon-document"></i>下载</a></div>
                        </Form.Item>
                    </Form>

                </div>
                <div className="ReportTabContainer">
                    <DataGrid
                        columns={this.state.columns}
                        rows={this.state.rows}
                        rowKey={this.state.rowKey}
                        showActionBar={false}
                        enableCheckBox={false}
                    />
                </div>
            </div>
        );
    }
}


export default EmpInfoConfig;