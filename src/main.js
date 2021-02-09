import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css


import store from './store'


import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import permission from '@/directive/permission/index.js' // 权限判断指令
import elDragDialog from '@/directive/el-drag-dialog'

import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'
import AmapVue from '@amap/amap-vue'

AmapVue.config.version = '2.0' // 默认2.0，这里可以不修改
AmapVue.config.key = 'd3a2d814e3000f9136d7a43084cf9524'
AmapVue.config.plugins = [
  'AMap.ToolBar',
  'AMap.MoveAnimation'
  // 在此配置你需要预加载的插件，如果不配置，在使用到的时候会自动异步加载
]
Vue.use(AmapVue)

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.config.productionTip = false
import Form from 'ant-design-vue/lib/form'
Vue.component(Form)

Vue.use(Antd)

Vue.use(VueHighlightJS)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

import App from './App'
import router from './router'

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.directive('permission', permission)
Vue.directive('elDragDialog', elDragDialog)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
