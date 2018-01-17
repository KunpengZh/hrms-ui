import React, { Component } from 'react';
import './Payroll.css';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'


class EmpGongziDan extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let trs = [];
        this.props.data.forEach(element => {
            trs.push(
                <tr>
                    <td>
                        {element.empId}
                    </td>
                    <td>
                        {element.name}
                    </td>
                    <td>
                        {element.workerCategory}
                    </td>
                    <td>
                        {element.department}
                    </td>
                    <td>
                        {element.jobrole}
                    </td>
                    <td>
                        {element.JAN.Xiaoji}
                    </td>
                    <td>
                        {element.JAN.Gongzi}
                    </td>
                    <td>
                        {element.JAN.Jiangjin}
                    </td>
                    <td>
                        {element.JAN.Wuxiangfuli}
                    </td>
                    <td>
                        {element.FEB.Xiaoji}
                    </td>
                    <td>
                        {element.FEB.Gongzi}
                    </td>
                    <td>
                        {element.FEB.Jiangjin}
                    </td>
                    <td>
                        {element.FEB.Wuxiangfuli}
                    </td>
                    <td>
                        {element.MAR.Xiaoji}
                    </td>
                    <td>
                        {element.MAR.Gongzi}
                    </td>
                    <td>
                        {element.MAR.Jiangjin}
                    </td>
                    <td>
                        {element.MAR.Wuxiangfuli}
                    </td>
                    <td>
                        {element.APR.Xiaoji}
                    </td>
                    <td>
                        {element.APR.Gongzi}
                    </td>
                    <td>
                        {element.APR.Jiangjin}
                    </td>
                    <td>
                        {element.APR.Wuxiangfuli}
                    </td>
                    <td>
                        {element.MAY.Xiaoji}
                    </td>
                    <td>
                        {element.MAY.Gongzi}
                    </td>
                    <td>
                        {element.MAY.Jiangjin}
                    </td>
                    <td>
                        {element.MAY.Wuxiangfuli}
                    </td>
                    <td>
                        {element.JUN.Xiaoji}
                    </td>
                    <td>
                        {element.JUN.Gongzi}
                    </td>
                    <td>
                        {element.JUN.Jiangjin}
                    </td>
                    <td>
                        {element.JUN.Wuxiangfuli}
                    </td>
                    <td>
                        {element.JUL.Xiaoji}
                    </td>
                    <td>
                        {element.JUL.Gongzi}
                    </td>
                    <td>
                        {element.JUL.Jiangjin}
                    </td>
                    <td>
                        {element.JUL.Wuxiangfuli}
                    </td>
                    <td>
                        {element.AUG.Xiaoji}
                    </td>
                    <td>
                        {element.AUG.Gongzi}
                    </td>
                    <td>
                        {element.AUG.Jiangjin}
                    </td>
                    <td>
                        {element.AUG.Wuxiangfuli}
                    </td>
                    <td>
                        {element.SEP.Xiaoji}
                    </td>
                    <td>
                        {element.SEP.Gongzi}
                    </td>
                    <td>
                        {element.SEP.Jiangjin}
                    </td>
                    <td>
                        {element.SEP.Wuxiangfuli}
                    </td>
                    <td>
                        {element.OCT.Xiaoji}
                    </td>
                    <td>
                        {element.OCT.Gongzi}
                    </td>
                    <td>
                        {element.OCT.Jiangjin}
                    </td>
                    <td>
                        {element.OCT.Wuxiangfuli}
                    </td>
                    <td>
                        {element.NOV.Xiaoji}
                    </td>
                    <td>
                        {element.NOV.Gongzi}
                    </td>
                    <td>
                        {element.NOV.Jiangjin}
                    </td>
                    <td>
                        {element.NOV.Wuxiangfuli}
                    </td>
                    <td>
                        {element.DEC.Xiaoji}
                    </td>
                    <td>
                        {element.DEC.Gongzi}
                    </td>
                    <td>
                        {element.DEC.Jiangjin}
                    </td>
                    <td>
                        {element.DEC.Wuxiangfuli}
                    </td>
                    <td>
                        {element.JANTODEC.Xiaoji}
                    </td>
                    <td>
                        {element.JANTODEC.Gongzi}
                    </td>
                    <td>
                        {element.JANTODEC.Jiangjin}
                    </td>
                    <td>
                        {element.JANTODEC.Wuxiangfuli}
                    </td>
                </tr>
            )
        });
        return (
            <div className="tableWrap">

                <table className="table-thead">
                    <colgroup>
                        <col width="100" />
                        <col width="150" />
                        <col width="150" />
                        <col width="150" />
                        <col width="150" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th rowSpan="2">员工号</th>
                            <th rowSpan="2">员工姓名</th>
                            <th rowSpan="2">员工类别</th>
                            <th rowSpan="2">部门</th>
                            <th rowSpan="2">岗位</th>
                            <th colSpan="4">一月份工资收入</th>
                            <th colSpan="4">二月份工资收入</th>
                            <th colSpan="4">三月份工资收入</th>
                            <th colSpan="4">四月份工资收入</th>
                            <th colSpan="4">五月份工资收入</th>
                            <th colSpan="4">六月份工资收入</th>
                            <th colSpan="4">七月份工资收入</th>
                            <th colSpan="4">八月份工资收入</th>
                            <th colSpan="4">九月份工资收入</th>
                            <th colSpan="4">十月份工资收入</th>
                            <th colSpan="4">十一月份工资收入</th>
                            <th colSpan="4">十二月份工资收入</th>
                            <th colSpan="4">1-12 月份工资收入</th>
                        </tr>
                        <tr>
                            <th>小计</th>
                            <th>工资</th>
                            <th>奖金</th>
                            <th>五项福利</th>
                            <th>小计</th>
                            <th>工资</th>
                            <th>奖金</th>
                            <th>五项福利</th>
                            <th>小计</th>
                            <th>工资</th>
                            <th>奖金</th>
                            <th>五项福利</th>
                            <th>小计</th>
                            <th>工资</th>
                            <th>奖金</th>
                            <th>五项福利</th>
                            <th>小计</th>
                            <th>工资</th>
                            <th>奖金</th>
                            <th>五项福利</th>
                            <th>小计</th>
                            <th>工资</th>
                            <th>奖金</th>
                            <th>五项福利</th>
                            <th>小计</th>
                            <th>工资</th>
                            <th>奖金</th>
                            <th>五项福利</th>
                            <th>小计</th>
                            <th>工资</th>
                            <th>奖金</th>
                            <th>五项福利</th>
                            <th>小计</th>
                            <th>工资</th>
                            <th>奖金</th>
                            <th>五项福利</th>
                            <th>小计</th>
                            <th>工资</th>
                            <th>奖金</th>
                            <th>五项福利</th>
                            <th>小计</th>
                            <th>工资</th>
                            <th>奖金</th>
                            <th>五项福利</th>
                            <th>小计</th>
                            <th>工资</th>
                            <th>奖金</th>
                            <th>五项福利</th>
                            <th>小计</th>
                            <th>工资</th>
                            <th>奖金</th>
                            <th>五项福利</th>
                        </tr>
                    </thead>
                    <tbody>
                            {trs}
                        </tbody>
                </table>

                
            </div>

        );
    }
}

export default EmpGongziDan;

{/* <div className="comTbody">
                    <table className="table-tbody">
                        <colgroup>
                            <col width="100" />
                            <col width="150" />
                            <col width="150" />
                            <col width="150" />
                            <col width="150" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                            <col width="100" />
                        </colgroup>
                        
                    </table>
                </div> */}