import React, { Component } from 'react';
import './AccessManagement.css';
import { Button, Table, Form } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'

import AppStore from '../../share/AppStore';


class AccessManagement extends Component {
    constructor(props) {
        super(props);
        var self = this;
        var handleEditClick = function (value) {
            console.log(value)
        }
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
                                <Button plain={true} type="info" size="small" onClick={self.handleEditClick}>编辑</Button>
                                <Button type="danger" size="small" >删除</Button>
                            </span>
                        )
                    }
                }
            ]
        }
    }
    handleEditClick(value) {
        console.log(value)
    }
    handleDeleteClick(value) {
        console.log(value);
    }
    componentDidMount() {
        AppStore.getAllApplicationUsers().then(res => {
            console.log(res);
            this.setState({ rows: res.data });
        })
    }
    handleCreateNew() {

    }
    render() {
        return (
            <div className="UserBodyContainer">
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
            </div>
        );
    }
}

export default AccessManagement;