import React, { Component } from 'react';
import './Payroll.css';
import { Loading } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';
import DataGrid from '../DataGrid/DataGrid';

import ReactDataGrid from 'react-data-grid'
const { Editors, Formatters } = require('react-data-grid-addons');
const { DropDownEditor } = Editors;
const { DropDownFormatter } = Formatters;

const ColumnKeysNeedValidate = [];
const validateFailMsg = '';

class PayrollConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            fullscreen: true,
            columns: [],
            rowKey: 'WorkerCategory',
        }
    }

    componentDidMount() {
        let nstate = Object.assign({}, this.state);
        AppStore.getConfigData().then((configData) => {
            if (configData.status !== 200) AppStore.showError(configData.message);
            const YesNo = [{ id: '01', value: 'Y' }, { id: '02', value: 'N' }];
            const YesNoEditor = <DropDownEditor options={YesNo} />;
            const YesNoFormatter = <DropDownFormatter options={YesNo} value="value" />;
            const wcategory = configData.data.WorkerCategory;
            const wcategoryEditor = <DropDownEditor options={wcategory} />;
            const wcategoryFormatter = <DropDownFormatter options={wcategory} value="value" />;
            nstate.columns = [
                { key: 'WorkerCategory', name: '工作类别', width: 150, editable: true, editor: wcategoryEditor, formatter: wcategoryFormatter },
                { key: 'jinengGongzi', name: '技能工资', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'gangweiGongzi', name: '岗位工资', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'jichuButie', name: '基础补贴', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'xilifei', name: '洗理费', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'gonglingGongzi', name: '工龄工资', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'zhiwuJintie', name: '职务津贴', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'gongliBuzhu', name: '公里补助', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'kaoheJiangjin', name: '考核奖金', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'tongxunButie', name: '通讯补贴', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'qitaJiangjin', name: '其他津贴', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'xiaxiangBuzhu', name: '下乡补助', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'yingyetingBuzhu', name: '营业厅补助', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'nianjin', name: '年金', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'qiyeNianjin', name: '企业年金', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'yanglaobaoxian', name: '养老保险', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'shiyebaoxian', name: '失业保险', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'zhufanggongjijin', name: '住房公积金', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'yiliaobaoxian', name: '医疗报销', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'buchongyiliaobaoxian', name: '补充医疗保险', editable: 'true', width: 150, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'jiabanFei', name: '加班费', width: 150, editable: true, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'kouchuGongzi', name: '扣除项', width: 150, editable: true, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'tax', name: '个人所得税', width: 150, editable: true, editor: YesNoEditor, formatter: YesNoFormatter },
                { key: 'taxBaseline', name: '所得税基', width: 150, editable: true },
            ]
        }).then(() => {
            AppStore.getAllPayrollConfigs().then((configs) => {
                if (configs.status === 200) {
                    nstate.rows = configs.data;
                    nstate.fullscreen = false;
                    this.setState(nstate);
                } else {
                    this.setState({ fullscreen: false });
                    AppStore.showError(configs.message);
                }
            })
        })
    }
    handleCreateNew() {
        return new Promise(function (rel, rej) {
            rel({
                WorkerCategory: '',
                jinengGongzi: 'Y',
                gangweiGongzi: 'Y',
                jichuButie: 'Y',
                xilifei: 'Y',
                gonglingGongzi: 'Y',
                zhiwuJintie: 'Y',
                gongliBuzhu: 'Y',
                kaoheJiangjin: 'Y',
                tongxunButie: 'Y',
                qitaJiangjin: 'Y',
                xiaxiangBuzhu: 'Y',
                yingyetingBuzhu: 'Y',
                preAnnuallyIncom: 'Y',
                nianjin: 'Y',
                qiyeNianjin: 'Y',
                yanglaobaoxian: 'Y',
                shiyebaoxian: 'Y',
                zhufanggongjijin: 'Y',
                yiliaobaoxian: 'Y',
                buchongyiliaobaoxian: 'Y',
                jiabanFei: 'Y',
                kouchuGongzi: 'Y',
                tax: 'Y',
                taxBaseline: '3500'
            })
        })

    }
    saveData(data, keysObj) {
        let { newcreated, deleted, updated } = keysObj;
        let newCreatedKeys = [], deletedKeys = [], updatedKeys = [];

        deleted.forEach(function (WorkerCategory) {
            let existInData = false;
            for (let i = 0; i < data.length && !existInData; i++) {
                if (data[i].WorkerCategory === WorkerCategory) existInData = true;
            }

            if (!existInData) deletedKeys.push(WorkerCategory);

        })

        for (let i = 0; i < data.length; i++) {
            let hasDuplicateWokerCtaegory = false;
            for (let k = i + 1; k < data.length && !hasDuplicateWokerCtaegory; k++) {
                if (data[i].WorkerCategory === data[k].WorkerCategory) hasDuplicateWokerCtaegory = true;
            }
            if (hasDuplicateWokerCtaegory) {
                AppStore.showError("工资配置项不允许有重复的，请仔细检查");
                return;
            }
        }

        AppStore.deletePayrollConfigs(deletedKeys).then(res => {
            if (res.status === 700) {

            } else if (res.status === 200) {
                AppStore.showSuccess(res.message);
            } else {
                AppStore.showError(res.message);
            }
        }).then(() => {
            AppStore.savePayrollConfigs(data).then((res) => {
                AppStore.showInfo(res.message);
            });
        })
    }
    render() {
        return (
            <div className="PayrollContainer">
                <div className="PayrollBodyContainer">
                    {
                        this.state.fullscreen && <Loading fullscreen={true} />
                    }
                    <DataGrid
                        columns={this.state.columns}
                        rows={this.state.rows}
                        rowKey={this.state.rowKey}
                        showActionBar=''
                        showDelete={true}
                        showCreateNew={true}
                        createNew={this.handleCreateNew.bind(this)}
                        showSave={true}
                        saveData={this.saveData.bind(this)}
                        showUploader={false}
                        uploadLink={''}
                        showDownload={false}
                        downloadLink={''}
                        minWidth={4500}
                        ColumnKeysNeedValidate={ColumnKeysNeedValidate}
                        validateFailMsg={validateFailMsg}
                    />
                </div>
            </div>
        );
    }
}

export default PayrollConfig;