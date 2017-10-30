/*
	表单字典处理函数
	checkBoxs多选框
	dictChecks(data = [])
	@params  data Array 
	房屋布局
	dictLayout(data = [])
	@params  data Array 	
*/
export const dictChecks = (data = [], type = false, arr = [])=>{
	data.map((item, index)=>{
		if (!type) {
			item = {
				value: item.id,
				label: item.name
			}
		}else{
			item = {
				value: item.name,
				label: item.name
			}
		}
		data[index] = item;
		return true
	})
	return data;
}
export const dictChecksConfig = (data = [])=>{
	data.map((item, index)=>{
		item = {
			value: item.name,
			label: item.name
		}
		data[index] = item;
		return true
	})
	return data;
}
export const dictLayout = (data = [])=>{
	let arr = [];
	data.map((item,index)=>{
		let a = []
		for(let i=1; i <= item.max; i++){
			let obj = {
				type: item.type,
				value: `${i}`,
				label: i+item.value,
			}
			a.push(obj)
		}
		arr.push(a);
		return true
	})
	data = [];
	arr.map((item, index) => {
		if (index < arr.length-1) {
			item.map((itm) => {
				itm['children'] = arr[index + 1]
				return true
			})
		}
		return true
	})
	data = arr[0];
	// console.log(data)
	return data;
}
export const dictMaxFloor = (data = {floor_max: 0})=>{
	let maxFloor = []
	for (let i = 1; i <= data.floor_max; i++) {
		let obj = {label:i,value: `${i}`,isLeaf: false}
    	maxFloor.push(obj)
	}
	return maxFloor;
}
/*
	省市区小区完整树数据处理
	renameOperation(data = [])
	@params  data Array 请求到省市区小区结构
*/
const renameOperation = (data = [])=>{
	data.map((item, index) => {
		if ( item.children ) {
			item = {
				value: item.zone_id,
				label: item.zone_name,
				children: item.children
			}
		}else{
			item = {
				value: item.zone_id,
				label: item.zone_name,
			}
		}
		data[index] = item;
		renameOperation(item.children)
		return true
	})
	return data;
}
export const addressTree = (data)=>{
	return renameOperation(data.data)
}
/*
	小区楼栋数据处理
	zoneOperation(data = [])
	@params  data Array 请求到对应小区楼栋单元结构
*/
const zoneOperation = (data = [])=>{
	data.map((item, index) => {
		if ( item.child && item.child.length) {
			item = {
				value: item.comm_id,
				label: item.comm_name,
				children: item.child,
			}
		}
		else if(item.children && item.children.length){
			item = {
				value: item.comm_id,
				label: item.comm_name,
				children: item.children,
			}
		}else if(item.child && !item.child.length) {
			item = {
				value: item.comm_id,
				label: item.comm_name,
				isLeaf: false
			}
		}else{
			item = {
				value: item.comm_id,
				label: item.comm_name,
			}
		}
		data[index] = item;
		zoneOperation(item.children)
		return true
	})
	return data;
}
export const communityTree = (data)=>{
	return zoneOperation(data)
}

/*
	列表处理函数
*/
export const listOperation = (data)=>{
	//comm_id_path
	// images: [pic],
    //      houseInfo: {dec: '桃源居 5300元/月 89.0㎡ 3室2厅1卫', building: 'B栋1单元602房', key: '有钥匙'},
    //      owners: [{name:'asd',from:'嘿芝麻APP',time: '2017-08-08 17:32:16'}],
    //      lastLog: '2017-7-25添加新房源',
    //      status_manage_label: '待录入',
    //      key: i,
    //      _id: i
	if (data && data.pagination && data.pagination.data && data.pagination.data.length > 0) {
		let list = [];
		data.pagination.data.map((item) => {
			let obj = {
				title: item.title,
				images: item.images[0],
				houseInfo:{
					dec: `${item.zone_name} ${item.rent}元/月 ${item.size}㎡ ${item.layout[0]}室${item.layout[1]}厅${item.layout[2]}卫`,
					from:``,
					key: ``,
					building: `${item.comm_name_path?item.comm_name_path:item.comm_name_array&&item.comm_name_array.length>0?item.comm_name_array[0]+'栋'+item.comm_name_array[1]+'楼'+item.comm_name_array[2]+'号':''}`
				},
				owners: {
					name: item.contact,
					from: item.from_platform === 1 ?'嘿芝麻社区':'嘿芝麻物管平台',
					time: item.created_at
				},
				status_manage_label: item.status_manage_label,
				type_quality: item.type_quality.toString(),
				type_quality_desc: item.type_quality_desc?item.type_quality_desc:'',
				_id: item._id,
				key: item._id
			}
			list.push(obj)
			return true
		})
		return list;
	}
	return [];
}
/*房源审核表单默认值*/
export const checkOperation = (data = {})=>{
	let o = {
		contact: data.contact,
		contact_mobile: data.contact_mobile,
		owners: data.contacts?data.contacts:[],
		zone_name_path: data.zone_name_path,
		zone_id_path: data.zone_id_path,
		comm_id_path: data.comm_id_path,
		comm_name_path: data.comm_name_path?data.comm_name_path.split(' '):[],
		layout: data.layout,
		size: data.size,
		rent: data.rent,
		type_pay: data.type_pay_label,
		title: data.title,
		desc: data.desc,
		floor: data.floor,
		furniture: data.furniture,
		points: data.points,
		images: data.images,
		type_pay_label: data.type_pay_label,
		comm_name_array: data.comm_name_array?data.comm_name_array:[],
		property: data.property?data.property: []
	}
	return o;
}
/*物业数据处理*/
export const propertyOperation = (data = [])=>{
	let o = {
		pro_company: [],
		pro_name: []
	}
	if (data && data.pro_company && data.pro_mobile && data.pro_name && data.pro_id) {
		o.pro_company.push({value:data.pro_id.toString(),label:data.pro_company});
		o.pro_name.push({name:data.pro_name, mobile:data.pro_mobile,contact: data.pro_name+data.pro_mobile});
	}
	return o;
}

//用户列表处理
export const userListOperation = (data=[])=>{
	let arr = [];
	if (data.length > 0){
		data.map(item=>{
            let o = Object.assign({},item,{
                role: item.role_name.match(/house_platform/ig)?item.property_name:'嘿芝麻平台',
                key: item.id
            })
            arr.push(o);
            return true;
		})
	}
	return arr;
}
