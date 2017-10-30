import React, { Component } from 'react';
import { Form, Input, Checkbox, Radio,Button, Row, Col, Alert, message } from 'antd';
import { checkOperation } from '../api/dataOperation';
import Api from '../api';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as submit from '../redux/actions/TableOperation'

import Swiper from 'swiper';
const FormItem = Form.Item;
// const Option = Select.Option;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const CheckboxGroup = Checkbox.Group;


var swiper;
class ModalCheck extends Component{
	constructor(props) {
		super(props);
		this.state = {
			alertShow: false,
			info: checkOperation(this.props.row),
			title: false,
			desc: false,
			image: false
		}
	}
	submits = ()=>{
		
		this.props.form.validateFields((err,value)=>{
			this.props.cancelDispatch();
			let reson = [];
			for (let key in value) {
				if (value[key]) {
					if (key === 'title') {
						reson.push('标题不规范')
					}else if (key === 'desc') {
						reson.push('房源描述不规范')
					}else if (key === 'image') {
						reson.push('房源图片有问题')
					}else{
						reson.push(value[key])
					}
				}
			}
			Api.statusManage({id: this.props.row._id, reason_check_refuse: [...reson]})
			.then(res=>{
				if (res.errcode === 0) {
					message.success(res.msg)
					this.props.getList();
					this.props.hide();
					this.props.form.resetFields();
					this.setState({
						title: false,
						desc: false,
						image: false
					})
				}else{
					message.error(res.msg)
				}
			})
			
		})
		
		
	}
	validatePhone(value){
		Api.checkMobile({mobile: value.mobile})
		.then(res=>{
			if (res.errcode === 0) {
				this.setState({alertShow: true})
			}
			
		})
		
	}
	componentWillReceiveProps(nextProps) {
		if ( !(nextProps.row._id === this.props.row._id)) {
			this.props.form.resetFields();
			this.setState({
				title: false,
				desc: false,
				image: false,
                alertShow: false,
			})
		}
		
		this.setState({
			info: checkOperation(nextProps.row),
		})
		if (nextProps.isSubmit) {
			this.submits()
		}
	}
	onChange = (e)=>{
		if (e.target.id === 'title') {
			this.setState({title: e.target.checked})
		}else if (e.target.id === 'desc') {
			this.setState({desc: e.target.checked})
		}else if (e.target.id === 'image') {
			this.setState({image: e.target.checked})
		}
	}
	
	componentDidMount() {
		swiper = new Swiper('.swiper-container', {
		 	speed:1000,
	        slidesPerView :  4,
			slidesPerGroup : 4,
	        spaceBetween: 20,
	        observer:true,
	        nextButton: '.swiper-button-next',
        	prevButton: '.swiper-button-prev',
	    });
	}
	componentDidUpdate(prevProps, prevState) {
		// console.log(swiper)
		swiper.update()
	}
	render(){
		const ownersArr = [];
		const image = [];
		this.props.row.images_udpate.map((item,index) => {
			image.push(<div className="swiper-slide" key={item+index}>
				           <img src={item} alt="pic"/>
						</div>)	
			return 1;
		})
		if (this.state.info.owners.length > 1) {
			for (let i = 0; i < this.state.info.owners.length; i++) {
				ownersArr.push(<FormItem
				style={{marginBottom: 5}}
				labelCol={{span:4}}
				wrapperCol={{span:19}}
				label={`联系人${i+1}`}>
					<Row gutter={10}>
						<Col span="6">
							<Input value={this.state.info.owners[i].name} disabled/>
						</Col>
						<Col span="6">
							<Input value={this.state.info.owners[i].mobile} disabled/>
						</Col>
						<Col span="4">
							<Button className="success-button" size="small" onClick={this.validatePhone.bind(this,this.state.info.owners[i])}>验证电话</Button>
						</Col>
					</Row>
				</FormItem>)
			}
		}
		return (
			<Form>
				<FormItem
				style={{marginBottom: 5}}
				labelCol={{span:4}}
				wrapperCol={{span:19}}
				label="业主">
					<Row gutter={10}>
						<Col span="6">
							<Input value={this.state.info.contact} disabled/>
						</Col>
						<Col span="6">
							<Input value={this.state.info.contact_mobile} disabled/>
						</Col>
						<Col span="4">
							<Button className="success-button" size="small" onClick={this.validatePhone.bind(this,{name:this.state.info.contact,mobile:this.state.info.contact_mobile})}>验证电话</Button>
						</Col>
						
					</Row>
				</FormItem>
				{ownersArr}
				<Row>
					<Col span="20" offset="4">
						{
							this.state.alertShow
								?(<Alert message="正式库中未发现疑似重复房源" type="warning" style={{marginTop: 5}}/>)
								:(null)
						}
					</Col>
				</Row>
				<FormItem
				style={{marginBottom: 5}}
				labelCol={{span:4}}
				wrapperCol={{span:20}}
				label="电话状态">
					<Row gutter={10}>
					{
						this.props.form.getFieldDecorator('phone')(<RadioGroup  size="large">
						      <Radio value="电话无人接听">电话无人接听</Radio>
						      <Radio value="错号/空号">错号/空号</Radio>
						    </RadioGroup>)
					}	
					</Row>
				</FormItem>

				<FormItem
				style={{marginBottom: 5}}
				labelCol={{span:4}}
				wrapperCol={{span:20}}
				label="业主状态">
					<Row gutter={10}>
					{
						this.props.form.getFieldDecorator('owners')(<RadioGroup  size="large">
					      <Radio value="当前忙,稍后再打">当前忙,稍后再打</Radio>
					      <Radio value="无房出租">无房出租</Radio>
					      <Radio value="中介">中介</Radio>
					    </RadioGroup>)
					}
					</Row>
				</FormItem>
				<FormItem
				style={{marginBottom: 5}}
				labelCol={{span:4}}
				wrapperCol={{span:20}}
				label="房源信息">
					<Row gutter={10}>
						<Col span="4">
							<Input value={this.state.info.zone_name_path[0]} disabled/>
						</Col>
						<Col span="4">
							<Input value={this.state.info.zone_name_path[1]} disabled/>
						</Col>
						<Col span="4">
							<Input value={this.state.info.zone_name_path[2]} disabled/>
						</Col>
						<Col span="4">
							<Input value={this.state.info.zone_name_path[3]} disabled/>
						</Col>
					</Row>
				</FormItem>

				<FormItem
				style={{marginBottom: 5}}
				labelCol={{span:4}}
				wrapperCol={{span:20}}
				label="位置">
					{
						this.state.info.comm_name_path.length > 0
						?(<Row gutter={10}>
							<Col span="4">
								<Input value={this.state.info.comm_name_path[0]} disabled/>
							</Col>
							<Col span="4">
								<Input value={this.state.info.comm_name_path[1]} disabled/>
							</Col>
							<Col span="4">
								<Input value={this.state.info.comm_name_path[2]} disabled/>
							</Col>
							{	
								this.state.info.comm_name_path[3]
								?(<Col span="4">
										<Input value={this.state.info.comm_name_path[3]} disabled/>
									</Col>)
								:(null)
							}
							<Col span="5">
								<Button className="success-button" size="small" disabled>验证房源</Button>
							</Col>
							<Col span="7">
							{
								this.props.form.getFieldDecorator('owners')(<Checkbox disabled>楼栋信息有误</Checkbox>)
							}
							</Col>
						</Row>)
						:(<Row gutter={10}>
							<Col span="4">
								<Input value={this.state.info.comm_name_array[0]+'栋'} disabled/>
							</Col>
							<Col span="4">
								<Input value={this.state.info.comm_name_array[1]+'单元'} disabled/>
							</Col>
							<Col span="4">
								<Input value={this.state.info.comm_name_array[2]+'号'} disabled/>
							</Col>
							<Col span="5">
								<Button className="success-button" size="small" disabled>验证房源</Button>
							</Col>
							<Col span="7">
							{
								this.props.form.getFieldDecorator('owners',{
									initialValue: false,
								})(<Checkbox disabled>楼栋信息有误</Checkbox>)
							}
							</Col>
						</Row>)
						
					}
				</FormItem>

				<FormItem
				style={{marginBottom: 5}}
				labelCol={{span:4}}
				wrapperCol={{span:20}}
				label="户型">
					<Row gutter={10}>
						<Col span="5">
							<Row  gutter={5}>
								<Col span="21">
									<Input value={this.state.info.layout[0]} disabled/>
								</Col>
								<Col span="2">
									<span>室</span>
								</Col>
							</Row>
						</Col>
						<Col span="5">
							<Row  gutter={5}>
								<Col span="20">
									<Input value={this.state.info.layout[1]} disabled/>
								</Col>
								<Col span="2">
									<span>厅</span>
								</Col>
							</Row>
						</Col>
						<Col span="5">
							<Row  gutter={5}>
								<Col span="20">
									<Input value={this.state.info.layout[2]} disabled/>
								</Col>
								<Col span="2">
									<span>卫</span>
								</Col>
							</Row>
						</Col>
					</Row>
				</FormItem>
				<Row gutter={10}>
					<Col span="6" offset="1">
						<FormItem
						style={{marginBottom: 5}}
						labelCol={{span:12}}
						wrapperCol={{span:12}}
						label="所在层">
							<Input value={this.state.info.floor[0]} disabled/>
						</FormItem>
					</Col>
					<Col span="5">
						<FormItem
						style={{marginBottom: 5}}
						labelCol={{span:12}}
						wrapperCol={{span:12}}
						label="总楼层">
							<Input value={this.state.info.floor[1]} disabled/>
						</FormItem>
					</Col>
					<Col span="6">
						<FormItem
						style={{marginBottom: 5}}
						labelCol={{span:11}}
						wrapperCol={{span:13}}
						label="面积">
							<Row>
								<Col span="17">
									<Input value={this.state.info.size} disabled/>
								</Col>
								<Col span="7">
									<span>m <sup style={{fontSize: 5}}>2</sup></span>
								</Col>
							</Row>
						</FormItem>
					</Col>
				</Row>

				<Row gutter={10}>
					<Col span="10" offset="1">
						<FormItem
						style={{marginBottom: 5}}
						labelCol={{span:7}}
						wrapperCol={{span:12}}
						label="价格">
							<Row>
								<Col span="17">
									<Input value={this.state.info.rent} disabled/>
								</Col>
								<Col span="7">
									<span>元/月</span>
								</Col>
							</Row>
						</FormItem>
					</Col>
					<Col span="10">
						<FormItem
						style={{marginBottom: 5}}
						labelCol={{span:8}}
						wrapperCol={{span:12}}
						label="付款方式">
							<Input value={this.state.info.type_pay_label} disabled/>
						</FormItem>
					</Col>
				</Row>

				<FormItem
				style={{marginBottom: 5}}
				labelCol={{span:4}}
				wrapperCol={{span:20}}
				label="业主标题">
					<Row>
						<Col span="22">
							<Input value={this.state.info.title} disabled/>
						</Col>
						<Col span="20">
						{
							this.props.form.getFieldDecorator('title',{

							})(<Checkbox onChange={this.onChange} checked={this.state.title}>标题不规范</Checkbox>)
						}
						</Col>
					</Row>
				</FormItem>

				<FormItem
				style={{marginBottom: 5}}
				labelCol={{span:4}}
				wrapperCol={{span:20}}
				label="业主描述">
					<Row>
						<Col span="22">
							<TextArea value={this.state.info.desc} disabled/>
						</Col>
						<Col span="20">
						{
							this.props.form.getFieldDecorator('desc')(<Checkbox onChange={this.onChange}  checked={this.state.desc}>房源描述不规范</Checkbox>)
						}
						</Col>
					</Row>
				</FormItem>

				<FormItem
				style={{marginBottom: 5}}
				labelCol={{span:4}}
				wrapperCol={{span:20}}
				label="房源配置">
					<CheckboxGroup options={this.state.info.furniture} value={this.state.info.furniture} disabled />
				</FormItem>

				<FormItem
				style={{marginBottom: 5}}
				labelCol={{span:4}}
				wrapperCol={{span:20}}
				label="房源配置">
					<CheckboxGroup options={this.state.info.points} value={this.state.info.points} disabled />
				</FormItem>

				<FormItem
				style={{marginBottom: 5}}
				labelCol={{span:4}}
				wrapperCol={{span:20}}
				label="图片">
					<div className="check-pic">
						<div className="swiper-container">
					        <div className="swiper-wrapper">
					           {image}
					        </div>
					        <div className="swiper-button-next"></div>
        					<div className="swiper-button-prev"></div>
					    </div>
	            	</div>
	            	{
	            		this.props.form.getFieldDecorator('image')(<Checkbox onChange={this.onChange}  checked={this.state.image}>房源图片有问题</Checkbox>)	
	            	}
				</FormItem>

				<FormItem
				style={{marginBottom: 5}}
				labelCol={{span:4}}
				wrapperCol={{span:20}}
				label="物业地址">
					<Row gutter={10}>
						<Col >
							<Input 
							value={this.state.info.property&&this.state.info.property.length>0?this.state.info.property[0].pro_address+'/'+this.state.info.property[0].pro_company+'/'+this.state.info.property[0].pro_company_abb:''}  
							disabled/>
						</Col>
						
					</Row>
				</FormItem>

				<FormItem
				style={{marginBottom: 5}}
				labelCol={{span:4}}
				wrapperCol={{span:20}}
				label="房源负责人">
					<Col span="22">
							<Input 
							value={this.state.info.property&&this.state.info.property.length>0?this.state.info.property[0].pro_name+this.state.info.property[0].pro_mobile:''}  
							disabled/>
						</Col>
				</FormItem>
			</Form>
		)
	}
}

ModalCheck = Form.create()(ModalCheck);
function mapStateToProps(state) {
  return {isSubmit:state.submits.submits}
}
function mapDispatchToProps(dispatch,ownProps){
    return  bindActionCreators(submit,dispatch)
}
export default connect(mapStateToProps,mapDispatchToProps)(ModalCheck);