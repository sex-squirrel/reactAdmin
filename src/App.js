import React, { Component } from 'react';
import { HashRouter  as Router, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import './App.css'
import Login from './views/Login'
import Index from './views/Index'
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            from: '/',
            token:''
        };
    }
    componentWillMount() {
        let token = window.localStorage.getItem('token');
        if (!!token) {
            this.setState({
                isAuthenticated: true,
                token: token
            });
        }
    }
    componentWillReceiveProps(nextProps) {
        // if (!(this.props.location.pathname == nextProps.location.pathname)) {
        //     this.setState({
        //         from: this.props.location.pathname
        //     });
        // }
        let token = localStorage.getItem('token');
        if (!!nextProps.token) {
            this.setState({
                isAuthenticated: true,
                token:nextProps.token
            });
            localStorage.setItem('token', nextProps.token);
        }else if(!!token){
            this.setState({
                isAuthenticated: true
            });
        }else{
            this.setState({
                isAuthenticated: false
            });
        }
    }
    render() {
        return (
            <Router>
                 <div className="wrap">
                    <Switch>
                        <Route exact={true} path="/login" component={Login}/>
                        {
                            this.state.isAuthenticated ? (null) : (<Redirect  to={{
                                pathname: '/login',
                                state: {
                                    from: this.state.from
                                }
                            }}/>)
                        }
                        <Route exact={true} path="/" component={Index}/>
                        <Route exact={true} path="/:type" component={Index}/>
                    </Switch>
                    <Spin className="loading" spinning={this.props.loading} delay={100}/>
                </div>
            </Router> 
        );
    }
}
const mapStateToProps = (state) => {
    let token = ''
    if (state.userLogin.data && state.userLogin.data.token) {
        token = state.userLogin.data.token;
    }
    return {
        loading: state.loadings.loding,
        token: token
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
