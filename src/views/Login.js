import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Card, Input,Icon,Form, Button, message} from 'antd';
import {bindActionCreators} from 'redux';
import * as loginAction from '../redux/actions/login'
import { Redirect } from 'react-router-dom';

const FormItem = Form.Item;
const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    };
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
        }
    }
    handleLogin(e){
         e.preventDefault();
         this.props.form.validateFields((err, values) => {
          if (!err) {
            this.props.login({...values,type: 1})
          }
        });
        
            // user_mobile: 15989411244,
            // pwd: 'test123456',
            // type: 1
        
    }
    componentWillReceiveProps(nextProps){
        if( !!!nextProps.userLogin.errcode && nextProps.userLogin.errcode === 0 ){
            message.success('登录成功');
            this.setState({
                isAuthenticated: true
            })
        }else if(!!nextProps.userLogin.errcode){
            message.error('账号或密码错误');
            this.props.loginFail();
        }
        

    }
    render() {
        const state = this.props.location.state || {from: '/'};
        // const state = this.props.location.state || {from: '/index'};
        return (
            <Card title="登录" className="login">
               <Form onSubmit={this.handleLogin.bind(this)} hideRequiredMark={true}>
                    <FormItem label="用户名" {...formItemLayout} hasFeedback>
                        {
                            this.props.form.getFieldDecorator('mobile', {
                                validateTrigger: 'onBlur',
                                rules:[{
                                    message: '请输入正确的手机号码',
                                    pattern: /^1(3|5|7|8)[0-9]{9}$/g,
                                },{
                                    required: true,
                                    message: '用户名不能为空',
                                }]
                            })(<Input
                                placeholder="请输入用户名"
                                prefix={<Icon type="user" />}
                            />)
                        }
                        
                    </FormItem>
                    <FormItem label="密码" {...formItemLayout} hasFeedback>
                        {
                            this.props.form.getFieldDecorator('password', {
                                
                                rules:[{
                                    required: true,
                                    message: '请输入密码',
                                }]
                            })(<Input
                                type="password"
                                placeholder="请输入密码"
                                prefix={<Icon type="key" />}
                            />)
                        }
                        
                    </FormItem>
                    <div className="login-buttons">
                        <Button type="primary" htmlType="submit">登录</Button><Button >取消</Button>
                   </div>
               </Form>
               {
                    this.state.isAuthenticated?(<Redirect to={{pathname:state.from}}/>):(
                        null
                    )
               }
            </Card>
        )
    }
}
Login = Form.create()(Login);

function mapStateToProps(state) {
  return {userLogin: state.userLogin}
}
function mapDispatchToProps(dispatch,ownProps){
    return  bindActionCreators(loginAction,dispatch)
}
export default connect(mapStateToProps,mapDispatchToProps)(Login);