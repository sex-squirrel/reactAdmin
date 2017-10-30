import React, {Component} from 'react';
import { Icon } from 'antd';
import store from '../redux/store'
class TopBar extends Component {
    logout = ()=>{
        window.localStorage.clear();
        window.sessionStorage.clear();
        store.dispatch({type:'LOGIN_OUT'})
        this.props.history.replace('/login')
    }
    render() {
        return (
            <div className="top-bar">
                <Icon type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                      onClick={this.props.toggle}
                      style={{paddingLeft:20}}/>
                <span className="title">租房管理后台</span>
                <span className="login-out" onClick={this.logout}>退出</span>
            </div>
        )
    }
}

export default TopBar