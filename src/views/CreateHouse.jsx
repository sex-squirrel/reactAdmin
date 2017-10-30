import React, {Component} from 'react';
import { Form, Input, Select, Checkbox, Button, Cascader, Upload, Row, Col, message, Popconfirm  } from 'antd';
import axios from 'axios';
import Api from '../api';
import { dictLayout, dictChecks, communityTree, dictMaxFloor, propertyOperation } from '../api/dataOperation';
// import moment from 'moment';

import ImageUpload from '../components/ImageUpload'
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option =  Select.Option;
const CheckboxGroup = Checkbox.Group;
const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
      },
    };

const formItemInlineLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
        md: {span: 12}
      },
      wrapperCol: {
        xs: { span: 13 },
        sm: { span: 12 },
        md: {span: 12}
      },
    };
 var count = 0;
class CreateHouse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			/*表单字典*/
			rentType: [],
			layoutOptions: [],
			floorOptions: [],
			payType: [],
			roomConfig: [],
			roomHeightLight: [],
			floorMax:null,
			ownerCount:0,
			share_bedRoom: [],
			share_sex: [],
			type_lease_shop: [],
			/*省市区小区楼栋结构级联*/
			zones: [],
			zoneOptions: [],
			commOptions: [],
			property: {
				pro_company: [],
				pro_name: []
			},
			/*图片上传设置*/
			upLoadPic: {
			  action: 'http://up-z2.qiniu.com/',
			  showUploadList: false,
			  data: {
			  	token: '',
			  	key: '',
			  }
			},
			/*上传列表*/
			domain: '',
			fileList: [],
			progress: [],
			checkedFiles: [],
			deletes: false,
			/*出租类型切换*/
			typeChange: '1',
			setWy: false,
			checked: false
		}
	}
	/*
		getCommunityTree(value, selectedOptions)
		@params value Array 已选择的value值
				selectedOptions Object 目标option
		
		loadData(selectedOptions) 级联动态加载函数
		@params selectedOptions Object 已选择的父级option

	*/
	getCommunityTree = (value, selectedOptions)=>{
		let data = {
				zone_id: value
			};
		Api.createHouse.communityTree(data)
		.then(res=>{
			this.setState({
				commOptions: communityTree(res.data.item)
			})				
		})
		Api.property(data)
		.then(res=>{
			this.setState({
				property: propertyOperation(res.data)
			})
		})
	}
	loadData = (selectedOptions)=>{
		const targetOption = selectedOptions[selectedOptions.length - 1];
		targetOption.loading = true;
		let data = {
			comm_id: targetOption.value
		}
    	Api.createHouse.roomsTree(data)
    	.then(res=>{
    		targetOption.loading = false;
    		targetOption.children = communityTree(res.data)
    		this.setState({
    			commOptions: [...this.state.commOptions]
    		})
    	})
	}
	/*
		图片上传处理
		beforeUpload
	*/
	beforeUpload = (file, fileList)=>{
		if(fileList.length > 30){
			count++;
			if (count === 30) {
				message.error('最多可上传30张!');
				count = 0;
			}
			return false;
		}
		if (file.type === 'image/jpeg' || file.type === 'image/png') {
			this.setState({
				fileList: [...fileList,...this.state.fileList]
			})
			return true;
		}else{
			message.error('只能是jpg或png格式的图片');
			return false;
		}
	}
	onUpload = (info)=>{
		if (info.file.status === 'error') {
			message.error('图片上传失败,请刷新重试!')
		}
		if (info.event) {
			let arr = this.state.progress
			arr.push({
				event: info.event,
				file: info.file
			})
			this.setState({
				progress: [...arr]
			})
		}else if (info.file.status === 'done') {
			let arr = info.fileList.filter(item=>{
				return item.checked === true
			})
			this.setState({
				fileList: arr
			})
		}
	}
	changeCheck = (value)=>{
		this.setState({
			checkedFiles: Object.assign([],value)
		})
	}
	showDele = ()=>{
		this.setState({
			deletes: true
		})
	}
	confirm = () => {
		let arr = this.state.fileList.filter((item) => {
			return item.checked === true
		})
		this.setState({
			fileList: [...arr],
			deletes: false
		})
	}
	cancel = () => {
		this.setState({
			deletes: false
		})
	}
	/*字典其他渲染*/
	selectMax = (selectedOptions) => {
		const targetOption = selectedOptions[selectedOptions.length - 1];
		targetOption.loading = true;
		let arr = [];
		for (let i = 1; i <= targetOption.value; i++) {
			let obj = {label:i,value: `${i}`}
			arr.push(obj)
		}
		targetOption.children = arr;
		this.setState({
    		floorMax: [...this.state.floorMax]
    	})
    	targetOption.loading = false;
	}
	addOwner = () => {
		this.setState({
			ownerCount: this.state.ownerCount+1
		})
	}
	/*切换出租类型*/
	rentTypeChange = (value)=>{
		this.setState({
			typeChange: value
		})
	}
	/*提交表单*/
	handleSubmit = (e)=>{
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err,value)=>{
			if (!err) {
				let data = {
					contacts: [{name:'',mobile:''},{name:'',mobile:''},{name:'',mobile:''},{name:'',mobile:''},{name:'',mobile:''}],
				};
				for(let key in value){
					switch(key){
						case 'zoneInfo':
							data['comm_id'] = value[key][value[key].length-1];
							break;
						case 'name0':
							data.contacts[0]['name'] = value[key]
							break;
						case 'mobile0':
							data.contacts[0]['mobile'] = value[key]
							break;
						case 'name1':
							data.contacts[1]['name'] = value[key]
							break;
						case 'mobile1':
							data.contacts[1]['mobile'] = value[key]
							break;
						case 'name2':
							data.contacts[2]['name'] = value[key]
							break;
						case 'mobile2':
							data.contacts[2]['mobile'] = value[key]
							break;
						case 'name3':
							data.contacts[3]['name'] = value[key]
							break;
						case 'mobile3':
							data.contacts[3]['mobile'] = value[key]
							break;
						case 'name4':
							data.contacts[4]['name'] = value[key]
							break;
						case 'mobile4':
							data.contacts[4]['mobile'] = value[key]
							break;
						case 'floor':
							data[key] = value[key].reverse()
							break;
						case 'auto_publish':
							if ( value[key]) {
								data[key] = 1
							}
							break;
						case 'wuye':
							if ( value[key]) {
								// property: {
								// pro_company: [],this.props.form.getFieldValue('pro_company')
								let name = this.state.property.pro_company.filter(item=>{
									return item.value === this.props.form.getFieldValue('pro_company')
								})
								data['contact'] = name[0].label;
								data['contact_mobile'] = this.props.form.getFieldValue('pro_name');
							}
							break;
						case 'images':
							let arr = [];
							let wrap = '';
							value[key].fileList.map((item) => {
								if (item.setWrap) {
									wrap = item.response.hash
								}else{
									arr.push(item.response.hash)
								}
								return true;
							})
							if (wrap) {
								arr.unshift(wrap)
							}
							data[key] = arr;
							break;
						default:
							data[key] = value[key];
					}
				}
				Api.createHouse.create(data)
				.then(res=>{
					if (res.errcode === 0) {
						this.props.form.resetFields()
						// fileList: [],
						// progress: [],
						// checkedFiles: [],
						// setWy: false,
						// checked: false
						message.success('保存成功!')
						this.setState({
							fileList: [],
							progress: [],
							checkedFiles: [],
							setWy: false,
							checked: false,
							typeChange: '1'
						})
					}else{
						message.error('保存失败!')
					}
					
				})
			}
		})
		
	}
	setWuye = (e)=>{
		this.setState({
	      setWy: e.target.checked,
	      checked: !this.state.checked
	    });
	}
	/*组件完成挂载发送http请求*/
	componentDidMount(){
		axios.all([Api.createHouse.zones({type:4}), Api.createHouse.houseDict(), Api.qiniu({bucket: 'hzmsources'})])
		.then(res=>{
			this.setState({
				zones: res[0].data,
				share_bedRoom: res[1].data.share_bedRoom,
				share_sex: res[1].data.share_sex,
				type_lease_shop: res[1].data.type_lease_shop,
				payType: res[1].data.type_pay,
				rentType: res[1].data.type_lease,
				layoutOptions: dictLayout(res[1].data.layout),
				roomConfig: dictChecks(res[1].data.furniture),
				roomHeightLight: dictChecks(res[1].data.points, true),
				upLoadPic: Object.assign({}, this.state.upLoadPic, {data:{token:res[2].data.token}}),
				domain: res[2].data.domain,
				floorMax: dictMaxFloor(res[1].data),
			})
		})

	}
    render(){
    	const owners = [];
    	if (this.state.ownerCount <= 5 ) {
    		for (let i = 0; i < this.state.ownerCount; i++) {
    			owners.push(<Row gutter={15} key={`${i+i.toString()}`}>
            					<Col  xs={24} sm={24} md={24} lg={{span:8,offset:2}} xl={{span:8,offset:3}}>
	            					<FormItem
		            				{...formItemLayout}
		            				label={`联系人${i+1}`}
		            				style={{marginBottom: 8}}>
	            						{
	            							this.props.form.getFieldDecorator(`name${i}`,{
	            							rules:[{pattern:/^[\u2E80-\u9FFF]+$/g,message: '请输入汉字'}]
				            			  	})(<Input placeholder="姓名" maxLength={8}/>)
	            						}
	            					</FormItem>
	            				</Col>

	            				<Col xs={24} sm={{span:18,offset:4}} md={{span:17,offset:7}} lg={{span:6,offset:0}} xl={{span:6,offset:0}}>
	            					<FormItem style={{marginBottom: 8}}>
	            						{
	            							this.props.form.getFieldDecorator(`mobile${i}`,{
				            			  		rules:[{message: '请输入正确的手机号码',pattern: /^1(3|5|7|8)[0-9]{9}$/g,}]
				            			  	})(<Input placeholder="联系电话" maxLength={11}/>)
	            						}
	            					</FormItem>
	            				</Col>
            				</Row>)
    		}
    	}
    	const options = []
    	this.state.zones.map((item) => {
    		options.push(<Option value={item.zone_id.toString()} key={item.zone_id}>{item.zone_name}</Option>);
    		return true;
    	})

    	const optionsPropertyCom = []
    	for (let i = 0; i < this.state.property.pro_company.length; i++) {
    		optionsPropertyCom.push(<Option value={this.state.property.pro_company[i].value} key={i}>{this.state.property.pro_company[i].label}</Option>);
    	}
    	
    	const optionsPropertyNam = []
    	for (let i = 0; i < this.state.property.pro_name.length; i++) {
    		optionsPropertyNam.push(<Option value={this.state.property.pro_name[i].mobile} key={i}>{this.state.property.pro_name[i].contact}</Option>);
    	}

  		// share_bedRoom: res[1].data.share_bedRoom,
		// share_sex: res[1].data.share_sex,
		// type_lease_shop: res[1].data.type_lease_shop,
		const share_bedRoom = [];
		const share_sex = [];
		const type_lease_shop = [];
		this.state.share_bedRoom.map((item) => {
			share_bedRoom.push(<Option value={item.type.toString()} key={item.type}>
									{item.value}
								</Option>)
			return true;
		})

		this.state.share_sex.map((item) => {
			share_sex.push(<Option value={item.type.toString()} key={item.type}>
									{item.value}
								</Option>)
			return true;
		})

		this.state.type_lease_shop.map((item) => {
			type_lease_shop.push(<Option value={item.type.toString()} key={item.type}>
									{item.value}
								</Option>)
			return true;
		})


        return (
            <Row  className="create-wrap" id="area">
            	<Form onSubmit={this.handleSubmit} hideRequiredMark={true}>
            		<Row >
            			<Col span="12">
	    					{/*基本信息*/}
	    					<div style={{paddingBottom: 15}}>基本信息</div>
	            			<FormItem
	            			  {...formItemLayout}
	            			  label="所在小区：">
	            			  {
	            			  	this.props.form.getFieldDecorator('zone_id',{
	            			  		rules:[{required: true,message: '未选择房源地址'}]
	            			  	})( <Select placeholder="请选择所在小区" onChange={ this.getCommunityTree }>
								      {options}
								    </Select>)
	            			  }

	            			</FormItem>
	            			<FormItem
	            				{...formItemLayout}
	            				label="楼栋：">
	            				{
	            					this.props.form.getFieldDecorator('zoneInfo',{
	            			  		rules:[{required: true,message: '未选择房源信息'}]
	            			  		})(<Cascader
		            					changeOnSelect={true}
		            					notFoundContent="天呐,数据去哪了"
		            					options={this.state.commOptions}
		            					loadData={this.loadData}
		            					placeholder="请选择楼栋"
		            					getPopupContainer={() => document.getElementById('area')}>			
		            				</Cascader>)
	            				}
	            				
	            			</FormItem>
	            			<FormItem
	            				{...formItemLayout}
	            				label="标题：">
	            				{
	            					this.props.form.getFieldDecorator('title',{
	            			  		rules:[{required: true,message: '标题不能为空'}]
	            			  		})(<Input placeholder="0-30个字" maxLength="30"/>)
	            				}
	            			</FormItem>
	            			<FormItem
	            				{...formItemLayout}
	            				label="房源描述：">
	            				{
	            					this.props.form.getFieldDecorator('desc',{
	            			  		rules:[{required: true,message: '描述不能为空'}]
	            			  		})(<TextArea placeholder="请输入备注"/>)
	            				}
	            			</FormItem>
	            			{/*房源信息*/}
	            			<div style={{paddingBottom: 15}}>房源信息</div>
	            			<FormItem
	            				{...formItemLayout}
	            				label="房源类型：">
	            				{
	            					this.props.form.getFieldDecorator('type_lease',{
	            					initialValue: '1',
	            			  		rules:[
	            			  				{required: true,message: '未选择出租类型'}
	            			  			]
	            			  		})(<Select placeholder="请选择出租类型" getPopupContainer={() => document.getElementById('area')}
	            			  			onChange={this.rentTypeChange}>
		    		            		{
		    		            			this.state.rentType.map(item=>(
		    		            				<Option value={item.type.toString()} key={item.value}>{item.value}</Option>	
		    		            			))
		    		            		}	
		            				</Select>)
	            				}
	            				
	            			</FormItem>
	            			<Row>
	            				<FormItem
	            				{...formItemLayout}
	            				label="房型">
	            				{
	            					this.props.form.getFieldDecorator('layout',{
	            			  		rules:[{required: true,message: '未选择房型'}]
	            			  		})(<Cascader
		            					options={this.state.layoutOptions}
		            					placeholder="请选择房型"
		            					getPopupContainer={() => document.getElementById('area')}>			
		            				</Cascader>)
	            				}
	            					
	            				</FormItem>
	            			</Row>
	            			<Row>
	            				<Col xs={24} sm={24} md={12} lg={12} xl={12}>
		            				<FormItem
		            				{...formItemInlineLayout}
		            				label="楼层">
		            				{
		            					this.props.form.getFieldDecorator('floor',{
		            			  		rules:[{required: true,message: '未选择房型'},{type: 'array',len: 2, message: '选择不完整'}]
		            			  		})(<Cascader
		            						changeOnSelect={false}
			            					options={this.state.floorMax}
			            					placeholder="最高/所在楼层"
			            					loadData={this.selectMax}
			            					getPopupContainer={() => document.getElementById('area')}>			
			            				</Cascader>)
		            				}	
		            				</FormItem>
			            		</Col>
			            		<Col xs={24} sm={24} md={12} lg={12} xl={12}>
			            				<FormItem
				            				{...formItemInlineLayout}
				            				label="面积">
				            				{
				            					this.props.form.getFieldDecorator('size',{
				            			  		rules:[{required: true,message: '未填写面积'},{pattern:/^(\d*)\.?\d+$/g,message: '只能是数字'}]
				            			  		})(<Input 
				            					type="text"
				            					maxLength={10}
				            					addonAfter="平米"/>)
				            				}
				            				
			            			</FormItem>
		            			</Col>
	            			</Row>
	            			<Row>
	            				<Col xs={24} sm={24} md={12} lg={12} xl={12}>
		            				<FormItem
			            			    {...formItemInlineLayout}
			            			    label="付款方式">
			            			    {
			            			    	this.props.form.getFieldDecorator('type_pay',{
				            			  		rules:[{required: true,message: '未选择付款方式'}]
				            			  	})(<Select
					            					placeholder="付款方式"
					            					getPopupContainer={() => document.getElementById('area')}>
					            					{
					            						this.state.payType.map(item=>(
					            							<Option value={item.type.toString()} key={item.type}>
					            								{item.value}
					            							</Option>
					            						))
					            					}
					            				</Select>)
			            			    }
			            				
			            			</FormItem>
		            			</Col>
		            			<Col xs={24} sm={24} md={12} lg={12} xl={12}>
		            				<FormItem
			            				{...formItemInlineLayout}
			            				label="租金">
			            				{
			            					this.props.form.getFieldDecorator('rent',{
				            			  		rules:[{required: true,message: '未填写租金'},{pattern:/[0-9]*$/g,message: '只能是数字'}]
				            			  	})(<Input type="text" addonAfter="元/月"/>)
			            				}
			            			</FormItem>
		            			</Col>
	            			</Row>
	            			{
	            				this.state.typeChange === '1'||this.state.typeChange === '2'
	            				?(<FormItem
		            				{...formItemLayout}
		            				label="房源配置">
		            				{
		            					this.props.form.getFieldDecorator('furniture',{
		            						rules:[{required: true,message: '未选择房源配置'}]
		            					})(<CheckboxGroup options={this.state.roomConfig}/>)
		            				}
		            			</FormItem>)
		            			:(null)
	            			}

	            			{
	            				this.state.typeChange === '1'||this.state.typeChange === '2'
	            				?(<FormItem
		            				{...formItemLayout}
		            				label="房源亮点">
		            				{
		            					this.props.form.getFieldDecorator('points',{
		            						rules:[{required: true,message: '未选择房源亮点'}]
		            					})(<CheckboxGroup options={this.state.roomHeightLight}/>)
		            				}
		            			</FormItem>)
		            			:(null)
	            			}
	            			
	            			{
	            				this.state.typeChange === '2'
	            				?(<Row>
		            				<Col xs={24} sm={24} md={12} lg={12} xl={12}>
			            				<FormItem
				            			    {...formItemInlineLayout}
				            			    label="卧室">
				            			    {
				            			    	this.props.form.getFieldDecorator('share_bedRoom',{
					            			  		rules:[{required: true,message: '未选择合租方式'}]
					            			  	})(<Select
						            					placeholder="合租方式"
						            					getPopupContainer={() => document.getElementById('area')}>
						            					{
						            						share_bedRoom
															
															//const type_lease_shop = [];
						            					}
						            				</Select>)
				            			    }
				            				
				            			</FormItem>
			            			</Col>
			            			<Col xs={24} sm={24} md={12} lg={12} xl={12}>
			            				<FormItem
				            				{...formItemInlineLayout}
				            				label="性别">
				            				{
				            					this.props.form.getFieldDecorator('share_sex',{
					            			  		rules:[{required: true,message: '未选择性别'}]
					            			  	})(<Select
						            					placeholder="性别"
						            					getPopupContainer={() => document.getElementById('area')}>
						            					{
						            						share_sex
						            					}
						            				</Select>)
				            				}
				            			</FormItem>
			            			</Col>
		            			</Row>)
		            			:(null)
	            			}
	            			{
	            				this.state.typeChange === '3'
	            				?(<FormItem
		            				{...formItemLayout}
		            				label="类型">
		            				{
		            					this.props.form.getFieldDecorator('type_lease_shop',{
		            						rules:[{required: true,message: '未选择类型'}]
		            					})(<Select
				            					placeholder="类型"
				            					getPopupContainer={() => document.getElementById('area')}>
				            					{
				            						
													type_lease_shop
				            					}
				            				</Select>)
            						}
		            			</FormItem>)
	            				:(null)
	            			}
	            			
	            			{/*业主信息*/}
	            			<div style={{paddingBottom: 15}}>业主信息</div>
	            			
            				<Row gutter={15}>
            					<Col xs={24} sm={24} md={24} lg={{span:8,offset:2}} xl={{span:8,offset:3}}>
	            					<FormItem
		            				{...formItemLayout}
		            				label="业主："
		            				style={{marginBottom: 8}}>
	            						{
	            							this.props.form.getFieldDecorator('contact',{
				            			  		rules:[{required: this.state.setWy?false:true,message: '业主姓名不能为空'},{pattern:/^[\u2E80-\u9FFF]+$/g,message: '请输入汉字'}]
				            			  	})(<Input placeholder="业主姓名" maxLength={8}/>)
	            						}
	            					</FormItem>
	            				</Col>

	            				<Col xs={24} sm={{span:18,offset:4}} md={{span:17,offset:7}} lg={{span:6,offset:0}} xl={{span:6,offset:0}}>
	            					<FormItem style={{marginBottom: 8}}>
	            						{
	            							this.props.form.getFieldDecorator('contact_mobile',{
				            			  		rules:[{required: this.state.setWy?false:true,message: '电话不能为空'},{message: '请输入正确的手机号码',pattern: /^1(3|5|7|8)[0-9]{9}$/g,}]
				            			  	})(<Input placeholder="联系电话" maxLength={11}/>)
	            						}
	            					</FormItem>
	            				</Col>
            					
            					<Col xs={24} sm={{span:7,offset:4}} md={{span:7,offset:7}} lg={{span:6,offset:0}} xl={{span:6,offset:0}}>
            						<Button className="success-button" onClick={this.addOwner} disabled={this.state.ownerCount<5?false:true}>添加联系人</Button>
            					</Col>
            				</Row>
            				{owners}
            				<Row>
            					<Col offset="4">
            						<FormItem
			            				{...formItemLayout}
			            				colon={false}
			            				label=""
			            				style={{marginTop: 0}}>
			            				{
			            					this.props.form.getFieldDecorator('wuye')(<Checkbox 
			            						disabled={this.state.property.pro_company[0]?false:true}
			            						onChange={this.setWuye}
			            						checked={this.state.checked}
			            						>设置物业为业主</Checkbox>)
			            				}
			            				
			            			</FormItem>
            					</Col>
            				</Row>
	            			
	            			<FormItem
	            				{...formItemLayout}
								label="物业管理处">
								{
            						this.props.form.getFieldDecorator('pro_company',{
            						initialValue:this.state.property.pro_company[0]?this.state.property.pro_company[0].value: ''
            						})(<Select placeholder="请选择物业管理处" disabled={this.state.property.pro_company[0]?false:true}
	            						getPopupContainer={() => document.getElementById('area')}>{optionsPropertyCom}</Select>)
	            				}
	            				
	            			</FormItem>
	            			<FormItem
	            				{...formItemLayout}
								label="房源负责人">
								{
            						this.props.form.getFieldDecorator('pro_name',{
            							initialValue:this.state.property.pro_name[0]?this.state.property.pro_name[0].mobile: ''
            						})(<Select placeholder="请选择房源负责人"
            							disabled={this.state.property.pro_company[0]?false:true}
	            						getPopupContainer={() => document.getElementById('area')}>{optionsPropertyNam}</Select>)
	            				}
	            				
	            			</FormItem>
			            </Col>

			            <Col span="10" offset="2">
			            	{/*图片上传*/}
	            			<div style={{paddingBottom: 15}}>图片：</div>
	            			<FormItem
								colon={false}>
	            				<Row gutter={15}>
	            					<Col  xs={{span:24}} sm={{span:9}} md={{offset:1,span:5}} lg={{offset:9, span:5}} xl={{offset:12, span:3}} >
	            					{
	            						this.props.form.getFieldDecorator('images',{

	            							rules:[{required: true,message: '至少上传一张图片'}]

	            						})(<Upload {...this.state.upLoadPic}
	            						multiple={true}
	            						beforeUpload={this.beforeUpload}
	            						onChange={this.onUpload}>
	            							<Button type="primary" size="small" disabled={this.state.fileList.length >= 30?true:false}>上传图片</Button>
	            						</Upload>)
	            					}
	            					</Col>
	            					
	            					<Col  xs={24} sm={13} md={12} lg={5} xl={3}>
	            						<Popconfirm 
	            						title="确定要删除选中的图片么?" 
	            						okText="确定" cancelText="取消" 
	            						visible={this.state.deletes}
	            						onConfirm={this.confirm}
          								onCancel={this.cancel}>
	            							<Button type="danger" size="small" disabled={this.state.checkedFiles.length === 0?false:true} onClick={this.showDele}>删除</Button>
	            						</Popconfirm>
	            					</Col>
	            				</Row>
	            				<ImageUpload progress={this.state.progress} domain={this.state.domain} fileList={this.state.fileList} changeCheck={this.changeCheck}/>
	            			</FormItem>	
			            </Col>
            		</Row>


            		<Row>
            			<Col xs={{offset: 0, span: 24}} sm={{offset: 4, span: 6}} md={{offset: 4, span: 4}} lg={{offset: 4, span: 3}} xl={{offset: 4, span: 2}}>
            				<div style={{marginTop:3}}>
            				{
            					this.props.form.getFieldDecorator('auto_publish')(<Checkbox>直接发布</Checkbox>)	
            				}
            				</div>
            				
            			</Col>
            			<Col xs={24} sm={4} md={3} lg={2} xl={2}>
            				<Button type="danger" style={{marginRight: 10}}>取消</Button>		
            			</Col>
            			<Col xs={24} sm={4} md={3} lg={2} xl={2}>
            				<Button type="primary" htmlType="submit">保存</Button>
            			</Col>
            		</Row>
	            </Form>		
            </Row >
        )
    }
}
CreateHouse = Form.create()(CreateHouse);
export default CreateHouse;