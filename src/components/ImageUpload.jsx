import React, {Component} from 'react';
import {   Row, Col, Progress, Icon,  Modal } from 'antd';
import Swiper from 'swiper';
var swiper;
class ImageUpload extends Component{
	constructor(props) {
		super(props);
		this.state = {
			fileList: [],
			visible: false,
			prevKey: '',
		}
	}
	/*预览调出*/
	handleShow = (key,index)=>{
		this.setState({
			visible: true,
			prevKey: key
		},()=>{
			if (swiper && swiper.slideTo && swiper.update) {
				swiper.update();
				swiper.slideTo(index);
			}else{
				this.swiperInit();
				swiper.update();
				swiper.slideTo(index);
			}
			
			
			// console.log(document.querySelector('.swiper-wrapper').style)
			

		})
	}
	hide = ()=>{
		this.setState({
			visible: false
		})
	}
	swiperInit = ()=>{
		swiper = new Swiper('.swiper-container', {
		 	speed:1000,
	        observer:true,
	        observeParents:true,
	        nextButton: '.swiper-button-next',
        	prevButton: '.swiper-button-prev',
		});
		return null;
	}
	/*设置封面*/
	setWrap = (item)=>{
		let nowFileList = this.state.fileList;
		nowFileList.map((pic) => {
			if (pic.uid === item.uid && !pic.setWrap) {
				pic['setWrap'] = true;
			}else if(!!pic.setWrap){
				pic['setWrap'] = false;
			}
			return true
		})
		this.setState({
			fileList: [...nowFileList]
		})
	}
	check = (item)=>{
		let nowFileList = Object.assign([],this.state.fileList);
		nowFileList.map((pic) => {
			if (pic.uid === item.uid && !pic.checked) {
				pic['checked'] = true;
			}else if(pic.uid === item.uid && !!pic.checked){
				pic['checked'] = false;
			}
			return true
		})
		this.setState({
			fileList: [...nowFileList]
		},()=>{
			let value = []
			value = this.state.fileList.filter(item=>{
				return item.checked === true;
			})
			this.props.changeCheck(value);
		})

	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			fileList: Object.assign([],nextProps.fileList)
		},()=>{
			if (nextProps.progress.length > 0) {
				let nowFileList = this.state.fileList;
				let nowProgress = nextProps.progress;
				nowFileList.map((item, index) => {
					nowProgress.map((itm) => {
						if (itm.file.uid === item.uid) {
							item['percent'] = itm.event.percent
						}
						return true
					})
					return true
				})
				this.setState({
					fileList: [...nowFileList]
				})
			}
		})	
	}
	render(){
		const images = []
		if (this.state.fileList.length !== 0) {
			this.state.fileList.map((item, index)=>{
				if (item.response && item.response.key) {
					images.push(<div className="swiper-slide" key={item.response.key}>
					           <img src={`${this.props.domain}/${item.response.key}`} style={{width: 800, height: 600}} alt="pic"/>
					        </div>)
				}
				return 1;
			})
		}
		
		return (
			<Row gutter={30} className="pic-list">
			{
				this.state.fileList.length === 0
				?(null)
				:this.state.fileList.map((item, index) => (
					<Col xs={24} sm={12} md={8} lg={6} xl={6} className="pic-col" key={item.uid}>
						<div className="pic">
							{
								item.response && item.response.key
								?(
									<div>
										<img src={`${this.props.domain}/${item.response.key}`} alt="pic" title="点击图片预览" onClick={this.handleShow.bind(this,item.response.key,index)}/>
										{
											item.setWrap
											?(<div className="pic-remove"><span>封面</span></div>)
											:(null)
										}
										<Icon type="check-circle-o" className={item.checked?"checked":"no-check"} onClick={this.check.bind(this,item)}/>
										<div className="pic-operation">
											<span onClick={this.setWrap.bind(this, item)}>{item.setWrap?'取消封面':'设置封面'}</span>
										</div>
									</div>
								  )
								:(<div className="default">正在上传</div>)
							}

							{
								item.percent && item.percent < 100 
								?(<Progress width={50} className="my-progress" type="circle" percent={Math.floor(item.percent)}/>)
								:(null)
							}							
						</div>
					</Col>
				))
			}
			
				<Modal visible={this.state.visible} footer={null} width={860} onCancel={this.hide}>
					<div className="swiper-container">
				        <div className="swiper-wrapper">
				           {images}
				        </div>
				        <div className="swiper-button-next"></div>
    					<div className="swiper-button-prev"></div>
				    </div>
					
			    </Modal>
			</Row>
		)
	}
}
export default ImageUpload;