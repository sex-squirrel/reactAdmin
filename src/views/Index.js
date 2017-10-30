import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import logoImg from '../assets/logo.png'
//页面组件
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';
//页面
import CreateHouse from '../views/CreateHouse';
import EditHouse from '../views/EditHouse';
import TablePage from '../views/TablePage';
import UserManager from '../views/UserManager.jsx'
import Chart from '../views/Chart';
import AddUser from '../views/AddUser'

class Index extends Component {
    constructor(props) {
        super(props);
        //表格头部
        this.state = {
            //菜单折叠
            collapsed: false,
            columns: [
                {
                    title: '图片',
                    dataIndex: 'pic',
                    key: 'pic',
                    width: 107,
                    render: (pic) => {
                        return (<img
                            src={pic}
                            style={{
                                maxWidth: 107,
                                maxHeight: 65
                            }} alt="pic"/>);
                    }
                }, {
                    title: '房源信息',
                    dataIndex: 'houseInfo',
                    width: 120,
                    key: 'houseInfo'
                }, {
                    title: '业主',
                    dataIndex: 'master',
                    width: 120,
                    key: 'master'
                }, {
                    title: '状态',
                    dataIndex: 'state',
                    width: 120,
                    key: 'state'
                }, {
                    title: '最后操作记录',
                    dataIndex: 'lastLog',
                    width: 120,
                    key: 'lastLog'
                }, {
                    title: '操作',
                    width: 120,
                    key: 'operation',
                    render: (row) => <a href="###">招租</a>
                }
            ],
            tableSet: {
                bordered: true,
                pagination: {
                    showSizeChanger: true
                },
                scroll: {
                    y: 500
                }
            }
        };
    }
    //菜单折叠
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps)
    // }
    render() {
        return (
            <div className="content" style={this.state.collapsed?{paddingLeft: 64}:{}}>
                <header className="head" style={this.state.collapsed?{paddingLeft: 64}:{}}>
                    <TopBar toggle={this.toggle} collapsed={this.state.collapsed} history={this.props.history}/>
                </header>
                <aside className="side-bar" style={this.state.collapsed?{width: 64}:{}}>
                    <div className="logo">
                        <img src={logoImg} style={this.state.collapsed?{width: 30, height: 30}:{}} alt="pic"/>
                        <span style={this.state.collapsed?{opacity: 0,width: 0, fontSize: 0}:{}}>嘿芝麻</span>
                    </div>;
                    <SideBar collapsed={this.state.collapsed}/>
                </aside>
                <section className="section">
                  <div className="section-content">
                    <Switch>
                        <Route exact={true} path="/" render={props=>(
                            <Chart {...props}/>
                        )}/>
                        <Route exact={true} path="/index" render={props=>(
                            <TablePage {...props}/>
                        )}/>
                        <Route exact={true} path="/create" render={props=>(
                            <CreateHouse {...props}/>
                        )}/>
                        <Route exact={true} path="/edit" render={props=>(
                            <EditHouse {...props}/>
                        )}/>
                        <Route exact={true} path="/user" render={props=>(
                            <UserManager {...props}/>
                        )}/>
                        <Route exact={true} path="/adduser" render={props=>(
                            <AddUser {...props}/>
                        )}/>
                    </Switch>
                  </div> 
                </section>
            </div>
        );
    }
}
export default connect()(Index);