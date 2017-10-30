import React, { Component } from 'react';
import { Form, Radio, message } from 'antd'

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as submit from '../redux/actions/TableOperation'
import Api from '../api'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class ModalDelate extends Component{
	submits = ()=>{
		this.props.form.validateFields((err, values) => {
			this.props.cancelDispatch();
			if (!err) {
				Api.delete({id: this.props.row._id,...values})
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
				label="删除原因">
				{
					this.props.form.getFieldDecorator('reason', {
                        rules:[{
                            required: true,
                            message: '未选择删除原因',
                        }]
                    })(<RadioGroup>
						<Radio value="房源已出租">房源已出租</Radio>
						<Radio value="暂不出租">暂不出租</Radio>
						<Radio value="其他原因">其他原因</Radio>
					</RadioGroup>)
				}
					
				</FormItem>
			</Form>
		)
	}
}
ModalDelate = Form.create()(ModalDelate);
function mapStateToProps(state) {
  return {isSubmit:state.submits.submits}
}
function mapDispatchToProps(dispatch,ownProps){
    return  bindActionCreators(submit,dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(ModalDelate);