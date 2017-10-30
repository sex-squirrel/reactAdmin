import Index from '../views/Index'
import Login from '../views/Login'
//子页面
import TablePage from '../views/TablePage';
import CreateHouse from '../views/CreateHouse';
//路由配置信息
const routes = [
      {
        path: '/index/:type',
        component: Index,
        routes:[
          {
            path: '/index/table',
            exact: true,
            component: TablePage,
          },{
              path: '/index/create',
              exact: true,
              component: CreateHouse,
            }
        ]
  	 }
]

export default routes;