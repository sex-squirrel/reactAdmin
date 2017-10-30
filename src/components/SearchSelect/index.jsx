import React , {Component} from 'react';
import { Modal, Cascader, Checkbox } from 'antd';
import './index.css';

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
class SearchSelect extends Component {
    constructor(props){
        super(props)
    };
    childSelect = (e)=>{
        console.log(e.target.checked)
    }
    render(){
        return (
            <Modal
                visible={true}
                title="新增小区">
                <Cascader
                    placeholder="请选择区域"
                    options={options}
                    style={{width: 300}}
                />
                <ul className="label-content">
                    <li
                        className="label-wrap">
                        <div
                            className="label-text">标签内容</div>
                        <span
                            className="label-close"></span>
                    </li>
                </ul>
                <div className="select-wrap">
                    <ul className="data-content">
                       <li className="label-nav active-label">
                           <div>父级列表</div>
                       </li>
                        <li  className="label-nav">
                            <div>父级列表</div>
                        </li>
                    </ul>
                    <ul className="child-data">
                        <li>
                            <Checkbox
                                onClick={this.childSelect}>子级数据</Checkbox>
                        </li>
                    </ul>
                </div>
            </Modal>
        )
    }

}
export default SearchSelect;