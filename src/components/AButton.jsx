import React, { Component } from 'react';

class AButton extends Component{
	constructor(props) {
		super(props);
		this.state = {
			row: this.props.row
		}
	}


	render(){
		const row = this.state.row
		return (
			<div>
				{
					this.props.buttons.map((item,index) => (
						<a href="javascript:void(0);"
						   onClick={item.clickHandle.bind(this,row)}
						   key={index}
						   style={{marginRight:10}}>{item.txt}</a>
					))
				}
			</div>
		)
	}
}


export default AButton;