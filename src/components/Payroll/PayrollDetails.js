import React, { Component } from 'react';
import './Payroll.css';
import { Loading, Dialog, Button,Table } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';
import DataGrid from '../DataGrid/DataGrid';

import ReactDataGrid from 'react-data-grid'

const ColumnKeysNeedValidate = ['jinengGongzi', 'gangweiGongzi',
    'jichuButie', 'xilifei', 'gonglingGongzi', 'zhiwuJintie', 'gongliBuzhu', 'kaoheJiangjin', 'tongxunButie',
    'qitaJiangjin', 'xiaxiangBuzhu', 'yingyetingBuzhu', 'kouchu', 'kaohekoukuan', 'buchongyiliaobaoxian', 'preAnnuallyIncom'];
const validateFailMsg = '请核查您是否在只能输入数字的字段里输入了非数字字符';

let headerColumns = [
    { key: 'empId', name: '员工号', showColumn: false },
    { key: 'name', name: '姓名', width: 150, showColumn: false },
    { key: 'department', name: '部门', width: 150, showColumn: false },
    { key: 'jobRole', name: '岗位', width: 150, showColumn: false },
    { key: 'workerCategory', name: '工作类别', width: 150, showColumn: false },
];
let columnDefine = [
    { key: 'jinengGongzi', name: '技能工资', editable: false, width: 150 },
    { key: 'gangweiGongzi', name: '岗位工资', editable: false, width: 150 },
    { key: 'jichuButie', name: '基础补贴', editable: false, width: 150 },
    { key: 'xilifei', name: '洗理费', editable: false, width: 150 },
    { key: 'gonglingGongzi', name: '工龄工资', editable: false, width: 150 },
    { key: 'daySalary', name: '日工资(非全日制)', editable: false, width: 150 },
    { key: 'workDays', name: '工作天数(非全日制)', editable: false, width: 150 },
    { key: 'jibengongzi', name: '基本工资', width: 150 },
    { key: 'jibengongziComments', name: '基本工资计算方法', width: 650 },
    { key: 'zhiwuJintie', name: '职务津贴', editable: false, width: 150 },
    { key: 'gongliBuzhu', name: '公里补助', editable: false, width: 150 },
    { key: 'kaoheJiangjin', name: '考核奖金', editable: false, width: 150 },
    { key: 'gudingJiangjin', name: '固定奖金', editable: false, width: 150 },
    { key: 'tongxunButie', name: '通讯补贴', editable: false, width: 150 },
    { key: 'qitaJiangjin', name: '其他奖励', editable: false, width: 150 },
    { key: 'xiaxiangBuzhu', name: '下乡补助', editable: false, width: 150 },
    { key: 'yingyetingBuzhu', name: '营业厅补助', editable: false, width: 150 },
    { key: 'NormalOT', name: '夜间值班费', width: 150 },
    { key: 'WeekendOT', name: '周末值班费', width: 150 },
    { key: 'HolidayOT', name: '节假日值班费' },
    { key: 'HolidayOTComments', name: '节假日值班计算方法', width: 600 },
    { key: 'anquanJiangli', name: '安全奖励(非全日制)', width: 200 },
    { key: 'wuweizhangJiangli', name: '无违章奖励(非全日制)', width: 200 },
    { key: 'OTJiangjin', name: '加班奖金(非全日制)', width: 200 },
    { key: 'kouchu', name: '扣工资', width: 150, editable: false },
    { key: 'kaohekoukuan', name: '其它罚款', width: 150, editable: false },
    { key: 'yingfagongzi', name: '应发工资', width: 150 },
    { key: 'yingfagongziComments', name: '应发工资计算方法', width: 1600 },
    { key: 'preAnnuallyIncom', name: '上年月平均收入', width: 150, editable: false },
    { key: 'nianjin', name: '年金', width: 150 },
    { key: 'nianjinComments', name: '年金计算方法', width: 450 },
    { key: 'yanglaobaoxian', name: '养老保险', width: 150 },
    { key: 'yanglaobaoxianComments', name: '养老保险计算方法', width: 450 },
    { key: 'shiyebaoxian', name: '失业保险', width: 150 },
    { key: 'shiyebaoxianComments', name: '失业保险计算方法', width: 450 },
    { key: 'zhufanggongjijin', name: '住房公积金', width: 150 },
    { key: 'zhufanggongjijinComments', name: '住房公积金计算方法', width: 450 },
    { key: 'yiliaobaoxian', name: '医疗保险', width: 150 },
    { key: 'qiyeNianjin', name: '企业年金', width: 150 },
    { key: 'qiyeNianJinComments', name: '企业年金计算方法', width: 450 },
    { key: 'qiyeYanglaobaoxian', name: '企业养老保险', width: 150 },
    { key: 'qiyeYanglaobaoxianComments', name: '企业养老保险计算方法', width: 450 },
    { key: 'qiyeShiyebaoxian', name: '企业失业保险', width: 150 },
    { key: 'qiyeShiyebaoxianComments', name: '企业失业保险计算方法', width: 450 },
    { key: 'qiyeZhufanggongjijin', name: '企业住房公积金', width: 150 },
    { key: 'qiyeZhufanggongjijinComments', name: '企业住房公积金计算方法', width: 450 },
    { key: 'qiyeYiliaobaoxian', name: '企业医疗保险', width: 150 },
    { key: 'yingshuigongzi', name: '应税工资', width: 150 },
    { key: 'yingshuigongziComments', name: '应税工资计算方法', width: 1250 },
    { key: 'tax', name: '个人所得税', width: 150, width: 150 },
    { key: 'taxComments', name: '个人所得税计算方法', width: 950 },
    { key: 'yicixingjiangjin', name: '年终奖金', width: 150 },
    { key: 'yicixingjiangjinTax', name: '年终奖金税', width: 150 },
    { key: 'yicixingjiangjinTaxComments', name: '年终奖金税计算方法', width: 750 },
    { key: 'buchongyiliaobaoxian', name: '补充医疗保险', width: 150, editable: false },
    { key: 'netIncome', name: '实发工资', width: 150 },
    { key: 'netIncomeComments', name: '实发工资计算方法', width: 1350 },
]

class PayrollDetailsCalculation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            fullscreen: true,
            columns: [],
            rowKey: 'empId',
            YearMonthPeriod: [],
            curYearMonth: '',
            showConfirm: false,
            showConfigTableWindow: false,
        };
        this.configTable = {
            columns: [
                {
                    type: 'selection',
                    prop: 'showColumn',
                },
                {
                    label: "列名",
                    prop: "name",
                    width: 250,
                    headerAlign: "center",
                    align: "center"
                },
                {
                    label: "键值",
                    prop: "key",
                    width: 250,
                    headerAlign: "center",
                    align: "center"
                }
            ],
            data: columnDefine
        };
        this.configTableDefaultStatus = false;
    }
    componentDidMount() {
        // { key: 'yiliaobaoxianComments', name: '医疗保险计算方法', width: 450 },
        //{ key: 'qiyeYiliaobaoxianComments', name: '企业医疗保险计算方法', width: 450 },

        let nstate = Object.assign({}, this.state);
        if (nstate.curYearMonth === "") {
            if (nstate.YearMonthPeriod.length === 0) {
                this.setState({ fullscreen: true });
                AppStore.getCALYearMonthPeriod().then(resdata => {
                    if (resdata.status === 200) {
                        nstate.YearMonthPeriod = resdata.data;

                        nstate.curYearMonth = nstate.YearMonthPeriod[0].value;
                        this.initialSCALTableData(nstate);
                    } else {
                        this.setState({ fullscreen: false });
                        AppStore.showError(resdata.message);
                    }
                })
            } else {
                nstate.curYearMonth = nstate.YearMonthPeriod[0].value;
                this.initialSCALTableData(nstate);
            }

        }

    }

    initialSCALTableData(nstate) {
        AppStore.getSCALByCycle(nstate.curYearMonth).then((SDs) => {
            if (SDs.status === 200) {
                nstate.columns = headerColumns.concat(columnDefine);
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
        AppStore.SyncSCALEmpData(this.state.curYearMonth).then((res) => {
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
        AppStore.initialSCALByCycle(this.state.curYearMonth).then((res) => {
            this.setState({ fullscreen: false });
            if (res.status === 200) {
                this.setState({ rows: res.data });
            } else {
                AppStore.showError(res.message);
            }
        })
    }
    saveData(data, keysObj) {
        // let { newcreated, deleted, updated } = keysObj;
        // let newCreatedKeys = [], deletedKeys = [], updatedKeys = [];

        // AppStore.updateEmpSDData(data, this.state.curYearMonth).then((res) => {
        //     AppStore.showInfo(res.message);
        // });

    }
    handleQuery(criteria) {
        this.setState({ fullscreen: true });
        AppStore.querySCALDataByCriteria(criteria).then((SDs) => {

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
        AppStore.reCalculateSCALData(this.state.curYearMonth).then((SDs) => {
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

    handleSalaryCycleChange(value) {
        this.setState({ curYearMonth: value });
    }
    handleFinalizeSalaryCalData() {
        this.setState({
            fullscreen: true,
            showConfirm: false
        });
        AppStore.finalizeSalaryCALData().then((res) => {
            if (res.status === 200) {
                this.setState({
                    rows: [],
                    fullscreen: false
                })
                AppStore.showSuccess("成功")
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(res.message)
            }
        })
    }
    showConfirmWindow() {
        this.setState({ showConfirm: true });
    }

    handleConfigTable() {
        this.configTableDefaultStatus = false;
        for (let i = 0; i < columnDefine.length; i++) {
            columnDefine[i].showColumn = this.configTableDefaultStatus;
        }
        this.setState({ showConfigTableWindow: true })
    }
    handleConfigTableSelectChange(selection) {

        for (let i = 0; i < columnDefine.length; i++) {
            if (columnDefine[i].key === selection.key) {
                columnDefine[i].showColumn = !columnDefine[i].showColumn;
                if (!columnDefine[i].showColumn) {
                    this.configTableDefaultStatus = false;
                }
                break;
            }
        }
        console.log(columnDefine);
        console.log(this.configTableDefaultStatus);
    }
    handleConfigTableSelectAll(selections) {
        this.configTableDefaultStatus = !this.configTableDefaultStatus;
        for (let i = 0; i < columnDefine.length; i++) {
            columnDefine[i].showColumn = this.configTableDefaultStatus;
        }
        console.log(columnDefine);
        console.log(this.configTableDefaultStatus);
    }
    handleConfigTableConfirm() {
        let selectColumns = Object.assign([], headerColumns);
        for (let i = 0; i < columnDefine.length; i++) {
            if (columnDefine[i].showColumn) {
                selectColumns.push(columnDefine[i]);
            }
        }
        this.setState({
            showConfigTableWindow: false,
            columns: selectColumns
        });
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
                        showSave={false}
                        saveData={this.saveData.bind(this)}
                        showUploader={false}
                        uploadLink={'/sdd/uploadot'}
                        showDownload={false}
                        downloadLink={''}
                        ColumnKeysNeedValidate={ColumnKeysNeedValidate}
                        validateFailMsg={validateFailMsg}
                        showSync={true}
                        handleSync={this.handleSync.bind(this)}
                        syncButtonText={'同步'}
                        showInit={true}
                        handleInit={this.handleInit.bind(this)}
                        initButtonText={'计算'}
                        showSelectMenu={true}
                        salaryCycleOptions={this.state.YearMonthPeriod}
                        handleQuery={this.handleQuery.bind(this)}
                        salaryCycle={this.state.curYearMonth}
                        showQuery={true}
                        queryText={"显示"}
                        enableCheckBox={false}
                        showFunc1={true}
                        Func1Text="冻结"
                        handleFunc1={this.showConfirmWindow.bind(this)}
                        showFunc2={true}
                        Func2Text="重算"
                        handleFunc2={this.handleRecalculate.bind(this)}
                        showFunc3={true}
                        Func3Text="定制"
                        handleFunc3={this.handleConfigTable.bind(this)}
                        showDownloadTable={true}
                        downloadTableLink={AppStore.getPreHostURLLink() + '/scal/downloadtable?salaryCycle=' + this.state.curYearMonth}
                        handleSalaryCycleChange={this.handleSalaryCycleChange.bind(this)}
                    />
                </div>
                <Dialog
                    title="请确认"
                    size="tiny"
                    visible={this.state.showConfirm}
                    onCancel={() => this.setState({ showConfirm: false })}
                    lockScroll={false}
                >
                    <Dialog.Body>
                        <span>冻结结算，是指冻结当前月份的工资结算，冻结之后本月份的工资将不允许再次修改，您确认要冻结本月的工资结算吗？</span>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={() => this.setState({ showConfirm: false })}>取消</Button>
                        <Button type="primary" onClick={this.handleFinalizeSalaryCalData.bind(this)}>确定</Button>
                    </Dialog.Footer>
                </Dialog>
                <Dialog
                    title="选择要显示的列"
                    visible={this.state.showConfigTableWindow}
                    onCancel={() => this.setState({ showConfigTableWindow: false })}
                >
                    <Dialog.Body>
                        {this.state.showConfigTableWindow && (
                            <Table
                                style={{ width: '100%', height: '400px', overflow: 'scroll' }}
                                stripe={true}
                                columns={this.configTable.columns}
                                data={this.configTable.data}
                                onSelectChange={this.handleConfigTableSelectChange.bind(this)}
                                onSelectAll={this.handleConfigTableSelectAll.bind(this)}
                                rowKey="key"
                            />
                        )}
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={() => this.setState({ showConfigTableWindow: false })}>取 消</Button>
                        <Button type="primary" onClick={this.handleConfigTableConfirm.bind(this)}>确 定</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        );
    }
}

export default PayrollDetailsCalculation;

// { key: 'NormalOTComments', name: '平时加班计算方法', width: 600 },
// { key: 'WeekendOTComments', name: '周末加班计算方法', width: 600 },