import React, { Component } from 'react';
import './AccessManagement.css';
import { Button, Table, Form, Dialog, Input, Select, Loading } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';


class AccessManagement extends Component {
    constructor(props) {
        super(props);
        var self = this;
        var rowKey = 0;
        this.state = {
            rows: [],
            fullscreen: true,
            columns: [
                {
                    label: "id",
                    prop: "id",
                    width: 100,
                    align: 'center'
                },
                {
                    label: "姓名",
                    prop: "empName",
                    width: 220,
                    align: 'center'
                },
                {
                    label: "用户名",
                    prop: "username",
                    width: 150,
                    align: 'center'
                },
                {
                    label: "用户角色",
                    prop: "jobRole",
                    width: 150,
                    align: 'center'
                },
                {
                    label: "操作",
                    prop: "username",
                    width: 300,
                    render: function () {
                        return (
                            <span>
                                <Button plain={true} type="info" size="small" onClick={e => self.handleEditClick(e)}>编辑</Button>
                                <Button type="danger" size="small" onClick={e => self.handleDeleteClick(e)}>删除</Button>
                            </span>
                        )
                    }
                }
            ],
            editUser: {},
            newUser: {},
            showEditUserDialog: false,
            showResetPassword: 'none',
            showCreateUserDialog: false,

        }
    }
    handleEditClick(REACTElements) {
        const curTarget = REACTElements.currentTarget;
        const username = curTarget.parentNode.parentNode.parentNode.parentNode.childNodes[2].childNodes[0].innerHTML;
        let nstate = Object.assign({}, this.state);
        for (let i = 0; i < nstate.rows.length; i++) {
            if (nstate.rows[i].username === username) {
                nstate.editUser = nstate.rows[i];
                break;
            }
        }
        nstate.showEditUserDialog = true;
        this.setState(nstate);
    }
    handleDeleteClick(REACTElements) {
        const curTarget = REACTElements.currentTarget;
        const username = curTarget.parentNode.parentNode.parentNode.parentNode.childNodes[2].childNodes[0].innerHTML;
        if (username && username !== '') {
            this.setState({ fullscreen: true });
            AppStore.deleteApplicationUsers(username).then(res => {
                console.log(res);
                if (res.status ===200) {
                    this.setState({ rows: res.data, fullscreen: false });
                } else {
                    this.setState({ fullscreen: false });
                    AppStore.showError(JSON.stringify(res.message));
                }
            })
        }
    }
    componentDidMount() {
        AppStore.getAllApplicationUsers().then(res => {
            if (res.status === 200) {
                this.setState({ rows: res.data, fullscreen: false });
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(JSON.stringify(res.message));
            }

        })
    }
    handleCreateNew() {
        this.setState({
            showCreateUserDialog: true
        })
    }
    handleEditSave() {
        this.setState({ fullscreen: true });
        AppStore.updateApplicationUser(this.state.editUser).then(res => {
            if (res.status === 200) {
                this.setState({
                    editUser: {},
                    newUser: {},
                    showEditUserDialog: false,
                    showResetPassword: 'none',
                    showCreateUserDialog: false,
                    rows: res.data,
                    fullscreen: false
                })
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(res.message);
            }
        })
    }
    handleCreateSave() {
        let newUser = this.state.newUser;
        if (!newUser.username) {
            AppStore.showError("请输入用户名");
            return;
        } else if (!this._validateUserName(newUser.username)) {
            return;
        }
        if (!newUser.password || newUser.password.length < 8) {
            AppStore.showError("密码最少需要8位字符！")
            return;
        }
        if (!newUser.jobRole || newUser.jobRole === "") {
            AppStore.showError("请选定用户角色")
            return;
        }
        if (!newUser.empName || newUser.empName === "") {
            AppStore.showError("请输入用户全名")
            return;
        }

        this.setState({ fullscreen: true });
        AppStore.createNewApplicationUser(newUser).then(res => {
            if (res.status === 200) {
                this.setState({
                    editUser: {},
                    newUser: {},
                    showEditUserDialog: false,
                    showResetPassword: 'none',
                    showCreateUserDialog: false,
                    rows: res.data,
                    fullscreen: false
                })
            } else {
                this.setState({ fullscreen: false });
                AppStore.showError(res.message);
            }
        })

    }
    _validateUserName(text) {
        let numbers = '0123456789.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@';
        let validate = true;
        for (var i = 0; i < text.length && validate; i++) {
            if (numbers.indexOf(text[i]) < 0) {
                AppStore.showError("用户名字段只能接受英文字母！！")
                validate = false;
                break;
            }
        }
        if (text.length < 6) {
            AppStore.showError("用户名最少6位字符")
            validate = false;
        }
        return validate;
    }
    showResetPassword() {
        let editUser = Object.assign({}, this.state.editUser);
        editUser.password = '';
        this.setState({
            showResetPassword: true,
            editUser: editUser
        })
    }
    handleCancel() {
        let nstate = Object.assign({}, this.state);
        nstate.editUser = {};
        nstate.newUser = {};
        nstate.showEditUserDialog = false;
        nstate.showResetPassword = 'none';
        nstate.showCreateUserDialog = false;
        this.setState(nstate);
    }
    handleEditEmpNameChange(value) {
        let editUser = this.state.editUser;
        editUser.empName = value;
        this.setState({ editUser: editUser });
    }
    handleEditJobRoleChange(value) {
        let editUser = this.state.editUser;
        editUser.jobRole = value;
        this.setState({ editUser: editUser });
    }
    handleEditPasswordChange(value) {
        let editUser = this.state.editUser;
        editUser.password = value;
        this.setState({ editUser: editUser });
    }
    handleCreateEmpNameChange(value) {
        let newUser = this.state.newUser;
        newUser.empName = value;
        this.setState({ newUser: newUser });
    }
    handleCreatejobRoleChange(value) {
        let newUser = this.state.newUser;
        newUser.jobRole = value;
        this.setState({ editUser: newUser });
    }
    handleCreatePasswordChange(value) {
        let newUser = this.state.newUser;
        newUser.password = value;
        this.setState({ editUser: newUser });
    }
    handleCreateUserNameChange(value) {
        let newUser = this.state.newUser;
        newUser.username = value;
        this.setState({ editUser: newUser });
    }
    render() {
        return (
            <div className="UserBodyContainer">
                {
                    this.state.fullscreen && <Loading fullscreen={true} />
                }
                <div className="UserTopMenuContainer">
                    <Form labelWidth="50">
                        <Form.Item style={{ display: "inline-block" }}>
                            <Button type="primary" onClick={this.handleCreateNew.bind(this)}>新建用户</Button>
                        </Form.Item>
                    </Form>
                </div>
                <Table
                    style={{ width: '100%' }}
                    columns={this.state.columns}
                    border={true}
                    data={this.state.rows}
                />
                <Dialog
                    title="编辑用户"
                    visible={this.state.showEditUserDialog}
                    onCancel={this.handleCancel.bind(this)}
                >
                    <Dialog.Body>
                        <Form>
                            <Form.Item label="用户名:" labelWidth="120">
                                <span>{this.state.editUser.username}</span>
                            </Form.Item>
                            <Form.Item label="密码:" labelWidth="120" style={{ display: this.state.showResetPassword }}>
                                <Input value={this.state.editUser.password} type="password" onChange={this.handleEditPasswordChange.bind(this)}></Input>
                            </Form.Item>
                            <Form.Item label="姓名:" labelWidth="120">
                                <Input value={this.state.editUser.empName} onChange={this.handleEditEmpNameChange.bind(this)}></Input>
                            </Form.Item>
                            <Form.Item label="用户角色:" labelWidth="120">
                                <Select value={this.state.editUser.jobRole} placeholder="请选择用户角色" onChange={this.handleEditJobRoleChange.bind(this)} >
                                    <Select.Option label="系统管理员" value="SysAdmin"></Select.Option>
                                    <Select.Option label="工资管理员" value="PayrollAdmin"></Select.Option>
                                    <Select.Option label="人力资源管理员" value="HRAdmin"></Select.Option>
                                    <Select.Option label="一般用户" value="User"></Select.Option>
                                </Select>
                            </Form.Item>


                        </Form>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button type="primary" onClick={this.handleCancel.bind(this)}>取 消</Button>
                        <Button type="primary" onClick={this.handleEditSave.bind(this)}>确 定</Button>
                        <Button type="primary" onClick={this.showResetPassword.bind(this)}>重置密码</Button>
                    </Dialog.Footer>
                </Dialog>
                <Dialog
                    title="新建用户"
                    visible={this.state.showCreateUserDialog}
                    onCancel={this.handleCancel.bind(this)}
                >
                    <Dialog.Body>
                        <Form>
                            <Form.Item label="用户名:" labelWidth="120">
                                <Input value={this.state.newUser.username} onChange={this.handleCreateUserNameChange.bind(this)}></Input>
                            </Form.Item>
                            <Form.Item label="密码:" labelWidth="120">
                                <Input value={this.state.newUser.password} type="password" onChange={this.handleCreatePasswordChange.bind(this)}></Input>
                            </Form.Item>
                            <Form.Item label="姓名:" labelWidth="120">
                                <Input value={this.state.newUser.empName} onChange={this.handleCreateEmpNameChange.bind(this)}></Input>
                            </Form.Item>
                            <Form.Item label="用户角色:" labelWidth="120">
                                <Select value={this.state.newUser.jobRole} placeholder="请选择用户角色" onChange={this.handleCreatejobRoleChange.bind(this)} >
                                    <Select.Option label="系统管理员" value="SysAdmin"></Select.Option>
                                    <Select.Option label="工资管理员" value="PayrollAdmin"></Select.Option>
                                    <Select.Option label="人力资源管理员" value="HRAdmin"></Select.Option>
                                    <Select.Option label="一般用户" value="User"></Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button type="primary" onClick={this.handleCancel.bind(this)}>取 消</Button>
                        <Button type="primary" onClick={this.handleCreateSave.bind(this)}>确 定</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        );
    }
}

export default AccessManagement;