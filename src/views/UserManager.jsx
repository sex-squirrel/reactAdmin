import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userLists from '../redux/actions/userList';
import { Form, Select, Input, Button, Tabs, Table, notification} from 'antd';
import Api from '../api'
import '../assets/user.css';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
class UserManager extends Component {
    constructor(props){
        super(props)
        this.state = {
            /*关键词切换*/
            selectChange: "1",
            /*查询条件*/
            search: {
                page: 1,
                pageSize: 10,
                search_name:'',
                search_mobile: '',
                search_role: '',
                search_status: ''
            },
            /*表格头部*/
            columns: [
                {
                    title: '用户名',
                    dataIndex: 'name',
                    key: 'user_name',
                    width: 100
                }, {
                    title: '手机号',
                    dataIndex: 'mobile',
                    width: 120,
                    key: 'mobile'
                }, {
                    title: '用户类型',
                    dataIndex: 'role',
                    width: 120,
                    key: 'role',

                }, {
                    title: '操作',
                    width: 120,
                    key: 'operation',
                    render: (row) => {
                        if (row.status === 0)
                            return (<Button type="danger" onClick={this.handleDele.bind(this,row)}>删除</Button>)
                        return (<Button type="primary" onClick={this.handleEnable.bind(this,row)}>恢复</Button>)
                    }
                }
            ],

            tableSet: {
                bordered: true
            },
            pagination: {
                showSizeChanger: true,
                onChange: this.pageChange,
                onShowSizeChange: this.pageSizeChange
            },
        }
    }
    //切换标签
    handleTabChange = (key)=>{
        if (key === '2'){
            this.setState({
                search: Object.assign({},this.state.search,{
                    page: 1,
                    pageSize: 10,
                    search_status: 1
                })
            },()=>{
                this.props.getUserList(this.state.search)
            })
        }else{
            this.setState({
                search: Object.assign({},this.state.search,{
                    page: 1,
                    pageSize: 10,
                    search_status: 0
                })
            },()=>{
                this.props.getUserList(this.state.search)
            })
        }
    }
    //选择关键词
    handleSelectChange = (value)=>{
        document.querySelector('input[placeholder]').value = '';
        this.setState({
            selectChange:value
        })
        if (value === '1'){
            this.setState({
                search: Object.assign({},this.state.search,{
                    search_mobile: ''
                })
            })
        }else{
            //this.refs.name.value = '';
            this.setState({
                search: Object.assign({},this.state.search,{
                    search_name: ''
                })
            })
        }
    }
    handleBlur = (e)=>{
        if (e.target.value){
            if (this.state.selectChange === '1'){
                this.setState({
                    search: Object.assign({},this.state.search,{
                        search_name: e.target.value
                    })
                })
            }else{
                this.setState({
                    search: Object.assign({},this.state.search,{
                        search_mobile: e.target.value
                    })
                })
            }
        }else{
            this.setState({
                search: Object.assign({},this.state.search,{
                    search_mobile: e.target.value,
                    search_name: e.target.value
                })
            })
        }
    }
    //搜索清除
    handleClear = () =>{
        document.querySelector('input[placeholder]').value = '';
        this.setState({
            search: Object.assign({},this.state.search,{
                search_mobile: '',
                search_name: ''
            })
        })
    }
    //搜索
    handleSearch = ()=>{
        this.props.getUserList(this.state.search)
    }
    //改变分页展示
    pageChange = (page, pageSize) => {
        this.setState({
            search: Object.assign({},this.state.search,{
                page: page,
                pageSize:pageSize
            })
        },()=>{
            this.props.getUserList(this.state.search)
        })
    }
    pageSizeChange = (current, pageSize) => {
        this.setState({
            search: Object.assign({},this.state.search,{
                page: current,
                pageSize:pageSize
            })
        },()=>{
            this.props.getUserList(this.state.search)
        })
    }
    //删除用户
    handleDele = (row)=>{
        Api.userDisable({
            id: row.id
        }).then(res=>{
            if (res.errcode === 0){
                notification.success({
                    message: '删除成功',
                    description: '已经成功禁用该用户'
                });
                this.props.getUserList(this.state.search)
            }else{
                notification.error({
                    message: '操作失败',
                    description: '该用户可能已经被禁用'
                });
            }
        })
    }
    //启用用户
    handleEnable = (row)=>{
        Api.userEnable({
            id: row.id
        }).then(res=>{
            if (res.errcode === 0){
                notification.success({
                    message: '操作成功',
                    description: '已经成功启用该用户'
                });
                this.setState({
                    search: Object.assign({},this.state.search,{
                        search_status: 1
                    })
                },()=>{
                    this.props.getUserList(this.state.search)
                })
            }else{
                notification.error({
                    message: '操作失败',
                    description: '该用户可能已经被启用'
                });
            }
        })
    }
    //添加用户
    handleAddUser = ()=>{
        this.props.history.push('/adduser')
    }
    componentDidMount(){
        this.props.getUserList(this.state.search)
    }
    render(){
        const TabExtra = <Button type="primary" onClick={this.handleAddUser}>新增用户</Button>;
        return (
            <div className="user-wrap">
                <Form
                    layout="inline">
                    <FormItem
                    label="关键词">
                        <Select
                            style={{
                                width: 150
                            }}
                            defaultValue="1"
                            onChange={this.handleSelectChange}
                            placeholder="选择关键词">
                            <Option value="1" select>用户名</Option>
                            <Option value="2" >手机号</Option>
                        </Select>
                    </FormItem>
                    {
                        this.state.selectChange === '1'
                            ?(<FormItem>
                                {
                                    this.props.form.getFieldDecorator('name',{
                                        rules:[{
                                            //message: '请输入正确的手机号码',
                                            //pattern: /^1(3|5|7|8)[0-9]{9}$/g
                                        }]
                                    })(<Input
                                        onBlur={this.handleBlur}
                                        placeholder="输入用户名"/>)
                                }

                            </FormItem>)
                            :(<FormItem>
                                {
                                    this.props.form.getFieldDecorator('mobile',{
                                        validateTrigger: 'onBlur',
                                        rules:[{
                                            message: '请输入正确的手机号码',
                                            pattern: /^1(3|5|7|8)[0-9]{9}$/g}]
                                    })(<Input
                                        onBlur={this.handleBlur}
                                        placeholder="输入手机号"/>)
                                }

                            </FormItem>)
                    }


                    <FormItem>
                        <Button
                            onClick={this.handleSearch}
                            type="primary">搜索</Button>
                    </FormItem>
                    <FormItem>
                        <Button onClick={this.handleClear}>清除</Button>
                    </FormItem>
                </Form>
                <div className="user-tab-wrap">
                    <Tabs
                        onChange={this.handleTabChange}
                        tabBarExtraContent={TabExtra}>
                        <TabPane
                            tab={`用户列表`} key="1">
                            <Table
                                columns={this.state.columns}
                                {...this.state.tableSet}
                                pagination={this.state.pagination}
                                dataSource={this.props.table.list}/>
                        </TabPane>
                        <TabPane
                            tab={`禁用列表`} key="2">
                            <Table
                                columns={this.state.columns}
                                {...this.state.tableSet}
                                pagination={this.state.pagination}
                                dataSource={this.props.table.list}/>
                        </TabPane>
                    </Tabs>
                </div>

            </div>
        )
    }
}
function mapStateToProps(state) {
    return {table:state.getUserLists};
}
function mapDispatchToProps(dispatch,ownProps){
    return  bindActionCreators(userLists,dispatch)
}
UserManager = Form.create()(UserManager)
export default connect(mapStateToProps,mapDispatchToProps)(UserManager)