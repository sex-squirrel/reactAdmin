import React, { Component } from 'react';
import { Modal, message } from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as submit from '../redux/actions/TableOperation'
import Api from '../api';
/*对话框内容*/
import ModalCheck from '../components/ModalCheck'
import ModalAuthen from '../components/ModalAuthen'
import ModalDelete from '../components/ModalDelete'
class IModal extends Component{
	onSure = (e) =>{
		if (this.props.type==='restore') {
			Api.recovery({id: this.props.row._id})
			.then(res=>{
				if (res.errcode === 0) {
					message.success(res.msg)
					this.props.getList();
					this.props.hide();
				}else{
					message.error(res.msg)
				}
			})
			return
		}
		this.props.subDispatch();
	}
	render(){
		return (
			<Modal {...this.props} onCancel={this.props.hide} width={600} onOk={this.onSure}>
				{
                    this.props.type==='audit'
                    ?(<ModalCheck row={this.props.row} getList={this.props.getList} hide={this.props.hide}/>)
                    :this.props.type==='authen'
                    ?(<ModalAuthen row={this.props.row} getList={this.props.getList} hide={this.props.hide}/>)
                    :this.props.type==='delete'
                    ?(<ModalDelete row={this.props.row} getList={this.props.getList} hide={this.props.hide}/>)
                    :this.props.type==='restore'
                    ?(<span>确定重新发布该房源?</span>)
                    :(null)
                }
			</Modal>
		)
	}
}


function mapStateToProps(state) {
  return {}
}
function mapDispatchToProps(dispatch,ownProps){
    return  bindActionCreators(submit,dispatch)
}
export default connect(mapStateToProps,mapDispatchToProps)(IModal);