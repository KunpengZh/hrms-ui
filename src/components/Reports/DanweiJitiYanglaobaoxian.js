import React, { Component } from 'react';
import './Reports.css';
import { Loading, Select, Form, Input, Button } from 'element-react';
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
                { key: 'empId', name: '员工号', sortable: true, width: 150 },
                { key: 'name', name: '姓名', sortable: true, width: 150 },
                { key: 'personal', name: '个人缴纳', width: 150 },
                { key: 'company', name: '公司缴纳', width: 150 },
                { key: 'total', name: '合计', width: 150 },
                { key: 'comments', name: '备注', width: 150 },
            ],
            activeKey: '',
            availableSalaryCycles: [],
            query: {
                salaryCycle: '',
            },
            rowKey: 'empId',
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
    handleSalaryCycleChange(value) {
        let query = this.state.query;
        query.salaryCycle = value;
        this.setState({ query: query });
    }
    handleQuery() {
        let query = {};
        if (this.state.query.salaryCycle !== 'All' && this.state.query.salaryCycle !== '') {
            query.salaryCycle = this.state.query.salaryCycle;
        } else {
            AppStore.showError("请先选择工资周期！！！");
            return;
        }
        if (JSON.stringify(query) === '{}') {
            AppStore.showError("请先选择查询条件！！！");
            return;
        }
        this.setState({ fullscreen: true });
        AppStore.queryYanglaobaoxian(query).then(res => {
            if (res.status === 200) {
                this.setState({
                    rows: res.data,
                    fullscreen: false,
                    downloadLink: AppStore.getPreHostURLLink() + '/danweijiti/downloadyanglaobaoxian?criteria=' + JSON.stringify(query)
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
                        <Form.Item labelWidth="80" label="工资周期:" style={{ display: "inline-block" }}>
                            <Select value={this.state.query.salaryCycle} onChange={this.handleSalaryCycleChange.bind(this)} style={{ width: "120px" }}>
                                {
                                    this.state.availableSalaryCycles.map(el => {
                                        if (el.value !== "All") {
                                            return <Select.Option key={el.value} label={el.label} value={el.value} />
                                        }
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