import React, { Component } from 'react';
import './Payroll.css';
import { Loading } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';
import DataGrid from '../DataGrid/DataGrid';

import ReactDataGrid from 'react-data-grid'

const ColumnKeysNeedValidate = ['jinengGongzi', 'gangweiGongzi',
    'jichuButie', 'xilifei', 'gonglingGongzi', 'zhiwuJintie', 'gongliBuzhu', 'kaoheJiangjin', 'tongxunButie',
    'qitaJiangjin', 'xiaxiangBuzhu', 'yingyetingBuzhu', 'kouchu', 'kaohekoukuan', 'buchongyiliaobaoxian', 'preAnnuallyIncom'];
const validateFailMsg = '请核查您是否在只能输入数字的字段里输入了非数字字符';

class PayrollDetailsCalculation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            fullscreen: true,
            columns: [],
            rowKey: 'empId',
            YearMonthPeriod: AppStore.getYearMonthPeriod(),
            curYearMonth: ''
        }
    }
    componentDidMount() {
        let nstate = Object.assign({}, this.state);
        if (nstate.curYearMonth === "") nstate.curYearMonth = nstate.YearMonthPeriod[0].value;
        AppStore.getSDByCycle(nstate.curYearMonth).then((SDs) => {
            if (SDs.status === 200) {
                nstate.columns = [
                    { key: 'empId', name: '员工号' },
                    { key: 'name', name: '姓名', width: 150 },
                    { key: 'department', name: '部门', width: 150 },
                    { key: 'jobRole', name: '岗位', width: 150 },
                    { key: 'workerCategory', name: '工作类别', width: 150 },
                    { key: 'salaryCycle', name: '工资周期', width: 150 },
                    { key: 'jinengGongzi', name: '技能工资', editable: 'true', width: 150 },
                    { key: 'gangweiGongzi', name: '岗位工资', editable: 'true', width: 150 },
                    { key: 'jichuButie', name: '基础补贴', editable: 'true', width: 150 },
                    { key: 'xilifei', name: '洗理费', editable: 'true', width: 150 },
                    { key: 'gonglingGongzi', name: '工龄工资', editable: 'true', width: 150 },
                    { key: 'daySalary', name: '日工资(非全日制)', editable: 'true', width: 150 },
                    { key: 'workDays', name: '工作天数(非全日制)', editable: 'true', width: 150 },
                    { key: 'jibengongzi', name: '基本工资', width: 150 },
                    { key: 'jibengongziComments', name: '基本工资计算方法', width: 650 },
                    { key: 'zhiwuJintie', name: '职务津贴', editable: 'true', width: 150 },
                    { key: 'gongliBuzhu', name: '公里补助', editable: 'true', width: 150 },
                    { key: 'kaoheJiangjin', name: '考核奖金', editable: 'true', width: 150 },
                    { key: 'tongxunButie', name: '通讯补贴', editable: 'true', width: 150 },
                    { key: 'qitaJiangjin', name: '其他津贴', editable: 'true', width: 150 },
                    { key: 'xiaxiangBuzhu', name: '下乡补助', editable: 'true', width: 150 },
                    { key: 'yingyetingBuzhu', name: '营业厅补助', editable: 'true', width: 150 },
                    { key: 'NormalOT', name: '平时加班', width: 150 },
                    { key: 'NormalOTComments', name: '平时加班计算方法', width: 500 },
                    { key: 'WeekendOT', name: '周末加班', },
                    { key: 'WeekendOTComments', name: '周末加班计算方法', width: 500 },
                    { key: 'HolidayOT', name: '节假日加班' },
                    { key: 'HolidayOTComments', name: '节假日加班计算方法', width: 500 },
                    { key: 'anquanJiangli', name: '安全奖励(非全日制)', width: 350 },
                    { key: 'wuweizhangJiangli', name: '无违章奖励(非全日制)', width: 350 },
                    { key: 'OTJiangjin', name: '加班奖金(非全日制)', width: 350 },
                    { key: 'kouchu', name: '扣除项', width: 150, editable: 'true' },
                    { key: 'kaohekoukuan', name: '考核扣款', width: 150, editable: 'true' },
                    { key: 'yingfagongzi', name: '应发工资', width: 150 },
                    { key: 'yingfagongziComments', name: '应发工资计算方法', width: 1400 },
                    { key: 'preAnnuallyIncom', name: '上年收入', width: 150, editable: 'true' },
                    { key: 'nianjin', name: '年金', width: 150 },
                    { key: 'nianjinComments', name: '年金计算方法', width: 450 },
                    { key: 'qiyeNianjin', name: '企业年金', width: 150 },
                    { key: 'qiyeNianJinComments', name: '企业年金计算方法', width: 450 },
                    { key: 'yanglaobaoxian', name: '养老保险', width: 150 },
                    { key: 'yanglaobaoxianComments', name: '养老保险计算方法', width: 450 },
                    { key: 'shiyebaoxian', name: '失业保险', width: 150 },
                    { key: 'shiyebaoxianComments', name: '失业保险计算方法', width: 450 },
                    { key: 'zhufanggongjijin', name: '住房公积金', width: 150 },
                    { key: 'zhufanggongjijinComments', name: '住房公积金计算方法', width: 450 },
                    { key: 'yiliaobaoxian', name: '医疗保险', width: 150 },
                    { key: 'yiliaobaoxianComments', name: '医疗保险计算方法', width: 450 },
                    { key: 'yingshuigongzi', name: '应税工资', width: 150 },
                    { key: 'yingshuigongziComments', name: '应税工资计算方法', width: 950 },
                    { key: 'tax', name: '个人所得税', width: 150, width: 150 },
                    { key: 'taxComments', name: '个人所得税计算方法', width: 950 },
                    { key: 'yicixingjiangjin', name: '年终奖金', width: 150 },
                    { key: 'yicixingjiangjinTax', name: '年终奖金税', width: 150 },
                    { key: 'yicixingjiangjinTaxComments', name: '年终奖金税计算方法', width: 1750 },
                    { key: 'buchongyiliaobaoxian', name: '补充医疗保险', width: 150, editable: 'true' },
                    { key: 'netIncome', name: '实发工资', width: 150 },
                    { key: 'netIncomeComments', name: '实发工资计算方法', width: 1350 },
                ]
                nstate.rows = SDs.data;
                nstate.fullscreen = false;
                this.setState(nstate);
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(SDs.message);
            }
        })
    }
    handleSync() {
        this.setState({ fullscreen: true });
        AppStore.SyncSDEmpData(this.state.curYearMonth).then((res) => {
            this.setState({ fullscreen: false });
            if (res.status === 200) {
                this.setState({ rows: res.data });
            } else {
                AppStore.showError(res.message);
            }
        })
    }
    handleInit() {
        this.setState({ fullscreen: true });
        AppStore.initialSDByCycle(this.state.curYearMonth).then((res) => {
            this.setState({ fullscreen: false });
            if (res.status === 200) {
                this.setState({ rows: res.data });
            } else {
                AppStore.showError(res.message);
            }
        })
    }
    saveData(data, keysObj) {
        let { newcreated, deleted, updated } = keysObj;
        let newCreatedKeys = [], deletedKeys = [], updatedKeys = [];

        AppStore.updateEmpSDData(data, this.state.curYearMonth).then((res) => {
            AppStore.showInfo(res.message);
        });

    }

    handleYearMonthChange(value) {
        this.setState({ curYearMonth: value });
    }
    handleLoading() {
        this.setState({ fullscreen: true });
        AppStore.getSDByCycle(this.state.curYearMonth).then((SDs) => {

            if (SDs.status === 200) {
                this.setState({
                    rows: SDs.data,
                    fullscreen: false
                })
                AppStore.showSuccess("成功")
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(SDs.message)
            }
        })
    }

    handleRecalculate() {
        this.setState({ fullscreen: true });
        AppStore.reCalculateSDData(this.state.curYearMonth).then((SDs) => {
            if (SDs.status === 200) {
                this.setState({
                    rows: SDs.data,
                    fullscreen: false
                })
                AppStore.showSuccess("成功")
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(SDs.message)
            }
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
                        showDelete={false}
                        showCreateNew={false}
                        showSave={true}
                        saveData={this.saveData.bind(this)}
                        showUploader={true}
                        uploadLink={'/sdd/uploadot'}
                        showDownload={true}
                        downloadLink={AppStore.getPreHostURLLink() + '/sdd/downloadot?salaryCycle=' + this.state.curYearMonth}
                        ColumnKeysNeedValidate={ColumnKeysNeedValidate}
                        validateFailMsg={validateFailMsg}
                        showSync={true}
                        handleSync={this.handleSync.bind(this)}
                        syncButtonText={'同步'}
                        showInit={true}
                        handleInit={this.handleInit.bind(this)}
                        initButtonText={'初始化'}
                        showSelectMenu={true}
                        selectMenuOptions={this.state.YearMonthPeriod}
                        handleSelectMenuChange={this.handleYearMonthChange.bind(this)}
                        selectMenuSelectedItem={this.state.curYearMonth}
                        showLoading={true}
                        handleLoading={this.handleLoading.bind(this)}
                        loadingText={"显示"}
                        enableCheckBox={false}
                        showFunc1={true}
                        Func1Text="重新计算"
                        handleFunc1={this.handleRecalculate.bind(this)}
                        showDownloadTable={true}
                        downloadTableLink={AppStore.getPreHostURLLink() + '/sdd/downloadtable?salaryCycle=' + this.state.curYearMonth}
                    />
                </div>
            </div>
        );
    }
}

export default PayrollDetailsCalculation;