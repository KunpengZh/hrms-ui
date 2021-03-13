import React, { Component } from 'react';
import './Employee.css';
import { Button } from 'element-react';
import 'element-theme-default';
import '../../font-awesome/css/font-awesome.min.css'
import Cascader from '../Share/Cascader'
import AppStore from '../../share/AppStore';

class TopMenu extends Component {
    handleCreateNew() {
        this.props.handleMenuActions("CreateNew");
    }
    render() {
        let filtersOpt = AppStore.getDataOptions("EmpInfo").CascaderMenu;
        return (
            <div className="TopMenu">
                <Cascader options={filtersOpt} />
                <Button type="primary" icon="search">过&nbsp;滤</Button>
                <Button type="primary" onClick={this.handleCreateNew.bind(this)} icon="plus">新&nbsp;建</Button>
                <Button type="primary" icon="upload">上&nbsp;传</Button>
            </div>
        );
    }
}

export default TopMenu;