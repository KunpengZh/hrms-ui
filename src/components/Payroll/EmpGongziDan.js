import React, { Component } from 'react';
import './Payroll.css';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';



class EmpGongZiDan extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let title = this.props.data.salaryCycle + "  工资单  " + this.props.data.name;
        return (
            <div className="GZFormContainer">
                <h3>{title}</h3>
                <table className="bordered">
                    <tbody>
                        <tr>
                            <td>姓名</td>
                            <td>姓别</td>
                            <td>身份证号</td>
                            <td>银行帐号</td>
                            <td>工龄</td>
                            <td>工作部门</td>
                            <td>工作岗位</td>
                            <td>员工类别</td>
                            <td>备注</td>
                        </tr>
                        <tr>
                            <td>{this.props.data.name}</td>
                            <td>{this.props.data.gender}</td>
                            <td>{this.props.data.idCard}</td>
                            <td>{this.props.data.bankAccount}</td>
                            <td>{this.props.data.workAge}</td>
                            <td>{this.props.data.department}</td>
                            <td>{this.props.data.jobRole}</td>
                            <td>{this.props.data.workerCategory}</td>
                            <td>{this.props.data.comment}</td>
                        </tr>
                        <tr>
                            <td>工资周期</td>
                            <td>{this.props.data.salaryCycle}</td>
                            <td>工资组成:</td>
                            <td colSpan="6" style={{textAlign:"left"}}>{this.props.data.gongziDesc}</td>
                        </tr>
                        <tr>
                            <td>工资</td>
                            <td>奖金</td>
                            <td>值班费</td>
                            <td>通讯补贴</td>
                            <td>一次性奖金</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>{this.props.data.jibengongzi}</td>
                            <td>{this.props.data.totalJiangjin}</td>
                            <td>{this.props.data.totalOT}</td>
                            <td>{this.props.data.tongxunButie}</td>
                            <td>{this.props.data.yicixingjiangjin}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>年金</td>
                            <td>养老保险</td>
                            <td>医疗保险</td>
                            <td>失业保险</td>
                            <td>住房公积金</td>
                            <td>个人所得税</td>
                            <td>补充医疗保险</td>
                            <td>奖金税</td>
                            <td>扣款</td>
                        </tr>
                        <tr>
                            <td>{this.props.data.nianjin}</td>
                            <td>{this.props.data.yanglaobaoxian}</td>
                            <td>{this.props.data.yiliaobaoxian}</td>
                            <td>{this.props.data.shiyebaoxian}</td>
                            <td>{this.props.data.zhufanggongjijin}</td>
                            <td>{this.props.data.tax}</td>
                            <td>{this.props.data.buchongyiliaobaoxian}</td>
                            <td>{this.props.data.yicixingjiangjinTax}</td>
                            <td>{this.props.data.totalKouchu}</td>
                        </tr>
                        <tr>
                            <td>实发工资</td>
                            <td colSpan="8" style={{textAlign:"left"}}>{this.props.data.netIncome}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        );
    }
}

export default EmpGongZiDan;