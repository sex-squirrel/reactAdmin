import React, { Component } from 'react';
import { Form, Input, Radio,  message } from 'antd'

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as submit from '../redux/actions/TableOperation'
import Api from '../api'

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;

class ModalAuthen extends Component{
	submits = ()=>{
		this.props.form.validateFields((err, values) => {
			this.props.cancelDispatch();
			if (!err) {
				Api.quality({id: this.props.row._id,...values})
				.then(res=>{
					if (res.errcode === 0) {
						message.success(res.msg)
						this.props.getList();
						this.props.hide();
						this.props.form.resetFields();
					}else{
						message.error(res.msg)
					}
				})
			}
		})
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.isSubmit) {
			this.submits()
		}
	}
	render(){
		return (
			<Form hideRequiredMark={true}
			onSubmit={this.submits}>
				<FormItem
				labelCol={{span:3}}
				wrapperCol={{span:19}}
				label="业主标题">
				{
					this.props.form.getFieldDecorator('title', {
                        validateTrigger: 'onBlur',
                        initialValue: this.props.row.title,
                        rules:[{
                            required: true,
                            message: '标题不能为空',
                        }]
                    })(<Input maxLength={30}/>)
				}
				</FormItem>

				<FormItem
				labelCol={{span:3}}
				wrapperCol={{span:19}}
				label="房源点评">
					{
						this.props.form.getFieldDecorator('type_quality_desc', {
							initialValue: this.props.row.type_quality_desc,
	                        validateTrigger: 'onBlur',
	                        rules:[{
	                            required: true,
	                            message: '房源点评不能为空',
	                        }]
	                    })(<TextArea />)
					
					}
				</FormItem>

				<FormItem
				labelCol={{span:3}}
				wrapperCol={{span:19}}
				label="品质认证">
					{
						this.props.form.getFieldDecorator('type_quality', {
							initialValue: this.props.row.type_quality
	                    })(<RadioGroup>
								<Radio value="1">精品房源</Radio>
								<Radio value="2">经济房源</Radio>
							</RadioGroup>)
					
					}
				</FormItem>
			</Form>
		)
	}
}

ModalAuthen = Form.create()(ModalAuthen);
function mapStateToProps(state) {
  return {isSubmit:state.submits.submits}
}
function mapDispatchToProps(dispatch,ownProps){
    return  bindActionCreators(submit,dispatch)
}
export default connect(mapStateToProps,mapDispatchToProps)(ModalAuthen);