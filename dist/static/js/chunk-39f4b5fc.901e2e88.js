(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-39f4b5fc"],{2017:function(e,t,o){"use strict";o("cafe")},4600:function(e,t,o){"use strict";o("b4dc")},"9ed6":function(e,t,o){"use strict";o.r(t);var s=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"login-container"},[o("el-form",{ref:"loginForm",staticClass:"login-form",attrs:{model:e.loginForm,autocomplete:"on","label-position":"left"}},[o("div",{staticClass:"title-container"},[o("h3",{staticClass:"title"},[e._v(" "+e._s(e.$t("login.title"))+" ")]),o("lang-select",{staticClass:"set-language"})],1),o("el-form-item",{attrs:{prop:"username",error:e.error.name?e.error.name[0]:""}},[o("span",{staticClass:"svg-container"},[o("svg-icon",{attrs:{"icon-class":"user"}})],1),o("el-input",{ref:"username",attrs:{placeholder:e.$t("login.username"),name:"username",type:"text",tabindex:"1",autocomplete:"on"},model:{value:e.loginForm.username,callback:function(t){e.$set(e.loginForm,"username",t)},expression:"loginForm.username"}})],1),o("el-tooltip",{attrs:{content:e.$t("common.capsLock"),placement:"right",manual:""},model:{value:e.capsTooltip,callback:function(t){e.capsTooltip=t},expression:"capsTooltip"}},[o("el-form-item",{attrs:{prop:"password",error:e.error.password?e.error.password[0]:""}},[o("span",{staticClass:"svg-container"},[o("svg-icon",{attrs:{"icon-class":"password"}})],1),o("el-input",{key:e.passwordType,ref:"password",attrs:{type:e.passwordType,placeholder:e.$t("login.password"),name:"password",tabindex:"2",autocomplete:"on"},on:{blur:function(t){e.capsTooltip=!1}},nativeOn:{keyup:[function(t){return e.checkCapslock(t)},function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleLogin(t)}]},model:{value:e.loginForm.password,callback:function(t){e.$set(e.loginForm,"password",t)},expression:"loginForm.password"}}),o("span",{staticClass:"show-pwd",on:{click:e.showPwd}},[o("svg-icon",{attrs:{"icon-class":"password"===e.passwordType?"eye":"eye-open"}})],1)],1)],1),o("el-button",{staticStyle:{width:"100%","margin-bottom":"30px"},attrs:{loading:e.loading,type:"primary"},nativeOn:{click:function(t){return t.preventDefault(),e.handleLogin(t)}}},[e._v(" "+e._s(e.$t("login.logIn"))+" ")])],1)],1)},n=[],r=(o("13d5"),o("b64b"),o("1131")),a={name:"Login",components:{LangSelect:r["a"]},data:function(){return{loginForm:{username:"",password:""},passwordType:"password",capsTooltip:!1,loading:!1,showDialog:!1,redirect:void 0,otherQuery:{},error:{}}},watch:{$route:{handler:function(e){var t=e.query;t&&(this.redirect=t.redirect,this.otherQuery=this.getOtherQuery(t))},immediate:!0}},created:function(){},mounted:function(){""===this.loginForm.username?this.$refs.username.focus():""===this.loginForm.password&&this.$refs.password.focus()},destroyed:function(){},methods:{checkCapslock:function(e){var t=e.key;this.capsTooltip=t&&1===t.length&&t>="A"&&t<="Z"},showPwd:function(){var e=this;"password"===this.passwordType?this.passwordType="":this.passwordType="password",this.$nextTick((function(){e.$refs.password.focus()}))},handleLogin:function(){var e=this;this.loading=!0,this.$store.dispatch("user/login",this.loginForm).then((function(){e.$router.push({path:e.redirect||"/",query:e.otherQuery}),e.loading=!1})).catch((function(t){e.loading=!1;var o=t.response.data;422===o.code&&(e.error=o.data)}))},getOtherQuery:function(e){return Object.keys(e).reduce((function(t,o){return"redirect"!==o&&(t[o]=e[o]),t}),{})}}},i=a,c=(o("2017"),o("4600"),o("2877")),l=Object(c["a"])(i,s,n,!1,null,"a8006760",null);t["default"]=l.exports},b4dc:function(e,t,o){},cafe:function(e,t,o){}}]);