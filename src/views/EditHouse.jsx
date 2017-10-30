import React, {Component} from 'react';
import { Form, Input, Select, Checkbox, Button, Cascader, Upload, Row, Col, message, Popconfirm  } from 'antd';
import axios from 'axios';
import Api from '../api';
import qs from 'qs';
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
 var lists = [];
class EditHouse extends Component {
	constructor(props) {
		super(props);
		//console.log(qs.parse(props.location.search, { ignoreQueryPrefix: true }))
		this.state = {
			...(qs.parse(props.location.search, { ignoreQueryPrefix: true })),
			/*房源详情*/
			info: {},
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
			typeChange: '1'
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
	
	optionsChange = (value, selectedOptions)=>{
		// console.log(value, selectedOptions)
	}
	/*
		图片上传处理
		beforeUpload
	*/
	beforeUpload = (file, fileList)=>{
		if(fileList.length > 30 || this.state.fileList.length > 30){
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
				return item.checked !== true
			})
			this.setState({
				fileList: [...arr,...lists]
			})
		}
	}
	changeCheck = (value)=>{
		this.setState({
			checkedFiles: Object.assign([],value)
		},()=>{
			// console.log(this.state.checkedFiles,'changeCheck')
		})
	}
	showDele = ()=>{
		this.setState({
			deletes: true
		})
	}
	confirm = () => {
		let arr = this.state.fileList.filter((item) => {
			return item.checked !== true
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
			let obj = {label:i,value: i}
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
	/*提交表单*/
	handleSubmit = (e)=>{
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err,value)=>{
			if (!err) {
				let data = {
					contacts: [{name:'',mobile:''},{name:'',mobile:''},{name:'',mobile:''},{name:'',mobile:''},{name:'',mobile:''}],
					id: this.state.id
				};
				for(let key in value){
					switch(key){
						case 'zoneInfo':
							if (value[key] && value[key].length>0) {
								data['comm_id'] = value[key][value[key].length-1];
							}else{
								data['comm_id'] = this.state.info.comm_id;
							}
							
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
						case 'zone_id':
							if ( !value[key]) {
								data[key] = this.state.info.zone_id;
							}else{
								data[key] = value[key];
							}
							break;
						case 'images':
							let arr = [];
							let wrap = '';
							if (value[key] && value[key].fileList) {
								this.state.fileList.map((item) => {
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
							}else{
								lists.map((item) => {
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
							}
							data[key] = arr;
							break;
						default:
							data[key] = value[key];
					}
				}
				// console.log(data)
				Api.edit(data)
				.then(res=>{
					if (res.errcode === 0 && res.data) {

						message.success('修改成功!')
					}else{
						message.error('修改成功!')
					}
				})
			}
		})
		
	}
	/*切换出租类型*/
	rentTypeChange = (value)=>{
		this.setState({
			typeChange: value
		})
	}
	/*组件完成挂载发送http请求*/
	componentDidMount(){
		axios.all([Api.createHouse.zones({type:4}), Api.createHouse.houseDict(), Api.qiniu({bucket: 'hzmsources'}),Api.detail({id:this.state.id})])
		.then(res=>{
			this.setState({
				zones: res[0].data,
				share_bedRoom: res[1].data.share_bedRoom,
				share_sex: res[1].data.share_sex,
				type_lease_shop: res[1].data.type_lease_shop,
				payType: res[1].data.type_pay,
				rentType: res[1].data.type_lease,
				layoutOptions: dictLayout(res[1].data.layout),
				roomConfig: dictChecks(res[1].data.furniture, false, res[3].data.furniture),
				roomHeightLight: dictChecks(res[1].data.points, true, res[3].data.points),
				upLoadPic: Object.assign({}, this.state.upLoadPic, {data:{token:res[2].data.token}}),
				domain: res[2].data.domain,
				floorMax: dictMaxFloor(res[1].data),
				// property: propertyOperation(res[3].data),
				info: res[3].data,
				typeChange: res[3].data.type_lease
			},()=>{
				let o = this.state.floorMax.find(item=>{
					return item.value === this.state.info.floor[1]
				})
				let arr1 =  this.state.floorMax.filter(item=>{
					return parseInt(item.value, 10) > parseInt(this.state.info.floor[1], 10)
				})
				let arr2 =  this.state.floorMax.filter(item=>{
					return parseInt(item.value, 10) < parseInt(this.state.info.floor[1], 10)
				})
				o['children'] = dictMaxFloor({floor_max: o.label})

				lists = [];
				this.state.info.images.map((item, index) => {
					let obj = {
						response: {
							key: item,
							hash: item,
						},
						checked: false,
						uid: -index,
						setWrap: index===0?true:false,
					}
					lists.push(obj)
					return true;
				})
				this.setState({
					floorMax: [...arr2,o,...arr1],
					fileList: [...lists],
					ownerCount: this.state.info.contacts.length
				})
				Api.property({zone_id:this.state.info.zone_id})
				.then(res=>{
					this.setState({
						property: propertyOperation(res.data)
					})
				})
			})
		})
	}
    render(){
    	const owners = [];
    	if (this.state.info.contacts && this.state.info.contacts.length > 0) {
    		this.state.info.contacts.map((item, index) =>{
    			owners.push(<Row gutter={15} key={`${index+index.toString()}`}>
            					<Col xs={24} sm={24} md={24} lg={{span:8,offset:2}} xl={{span:8,offset:3}}>
	            					<FormItem
		            				{...formItemLayout}
		            				label={`联系人${index+1}`}
		            				style={{marginBottom: 8}}>
	            						{
	            							this.props.form.getFieldDecorator(`name${index}`,{
	            								initialValue: item.name,
				            			  	})(<Input placeholder="姓名" />)
	            						}
	            					</FormItem>
	            				</Col>

	            				<Col xs={24} sm={{span:18,offset:4}} md={{span:17,offset:7}} lg={{span:6,offset:0}} xl={{span:6,offset:0}}>
	            					<FormItem style={{marginBottom: 8}}>
	            						{
	            							this.props.form.getFieldDecorator(`mobile${index}`,{
	            								initialValue: item.mobile,
				            			  		rules:[{message: '请输入正确的手机号码',pattern: /^1(3|5|7|8)[0-9]{9}$/g,}]
				            			  	})(<Input placeholder="联系电话" />)
	            						}
	            					</FormItem>
	            				</Col>
							</Row>)
							return 1;
    		})
    	}
    	if (this.state.ownerCount <= 5 ) {
    		let n = this.state.info.contacts && this.state.info.contacts.length > 0 ? this.state.info.contacts.length : 0;
    		for (let i = n; i < this.state.ownerCount; i++) {
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
    		optionsPropertyNam.push(<Option value={this.state.property.pro_name[i].contact} key={i}>{this.state.property.pro_name[i].contact}</Option>);
    	}



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
            		<Row>
            			<Col span="12">
	    					{/*基本信息*/}
	    					<div style={{paddingBottom: 15}}>基本信息</div>
	    					
	            			<FormItem
	            			  {...formItemLayout}
	            			  label="修改小区">
	            			  {
	            			  	this.props.form.getFieldDecorator('zone_id',{
	            			  	})( <Select placeholder={this.state.info.zone_name_path?this.state.info.zone_name_path.join('/'): ''} onChange={ this.getCommunityTree }
	            			  		getPopupContainer={() => document.getElementById('area')}>
								      {options}
								    </Select>)
	            			  }
	            			</FormItem>
	            			<FormItem
	            				{...formItemLayout}
	            				label="修改楼栋">
	            				{
	            					this.props.form.getFieldDecorator('zoneInfo',{
	            			  		})(<Cascader
		            					changeOnSelect={true}
		            					onSelect={this.optionsChange}
		            					notFoundContent="天呐,数据去哪了"
		            					options={this.state.commOptions}
		            					loadData={this.loadData}
		            					placeholder={this.state.info.comm_name_path?this.state.info.comm_name_path: ''}
		            					getPopupContainer={() => document.getElementById('area')}>			
		            				</Cascader>)
	            				}
	            				
	            			</FormItem>
	            			<FormItem
	            				{...formItemLayout}
	            				label="标题">
	            				{
	            					this.props.form.getFieldDecorator('title',{
	            					initialValue: this.state.info.title?this.state.info.title:'',
	            			  		rules:[{required: true,message: '标题不能为空'}]
	            			  		})(<Input placeholder="0-30个字" maxLength="30"/>)
	            				}
	            			</FormItem>
	            			<FormItem
	            				{...formItemLayout}
	            				label="房源描述">
	            				{
	            					this.props.form.getFieldDecorator('desc',{
	            					initialValue: this.state.info.desc?this.state.info.desc:'',
	            			  		rules:[{required: true,message: '描述不能为空'}]
	            			  		})(<TextArea placeholder="请输入备注"/>)
	            				}
	            			</FormItem>
	            			{/*房源信息*/}
	            			<div style={{paddingBottom: 15}}>房源信息</div>
	            			<FormItem
	            				{...formItemLayout}
	            				label="房源类型">
	            				{
	            					this.props.form.getFieldDecorator('type_lease',{
	            					initialValue: this.state.info.type_lease?this.state.info.type_lease:'',
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
	            					initialValue: this.state.info.layout?this.state.info.layout:[],
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
		            					initialValue: this.state.info.floor?[this.state.info.floor[1],this.state.info.floor[0]]:[],
		            			  		rules:[{required: true,message: '未选择房型'},{type: 'array',len: 2, message: '选择不完整'}]
		            			  		})(<Cascader
		            						changeOnSelect={true}
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
				            					initialValue: this.state.info.size?this.state.info.size:'',
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
			            			    		initialValue: this.state.info.type_pay?this.state.info.type_pay.toString():'',
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
			            						initialValue: this.state.info.rent?this.state.info.rent:'',
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
		            						initialValue: this.state.info.furnitureIds?this.state.info.furnitureIds:[],
		            					})(<CheckboxGroup options={this.state.roomConfig}/>)
		            				}
		            			</FormItem>)
		            			:(null)
	            			}

	            			{
	            				this.state.typeChange === '1'||this.state.typeChange === '2'
	            				?(<FormItem
		            				{...formItemLayout}
		            				label="房源亮点：">
		            				{
		            					this.props.form.getFieldDecorator('points',{
		            						initialValue: this.state.info.points?this.state.info.points:[],
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
				            			    		initialValue: this.state.info.share_bedRoom?this.state.info.share_bedRoom.toString():'1',
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
				            						initialValue: this.state.info.share_sex?this.state.info.share_sex:'1',
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
		            						initialValue: this.state.info.type_lease_shop?this.state.info.type_lease_shop:'1',
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
	            								initialValue: this.state.info.owners&&this.state.info.owners.length>0?this.state.info.owners[0].name:[],
				            			  	})(<Input placeholder="业主姓名" disabled/>)
	            						}
	            					</FormItem>
	            				</Col>

	            				<Col xs={24} sm={{span:18,offset:4}} md={{span:17,offset:7}} lg={{span:6,offset:0}} xl={{span:6,offset:0}}>
	            					<FormItem style={{marginBottom: 8}}>
	            						{
	            							this.props.form.getFieldDecorator('contact_mobile',{
	            								initialValue: this.state.info.owners&&this.state.info.owners.length>0?this.state.info.owners[0].mobile:[],
				            			  		rules:[{required: true,message: '电话不能为空'},{message: '请输入正确的手机号码',pattern: /^1(3|5|7|8)[0-9]{9}$/g,}]
				            			  	})(<Input placeholder="联系电话" disabled/>)
	            						}
	            					</FormItem>
	            				</Col>
            					
            					<Col xs={24} sm={{span:7,offset:4}} md={{span:7,offset:7}} lg={{span:6,offset:0}} xl={{span:6,offset:0}}>
            						<Button className="success-button" onClick={this.addOwner} disabled={this.state.ownerCount<5?false:true}>添加联系人</Button>
            					</Col>
            				</Row>
            				{owners}
            				{
            					this.state.info.property && this.state.info.property.length > 0
            					?(<FormItem
	            				{...formItemLayout}
		            				colon={false}
		            				label=" "
		            				style={{marginTop: 0}}>
		            				{
		            					this.props.form.getFieldDecorator('wuye')(<Checkbox >设置物业为业主</Checkbox>)
		            				}
		            				
		            			</FormItem>)
		            			:(null)
            				}
	            			
	            			<FormItem
	            				{...formItemLayout}
								label="物业管理处">
								{
            						this.props.form.getFieldDecorator('pro_company',{
            						})(<Select placeholder="请选择物业管理处"
	            						getPopupContainer={() => document.getElementById('area')}>{optionsPropertyCom}</Select>)
	            				}
	            			</FormItem>
	            			<FormItem
	            				{...formItemLayout}
								label="房源负责人">
								{
            						this.props.form.getFieldDecorator('pro_name',{
            						})(<Select placeholder="请选择房源负责人"
	            						getPopupContainer={() => document.getElementById('area')}>{optionsPropertyNam}</Select>)
	            				}
	            				
	            			</FormItem>
			            </Col>

			            <Col span="11" offset="1">
			            	{/*图片上传*/}
	            			<div style={{paddingBottom: 15}}>图片：</div>
	            			<FormItem
								colon={false}>
	            				<Row gutter={15}>
	            					<Col  xs={{span:24}} sm={{span:9}} md={{offset:1,span:5}} lg={{offset:9, span:5}} xl={{offset:12, span:3}} >
	            					{
	            						this.props.form.getFieldDecorator('images',{
	            							rules:[{required: this.state.fileList.length>0?false:true,message: '至少上传一张图片'}]
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
	            							<Button type="danger" size="small" disabled={this.state.checkedFiles.length !== 0?false:true} onClick={this.showDele}>删除</Button>
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
EditHouse = Form.create()(EditHouse);
export default EditHouse;