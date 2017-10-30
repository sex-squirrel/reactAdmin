import React, { Component } from 'react';
import { Card, Button, Form, Input, Select, Cascader, TreeSelect } from 'antd'
// import SearchSelect from '../components/SearchSelect'
import '../assets/user.css'

const FormItem = Form.Item;
const Option = Select.Option;
const options  = [
    {
        value: 'gd',
        label: '广东省',
        children: [{
            value: 'sz',
            label: '深圳市'
        }]
    },{
        value: 'hn',
        label: '河南省',
        children: [{
            value: 'zz',
            label: '郑州市'
        }]
    }
]
const treeData = [
    {
        label: '南山区',
        value: 'nsq',
        key: '1',
        title: '南山区',
        selectable: false,
        children: [{
            label: '光感小区',
            value: 'gg',
            key: '1-1',
            selectable: true
        }]
    },
]
const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 17
    },
  };


class AddUser extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }
    handleBack = ()=>{
        this.props.history.push('/user')
    }
    render(){
        return (
            <div style={{marginTop: 20}}>
                <Card
                    title="用户新增"
                    extra={<Button type="primary" onClick={this.handleBack.bind(this)}>返回</Button>}>

                    <Form
                        style={{marginBottom: 25}}
                        layout="inline">
                        <FormItem
                            className="item-bottom"
                            label="省市选择">
                            <Cascader
                                defaultValue={[options[0].value,options[0].children[0].value]}
                                placeholder="请选择区域"
                                options={options}
                                style={{width: 200}}
                            />
                        </FormItem>
                        <br/>
                        <FormItem
                            className="item-bottom"
                            label="用户姓名">
                            <Input 
                                style={{minWidth: 200}}
                                placeholder="请输入姓名"/>
                        </FormItem>
                        <br/>
                        <FormItem
                            className="item-bottom"
                            label="用户类型">
                            <Select
                                placeholder="请选择用户类型"
                                style={{minWidth: 200}}>
                                <Option value="type0">嘿芝麻平台</Option>
                                <Option value="type1">物业</Option>
                            </Select>
                        </FormItem>
                        {/*此处为动态渲染*/}
                        <FormItem
                            className="item-bottom"
                            label="物业名称">
                            <Select
                                mode="combobox"
                                placeholder="请选择物业"
                                style={{minWidth: 200}}>
                                <Option value="type0">嘿芝麻平台</Option>
                                <Option value="type1">物业</Option>
                            </Select>
                        </FormItem>

                        <br/>
                        <FormItem
                            className="item-bottom"
                            label="关联小区">
                            <TreeSelect
                                placeholder="选择要绑定的小区"
                                treeData={treeData}
                                allowClear
                                multiple
                                treeDefaultExpandAll
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                style= {
                                    {width: 200,}
                                }></TreeSelect>
                        </FormItem>
                        <br/>
                        <FormItem
                            {...formItemLayout}
                            className="item-bottom"
                            label="手机号">
                            <Input 
                                style={{minWidth: 200}}
                                placeholder="请输入手机号"/>
                        </FormItem>
                    </Form>


                    <div className="card-footer">
                        <div className="card-group">
                            <Button type="primary" style={{marginRight: 15}}>确定</Button>
                            <Button>取消</Button>
                        </div>
                    </div>
                </Card>

            </div>
        )
    }
}
export default AddUser