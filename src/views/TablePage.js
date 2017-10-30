import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, DatePicker, Select, Input, Button, Tabs, Table } from 'antd';
import Api from '../api'
import { listOperation } from '../api/dataOperation';
// import moment from 'moment';
import IModal from '../components/iModal'

/*表格操作按钮*/
import AButton from '../components/AButton'

// moment.locale('en');
const FormItem = Form.Item;
const Option = Select.Option;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;

class TablePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            /*提交表单*/
            data:{},
            /*查询条件*/
            search: {
                page: 1,
                pageSize: 10,
                search_tag: 1,
                created_at_min: '',
                created_at_max: '',
                contact_name: ''
            },
            /*列表数据*/
            dateSource: [],
            /*表格头部*/
            columns: [
                {
                    title: '图片',
                    dataIndex: 'images',
                    key: 'images',
                    width: 100,
                    render: (images) => {
                        return (<img
                            src={images}
                            style={{
                                maxWidth: '100%',
                                maxHeight: 100,
                            }} alt="pic" />);
                    }
                }, {
                    title: '房源信息',
                    dataIndex: 'houseInfo',
                    width: 120,
                    key: 'houseInfo',
                    render: (houseInfo)=>{
                        const children = []
                        for(let key in houseInfo){
                            if (key === 'dec') {
                                children.push(<div key={key} style={{color:'#49a9ee'}}>{houseInfo[key]}</div>) 
                            }else if (key === 'building') {
                                children.push(<div key={key}>{houseInfo[key]}</div>) 
                            }else if (key === 'key') {
                                children.push(<div key={key} style={{color:'#FF0000'}}>{houseInfo[key]}</div>) 
                            }
                        }
                        return (<div>{children}</div>);
                    }
                }, {
                    title: '业主',
                    dataIndex: 'owners',
                    width: 120,
                    key: 'owners',
                    render: (owners)=>{
                        const children = []
                        for(let key in owners){
                            if (key === 'name') {
                                children.push(<div key={key}>{owners[key]}</div>) 
                            }else if (key === 'from') {
                                children.push(<div key={key}>来自:{owners[key]}</div>) 
                            }else if (key === 'time') {
                                children.push(<div key={key}>委托时间:{owners[key]}</div>) 
                            }
                        }
                        return (<div>{children}</div>);
                    }
                }, {
                    title: '状态',
                    dataIndex: 'status_manage_label',
                    width: 120,
                    key: 'status_manage_label'
                },
                //  {
                //     title: '最后操作记录',
                //     dataIndex: 'lastLog',
                //     width: 120,
                //     key: 'lastLog'
                // },
                 {
                    title: '操作',
                    width: 120,
                    key: 'operation',
                    render: (row) => <AButton buttons={this.state.buttons} row={row}/>
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
            /*打开新标签的参数*/
            create: true,
            row: {},
            /*模态对话框*/
            visible: false,
            hide: ()=>{
                this.setState({
                    visible: false,
                })
            },
            modal: {
                type: 'audit',
                title: '房源审核',
            },
            /*标签页切换处理*/
            tabs:{
                status_quality_pending: 0,
                status_manage_pending: 0,
                status_manage_online: 0,
                status_manage_offline: 0
            },
            buttons:[{
                txt: '招租',
                clickHandle: this.openNewTab
            }],
            /*表格按钮处理*/
            showHandel: (row)=>{
                this.setState({
                    visible: true,
                    row: row,
                })
            },
            checkHouse: (row)=>{
                Api.detail({id:row._id})
                .then(res=>{
                    if (res.errcode === 0) {
                        this.setState({
                           visible: true,
                           row: res.data 
                        })
                    }
                })
            }
        };
        /*切换标签回调*/
        this.changeData = this.changeData.bind(this)
    }
    
    /*
        标签切换处理
    */
    changeData(key){
        switch(key){
            case '1':
                return {
                    buttons: Object.assign([],this.state.buttons,[{
                            txt: '招租',
                            clickHandle: this.openNewTab
                        }]),
                    modal:Object.assign({},this.state.modal,{type:'audit',title: '房源审核'})
                };
            case '2': 
                return {
                    buttons: Object.assign([],this.state.buttons,[{
                            txt: '审核',
                            clickHandle: this.state.checkHouse
                        },{
                        txt: '编辑',
                        clickHandle: this.state.checkHouse
                    }]),
                    modal:Object.assign({},this.state.modal,{type:'audit',title: '房源审核'})
                };
            case '3':
                return {
                     buttons: Object.assign([],this.state.buttons,[{
                            txt: '认证',
                            clickHandle: this.state.showHandel
                        }]),
                    modal:Object.assign({},this.state.modal,{type:'authen',title: '房源认证'})
                };
            case '4':
                return {
                     buttons: Object.assign([],this.state.buttons,[{
                            txt: '删除',
                            clickHandle: this.state.showHandel
                        }]),
                    modal:Object.assign({},this.state.modal,{type:'delete',title: '删除房源'})
                };
            case '5':
                return {
                     buttons: Object.assign([],this.state.buttons,[{
                            txt: '恢复',
                            clickHandle: this.state.showHandel
                        }]),
                    modal:Object.assign({},this.state.modal,{type:'restore',title: '删除房源'})
                };
            default:
                return {
                    buttons: Object.assign([],this.state.buttons,[{
                            txt: '招租',
                            clickHandle: this.openNewTab
                        }]),
                    modal:Object.assign({},this.state.modal,{type:'audit',title: '房源审核'})
                };
        }
    }
    /*不同表格渲染不同的按钮*/
    handelTabsChange(key){
        this.setState({
            buttons: this.changeData(key).buttons,
            modal: this.changeData(key).modal,
            search: Object.assign({},this.state.search,{
                search_tag: key,
                page: 1,//current
            }),
            pagination: Object.assign({},this.state.pagination, {current:1})
        },()=>{
            this.getList();
        })
        
    }
    openNewTab(){
        window.open(`${window.location.origin}/#/edit?id=${this.state.row._id}`)
    }
    openNewTabCreate(){
        window.open(`${window.location.origin}/#/create`)
    }
    formData = (data)=>{
        this.setState({
            data: data
        })
    }
    /*获取列表函数*/
    getList = ()=>{
        Api.list(this.state.search).then(res=>{
            this.setState({
                dateSource: listOperation(res.data),
            })
            if (res.data && res.data.statistics && res.data.statistics.length > 0) {
                 this.setState({
                   tabs:{
                        status_quality_pending: res.data.statistics.status_quality_pending,
                        status_manage_pending: res.data.statistics.status_manage_pending,
                        status_manage_online: res.data.statistics.status_manage_online,
                        status_manage_offline: res.data.statistics.status_manage_offline
                    }
                })    
            }
            if ( res.data && res.data.pagination) {
                this.setState({
                    pagination: Object.assign({},this.state.pagination, {total: res.data.pagination.total})
                })   
            }
        })
    }
    /*分页器*/
    pageChange = (page, pageSize) => {
        this.setState({
            search:  Object.assign({},this.state.search, {
                page: page,
                pageSize: pageSize,
            }),
            pagination: Object.assign({},this.state.pagination, {current:page})
        },()=>{
            this.getList();
        })
    }
    pageSizeChange = (current, pageSize) => {
        this.setState({
            search:  Object.assign({},this.state.search, {
                page: current,
                pageSize: pageSize,
            })
        },()=>{
            this.getList();
        })
    }
    /*搜索*/
    handleSubmit = (e)=>{
        e.preventDefault();
        let data = Object.assign({},this.state.search);
        this.props.form.validateFields((err, value)=>{
            if (!err) {
                if (value.name && value.name.length > 0) {
                    data['contact_name'] = value.name;
                }else{
                    data['contact_name'] = '';
                }
                if (value.date && value.date.length === 2) {
                    data['created_at_min'] = value.date[0].format('YYYY-MM-DD');
                    data['created_at_max'] = value.date[1].format('YYYY-MM-DD');
                }else{
                     data['created_at_min'] = '';
                     data['created_at_max'] = '';
                }
                data.page = 1;
               this.setState({
                search: data,
                pagination: Object.assign({},this.state.pagination, {current:1})
               },()=>{
                    this.getList();
               })
               // console.log(data)
            }
        })
    }
    resetSearch = ()=>{
        this.props.form.resetFields();
    }
    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted){
            this.getList();
        }
        
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    render() {
        const TabExtra = <Button type="primary" onClick={this.openNewTabCreate.bind(this)}>录入房源</Button>;
        return (
            <div className="table-content">
                <Form layout="inline"
                onSubmit={this.handleSubmit}>
                    <FormItem label="关键词" className="item-top item-left">
                    {
                        this.props.form.getFieldDecorator('contact_name',{
                            initialValue:'contact_name'
                        })(<Select
                            style={{
                                width: 150
                            }}>
                                <Option value="contact_name" select>业主</Option>
                            </Select>)
                    }
                        
                    </FormItem>
                    <FormItem className="item-top">
                    {
                        this.props.form.getFieldDecorator('name',{
                        //rules:[{pattern:/^[\u4e00-\u9fa5]+$/g,message: '请输入正确的姓名'}] 
                        })(<Input placeholder="请输入姓名" />)  
                    }
                    </FormItem>
                    <FormItem className="item-top" label="录入日期">
                    {
                        this.props.form.getFieldDecorator('date',{
                            
                        })(<RangePicker />)    
                    }
                    </FormItem>
                    <Button className="item-top" type="primary" htmlType="submit">搜索</Button>
                    <Button
                    className="item-top"
                    onClick={this.resetSearch}
                    style={{
                        marginLeft: 20
                    }}>清除</Button>
                </Form>
                <div className="tabs">
                    <Tabs defaultActiveKey="1" tabBarExtraContent={TabExtra}
                    onChange={this.handelTabsChange.bind(this)}>
                        <TabPane tab={`待录入房源`} key="1">
                            <Table
                            columns={this.state.columns}
                            {...this.state.tableSet}
                            pagination={this.state.pagination}
                            dataSource={this.state.dateSource} />
                        </TabPane>
                        <TabPane tab={`待审核(${this.state.tabs.status_manage_pending})`} key="2">
                            <Table
                            columns={this.state.columns}
                            {...this.state.tableSet}
                            pagination={this.state.pagination}
                            dataSource={this.state.dateSource} />
                        </TabPane>
                        <TabPane tab={`待认证(${this.state.tabs.status_quality_pending})`} key="3">
                            <Table
                            columns={this.state.columns}
                            {...this.state.tableSet}
                            pagination={this.state.pagination}
                            dataSource={this.state.dateSource} />
                        </TabPane>
                        <TabPane tab={`发布中(${this.state.tabs.status_manage_online})`} key="4">
                            <Table
                            columns={this.state.columns}
                            {...this.state.tableSet}
                            pagination={this.state.pagination}
                            dataSource={this.state.dateSource} />
                        </TabPane>
                        <TabPane tab={`已删除(${this.state.tabs.status_manage_offline})`} key="5">
                            <Table
                            columns={this.state.columns}
                            {...this.state.tableSet}
                            pagination={this.state.pagination}
                            dataSource={this.state.dateSource} />
                        </TabPane>
                    </Tabs>
                </div>
                
                <IModal {...this.state.modal} visible={this.state.visible} hide={this.state.hide} row={this.state.row} type={this.state.modal.type} getList={this.getList}/>
            </div>
        );
    }
}
TablePage = Form.create()(TablePage);
export default connect()(TablePage);