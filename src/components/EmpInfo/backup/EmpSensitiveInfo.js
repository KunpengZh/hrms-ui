import React, { Component } from 'react';
import './Employee.css';
import { Loading } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';
import EmpDataGrid from './EmpDataGrid';

import ReactDataGrid from 'react-data-grid'

const ColumnKeysNeedValidate = ['idCard', 'bankAccount', 'jinengGongzi', 'gangweiGongzi',
    'jichuButie', 'xilifei', 'gonglingGongzi', 'zhiwuJintie', 'gongliBuzhu', 'kaoheJiangjin', 'tongxunButie',
    'qitaJiangjin', 'xiaxiangBuzhu', 'yingyetingBuzhu', 'preAnnuallyIncom', 'nianjin', 'qiyeNianjin', 'yanglaobaoxian', 'shiyebaoxian',
    'zhufanggongjijin', 'yiliaobaoxian', 'buchongyiliaobaoxian'];
const validateFailMsg = '请检查您是否在只能接受数字的字段里输入的非数字字符';
const ColumnKeyNeedDate = ['birthday']
const validateDateFailMsg = '您输入的出生日期字段不合法，请输入YYYY-MM-DD格式的日期';


class EmpSensitiveInfoTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            fullscreen: true,
            columns: [],
            rowKey: 'empId',
        }
    }

    componentDidMount() {
        let nstate = Object.assign({}, this.state);
        AppStore.getConfigData().then((configData) => {
            if (configData.status !== 200) AppStore.showError(configData.message);
            nstate.columns = [
                { key: 'empId', name: '员工号', sortable: true, width: 150 },
                { key: 'name', name: '姓名', sortable: true, width: 150 },
                { key: 'idCard', name: '身份证', editable: 'true', width: 150 },
                { key: 'birthday', name: '出生日期', editable: 'true', width: 150 },
                { key: 'bankAccount', name: '银行帐号', editable: 'true', width: 150 },
                { key: 'jinengGongzi', name: '技能工资', editable: 'true', width: 150 },
                { key: 'gangweiGongzi', name: '岗位工资', editable: 'true', width: 150 },
                { key: 'jichuButie', name: '基础补贴', editable: 'true', width: 150 },
                { key: 'xilifei', name: '洗理费', editable: 'true', width: 150 },
                { key: 'gonglingGongzi', name: '工龄工资', editable: 'true', width: 150 },
                { key: 'zhiwuJintie', name: '职务津贴', editable: 'true', width: 150 },
                { key: 'gongliBuzhu', name: '公里补助', editable: 'true', width: 150 },
                { key: 'kaoheJiangjin', name: '考核奖金', editable: 'true', width: 150 },
                { key: 'tongxunButie', name: '通讯补贴', editable: 'true', width: 150 },
                { key: 'qitaJiangjin', name: '其他奖励', editable: 'true', width: 150 },
                { key: 'xiaxiangBuzhu', name: '下乡补助', editable: 'true', width: 150 },
                { key: 'yingyetingBuzhu', name: '营业厅补助', editable: 'true', width: 150 },
                { key: 'preAnnuallyIncom', name: '上年收入', editable: 'true', width: 150 },
                { key: 'nianjin', name: '年金', editable: 'true', width: 150 },
                { key: 'qiyeNianjin', name: '企业年金', editable: 'true', width: 150 },
                { key: 'yanglaobaoxian', name: '养老保险', editable: 'true', width: 150 },
                { key: 'shiyebaoxian', name: '失业保险', editable: 'true', width: 150 },
                { key: 'zhufanggongjijin', name: '住房公积金', editable: 'true', width: 150 },
                { key: 'yiliaobaoxian', name: '医疗报销', editable: 'true', width: 150 },
                { key: 'buchongyiliaobaoxian', name: '补充医疗保险', editable: 'true', width: 150 },
            ]
        }).then(() => {
            AppStore.getAllEmpSensitiveInfo().then((employees) => {
                if (employees.status === 200) {
                    nstate.rows = employees.data;
                    nstate.fullscreen = false;
                    this.setState(nstate);
                } else {
                    this.setState({ fullscreen: false });
                    AppStore.showError(employees.message);
                }
            })
        })
    }

    handleSyncEmpInfo() {
        this.setState({ fullscreen: true });
        AppStore.SyncEmpSenWithBasicTable().then((res) => {
            this.setState({ fullscreen: false });
            if (res.status === 200) {
                this.setState({ rows: res.data });
            } else {
                AppStore.showError(res.message);
            }
        })
    }

    saveData(data, keysObj) {

        let { updated } = keysObj;
        let changedData = [];

        data.forEach(function (employee) {
            if (updated.indexOf(employee.empId) >= 0) changedData.push(employee)
        });

        if (changedData.length > 0) {
            AppStore.saveEmpSensitiveData(changedData).then((res) => {
                AppStore.showSuccess(res.message);
            });
        } else {
            AppStore.showWarning("没有数据需要更新");
        }
    }
    _validateOnlyNumber(text) {
        let numbers = '0123456789.';
        let validate = true;
        for (var i = 0; i < text.length && validate; i++) {
            if (numbers.indexOf(text[i]) < 0) {
                AppStore.showError("工龄, 年龄字段只能接受数字，请检查您是否在工龄或是年龄字段里输入的非数字字符")
                validate = false;
                break;
            }
        }
        return validate;
    }

    render() {
        return (
            <div className="EmpContainer">
                <div className="EmpBodyContainer">
                    {
                        this.state.fullscreen && <Loading fullscreen={true} />
                    }
                    <EmpDataGrid
                        columns={this.state.columns}
                        rows={this.state.rows}
                        rowKey={this.state.rowKey}
                        showActionBar=''
                        showDelete={false}
                        showCreateNew={false}
                        minWidth={4500}
                        showSave={true}
                        saveData={this.saveData.bind(this)}
                        showUploader={true}
                        uploadLink={'/empsen/uploadempsensitiveinfo'}
                        showDownload={true}
                        downloadLink={'http://localhost:8080/empsen/downloadempsensitiveinfo'}
                        showSyncEmpInfo={true}
                        handleSyncEmpInfo={this.handleSyncEmpInfo.bind(this)}
                        ColumnKeysNeedValidate={ColumnKeysNeedValidate}
                        validateFailMsg={validateFailMsg}
                        ColumnKeyNeedDate={ColumnKeyNeedDate}
                        validateDateFailMsg={validateDateFailMsg}
                        enableCheckBox={false}
                    />
                </div>
            </div>
        );
    }
}

export default EmpSensitiveInfoTable;