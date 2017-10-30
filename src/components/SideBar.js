import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom'
// const SubMenu = Menu.SubMenu;
const key = sessionStorage.getItem('key');
class SideBar extends Component {
    state = {
        key: key?[key]:['1']
    }
    setKey = (key)=>{
        sessionStorage.setItem('key',key)
    }
    componentWillMount(){
        this.setState({
            key: key?[key]:['1']
        })
    }
    render() {
        return (
            <Menu
            defaultSelectedKeys={this.state.key}
            defaultOpenKeys={['sub1']}
            mode="inline"
            inlineCollapsed={this.props.collapsed}
            theme="dark">
                <Menu.Item key="1">
                    <Link to="/" onClick={this.setKey.bind(this,1)}>
                        <Icon type="home" />
                        <span>首页</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="2" >
                    <Link to="/index" onClick={this.setKey.bind(this,2)}>
                        <Icon type="appstore-o"/>
                        <span>房源管理</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="3" >
                <Link to="/user" onClick={this.setKey.bind(this,3)}>
                    <Icon type="user-add" />
                    <span>用户管理</span>
                </Link>
            </Menu.Item>
            </Menu>
        );
    }
}

export default SideBar