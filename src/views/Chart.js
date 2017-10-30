import React, { Component } from 'react';
import echarts from 'echarts';
import 'echarts/lib/chart/bar';
class Chart extends Component {
    constructor(props){
        super(props)
        this.state = {
            title: { text: '当前各项房源情况' },
            tooltip: {},
            xAxis: {
                data: ["待录入","待审核","待认证","发布中","已删除"]
            },
            yAxis: {},
            series: [{
                name: '数量',
                type: 'bar',
                data: [5, 80, 36, 10, 10]
            }]
        }
    }
    componentDidMount(){
        const $bar = document.querySelector('.bar');
        const $barChart = echarts.init($bar);
        $barChart.setOption(this.state)
    }
    render(){
        return (
            <div>
                <div className="bar" style={{width:480,height:320}}></div>
            </div>
        )
    }
}
export default Chart

