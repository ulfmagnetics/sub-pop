(function(){var t={3649:function(t,e,s){"use strict";var o=s(5130),n=s(6768);const i={id:"app"},r={class:"main-nav"};function a(t,e,s,o,a,c){const l=(0,n.g2)("router-link"),u=(0,n.g2)("router-view");return(0,n.uX)(),(0,n.CE)("div",i,[(0,n.Lk)("nav",r,[(0,n.bF)(l,{to:"/dashboard",class:"nav-link"},{default:(0,n.k6)((()=>e[1]||(e[1]=[(0,n.eW)(" Dashboard ")]))),_:1}),(0,n.bF)(l,{to:"/subscriptions",class:"nav-link"},{default:(0,n.k6)((()=>e[2]||(e[2]=[(0,n.eW)(" Manage Subscriptions ")]))),_:1}),t.currentUser?((0,n.uX)(),(0,n.CE)("button",{key:0,class:"secondary logout-button",onClick:e[0]||(e[0]=(...e)=>t.logOut&&t.logOut(...e))}," Log Out ")):(0,n.Q3)("",!0)]),(0,n.Lk)("main",null,[(0,n.bF)(u)])])}var c=s(9928);const l={region:{NODE_ENV:"production",BASE_URL:"/sub-pop/"}.VUE_APP_COGNITO_REGION||"us-east-1",userPoolId:{NODE_ENV:"production",BASE_URL:"/sub-pop/"}.VUE_APP_COGNITO_USER_POOL_ID||"",clientId:{NODE_ENV:"production",BASE_URL:"/sub-pop/"}.VUE_APP_COGNITO_CLIENT_ID||""},u=Object.freeze({streaming:"Streaming",software:"Software",gaming:"Gaming",creators:"Creators (Patreon, Substack, etc.)",puzzles:"Puzzles/Crosswords",news:"News and Magazines",other:"Other"}),d=new c.NE({UserPoolId:l.userPoolId,ClientId:l.clientId}),p=(t,e)=>{const s=new c.By({Username:t,Password:e}),o={Username:t,Pool:d},n=new c.TU(o);return new Promise(((t,e)=>{n.authenticateUser(s,{onSuccess:e=>{t(e)},onFailure:t=>{e(t)},newPasswordRequired:(e,s)=>{t({challenge:"NEW_PASSWORD_REQUIRED",cognitoUser:n})}})}))},b=()=>d.getCurrentUser(),h=()=>{const t=b();t&&t.signOut()};var m=(0,n.pM)({name:"App",setup(){const t=b(),e=()=>{h(),window.location.reload()};return{currentUser:t,logOut:e}}}),g=s(1241);const v=(0,g.A)(m,[["render",a]]);var w=v,f=s(657),y=(s(8992),s(7550),s(1387));function k(t,e,s,o,i,r){const a=(0,n.g2)("LoginForm"),c=(0,n.g2)("UpdatePasswordForm");return(0,n.uX)(),(0,n.CE)("div",null,[t.challengedUser?((0,n.uX)(),(0,n.Wv)(c,{key:1,challengedUser:t.challengedUser},null,8,["challengedUser"])):((0,n.uX)(),(0,n.Wv)(a,{key:0,onNewPasswordRequired:t.handleNewPasswordRequired},null,8,["onNewPasswordRequired"]))])}var L=s(144);const S={class:"login-form"};function C(t,e,s,i,r,a){return(0,n.uX)(),(0,n.CE)("div",S,[(0,n.Lk)("form",{onSubmit:e[2]||(e[2]=(0,o.D$)(((...e)=>t.handleLogIn&&t.handleLogIn(...e)),["prevent"]))},[e[3]||(e[3]=(0,n.Lk)("h2",null,"Log In",-1)),(0,n.bo)((0,n.Lk)("input",{"onUpdate:modelValue":e[0]||(e[0]=e=>t.username=e),placeholder:"Username",class:"input-field"},null,512),[[o.Jo,t.username]]),(0,n.bo)((0,n.Lk)("input",{"onUpdate:modelValue":e[1]||(e[1]=e=>t.password=e),type:"password",placeholder:"Password",class:"input-field"},null,512),[[o.Jo,t.password]]),e[4]||(e[4]=(0,n.Lk)("div",{class:"button-container"},[(0,n.Lk)("button",{type:"submit",class:"submit-button"},"Log In")],-1))],32)])}s(4114);var E=s(4084);const _={position:"top-right",autoClose:5e3,closeButton:!0,pauseOnHover:!0};function R(t){(0,E.oR)(t,_)}var P=(0,n.pM)({name:"LogIn",data(){return{username:"",password:""}},setup(){const t=(0,y.rd)(),e=b();return e&&t.push({name:"Dashboard"}),{router:t}},methods:{async handleLogIn(){try{const t=await p(this.username,this.password);"NEW_PASSWORD_REQUIRED"===t.challenge?(R("New password required"),this.$emit("new-password-required",t.cognitoUser)):window.location.reload()}catch(t){R("Sorry, there was an error while logging in."),console.error("Login error:",t)}}}});const I=(0,g.A)(P,[["render",C],["__scopeId","data-v-3ab360f6"]]);var U=I;const F={class:"update-password-form"};function A(t,e,s,i,r,a){return(0,n.uX)(),(0,n.CE)("div",F,[(0,n.Lk)("form",{onSubmit:e[2]||(e[2]=(0,o.D$)(((...e)=>t.handleUpdatePassword&&t.handleUpdatePassword(...e)),["prevent"]))},[e[3]||(e[3]=(0,n.Lk)("h2",null,"Update Password",-1)),(0,n.bo)((0,n.Lk)("input",{"onUpdate:modelValue":e[0]||(e[0]=e=>t.currentPassword=e),type:"password",placeholder:"Current Password",class:"input-field"},null,512),[[o.Jo,t.currentPassword]]),(0,n.bo)((0,n.Lk)("input",{"onUpdate:modelValue":e[1]||(e[1]=e=>t.newPassword=e),type:"password",placeholder:"New Password",class:"input-field"},null,512),[[o.Jo,t.newPassword]]),e[4]||(e[4]=(0,n.Lk)("div",{class:"button-container"},[(0,n.Lk)("button",{type:"submit",class:"submit-button"},"Update Password")],-1))],32)])}var N=(0,n.pM)({name:"UpdatePassword",props:{challengedUser:{type:Object,required:!1}},data(){return{currentPassword:"",newPassword:""}},setup(){const t=(0,y.rd)();return{router:t}},methods:{async handleUpdatePassword(){if(this.challengedUser)return void this.challengedUser.completeNewPasswordChallenge(this.newPassword,{},{onSuccess:()=>{R("Password updated successfully"),this.router.push({name:"Dashboard"})},onFailure:t=>{R("Sorry, there was an error updating your password."),console.error("Password update error:",t)}});const t=b();t?t.changePassword(this.currentPassword,this.newPassword,((t,e)=>{t?console.log("Error updating password:",t):console.log("Password updated successfully:",e)})):R("Sorry, you must be logged in to update your password.")}}});const O=(0,g.A)(N,[["render",A],["__scopeId","data-v-6b3b1871"]]);var D=O,x=(0,n.pM)({name:"AuthForm",components:{LoginForm:U,UpdatePasswordForm:D},setup(){const t=(0,L.KR)(null),e=e=>{t.value=e};return{challengedUser:t,handleNewPasswordRequired:e}}});const V=(0,g.A)(x,[["render",k],["__scopeId","data-v-029ee6d0"]]);var X=V,$=s(4232);const T={class:"dashboard"},q={key:0,class:"spinner-container"},B={key:1},j={class:"metrics-grid"},M={class:"metric-card"},J={class:"metric-value"},W={class:"metric-card"},z={class:"metric-value"},G={class:"metric-card"},Q={class:"metric-value"},K={class:"metric-card"},Y={class:"metric-value"},H={class:"dashboard-section"},Z={class:"renewals-list"},tt={key:0,class:"empty-state"},et={class:"renewal-service"},st={class:"renewal-date"},ot={class:"renewal-cost"},nt={class:"dashboard-section"},it={class:"chart-container"},rt={class:"dashboard-section"},at={class:"chart-container"};function ct(t,e,s,o,i,r){const a=(0,n.g2)("PieChart"),c=(0,n.g2)("ScatterPlot");return(0,n.uX)(),(0,n.CE)("div",T,[i.loading?((0,n.uX)(),(0,n.CE)("div",q,e[0]||(e[0]=[(0,n.Lk)("div",{class:"spinner"},null,-1),(0,n.Lk)("p",null,"Loading subscriptions...",-1)]))):((0,n.uX)(),(0,n.CE)("div",B,[(0,n.Lk)("div",j,[(0,n.Lk)("div",M,[e[1]||(e[1]=(0,n.Lk)("h3",null,"Total Monthly Cost",-1)),(0,n.Lk)("div",J,"$"+(0,$.v_)(r.totalMonthlyCost.toFixed(2)),1)]),(0,n.Lk)("div",W,[e[2]||(e[2]=(0,n.Lk)("h3",null,"Total Annual Cost",-1)),(0,n.Lk)("div",z,"$"+(0,$.v_)(r.totalAnnualCost.toFixed(2)),1)]),(0,n.Lk)("div",G,[e[3]||(e[3]=(0,n.Lk)("h3",null,"Active Subscriptions",-1)),(0,n.Lk)("div",Q,(0,$.v_)(r.subscriptions.length),1)]),(0,n.Lk)("div",K,[e[4]||(e[4]=(0,n.Lk)("h3",null,"Average Value Rating",-1)),(0,n.Lk)("div",Y,(0,$.v_)(r.averageValueRating.toFixed(1))+"/5",1)])]),(0,n.Lk)("div",H,[e[5]||(e[5]=(0,n.Lk)("h3",null,"Upcoming Renewals",-1)),(0,n.Lk)("div",Z,[0===r.upcomingRenewals.length?((0,n.uX)(),(0,n.CE)("div",tt," None ")):((0,n.uX)(!0),(0,n.CE)(n.FK,{key:1},(0,n.pI)(r.upcomingRenewals,(t=>((0,n.uX)(),(0,n.CE)("div",{key:t.id,class:"renewal-item"},[(0,n.Lk)("div",et,(0,$.v_)(t.serviceName),1),(0,n.Lk)("div",st,(0,$.v_)(r.formatDate(t.nextRenewal)),1),(0,n.Lk)("div",ot,"$"+(0,$.v_)(t.cost),1)])))),128))])]),(0,n.Lk)("div",nt,[e[6]||(e[6]=(0,n.Lk)("h3",null,"Cost Distribution by Category",-1)),(0,n.Lk)("div",it,[(0,n.bF)(a,{data:r.pieChartData,options:r.pieChartOptions},null,8,["data","options"])])]),(0,n.Lk)("div",rt,[e[7]||(e[7]=(0,n.Lk)("h3",null,"Value vs Cost Analysis",-1)),(0,n.Lk)("div",at,[(0,n.bF)(c,{data:r.scatterChartData,options:r.scatterChartOptions},null,8,["data","options"])])])]))])}s(4520),s(1454),s(8872);var lt=s(1010),ut=s(5524),dt=(s(2577),s(1114));class pt{constructor(t,e,s,o,n,i,r,a=""){(0,dt.A)(this,"subscriptionId",void 0),(0,dt.A)(this,"serviceName",void 0),(0,dt.A)(this,"category",void 0),(0,dt.A)(this,"cost",void 0),(0,dt.A)(this,"billingCycle",void 0),(0,dt.A)(this,"nextRenewal",void 0),(0,dt.A)(this,"valueRating",void 0),(0,dt.A)(this,"notes",void 0),this.subscriptionId=t,this.serviceName=e,this.category=s,this.cost=o,this.billingCycle=n,this.nextRenewal=i,this.valueRating=r,this.notes=a}static buildFromFormData(t){return new pt(t.subscriptionId,t.serviceName,t.category,Number(t.cost),t.billingCycle,t.nextRenewal instanceof Date?t.nextRenewal:new Date(t.nextRenewal),Number(t.valueRating),t.notes||"")}isValid(){const t=Object.keys(u);return!!t.includes(this.category)&&("string"===typeof this.subscriptionId&&this.cost>0&&this.valueRating>=1&&this.valueRating<=5)}}var bt=s(4373);const ht=bt.A.create({baseURL:{NODE_ENV:"production",BASE_URL:"/sub-pop/"}.VUE_APP_API_URL,headers:{"Content-Type":"application/json"}});ht.interceptors.request.use((async t=>{const e=b();return e&&e.getSession(((e,s)=>{if(e)return void console.error("Error getting session:",e);const o=s.getIdToken().getJwtToken();o&&(t.headers.Authorization=`Bearer ${o}`)})),t}),(t=>Promise.reject(t)));var mt=ht;const gt=(0,f.nY)("subscriptions",{state:()=>({subscriptions:[],loading:!1,error:null}),getters:{},actions:{async fetchSubscriptions(){this.loading=!0;try{const t=await mt.get("/subscriptions",{params:{sortBy:"serviceName",sortOrder:"asc"}});this.subscriptions=t.data.map((t=>new pt(t.subscriptionId,t.serviceName,t.category,t.cost,t.billingCycle,new Date(t.nextRenewal),t.valueRating,t.notes||"")))}catch(t){throw this.error="Failed to fetch subscriptions: "+t,t}finally{this.loading=!1}},async addSubscription(t){this.loading=!0;try{const e=await mt.post("/subscriptions",t);this.subscriptions.push(new pt(e.data.subscriptionId,e.data.serviceName,e.data.category,e.data.cost,e.data.billingCycle,new Date(e.data.nextRenewal),e.data.valueRating,e.data.notes||""))}catch(e){this.error="Failed to add subscription: "+e}finally{this.loading=!1}},async updateSubscription(t){this.loading=!0;try{const{subscriptionId:e,...s}=t;await mt.put(`/subscriptions/${e}`,s);const o=this.subscriptions.findIndex((t=>t.subscriptionId===e));-1!==o&&(this.subscriptions[o]=t)}catch(e){throw this.error="Failed to update subscription: "+e,e}finally{this.loading=!1}},async removeSubscription(t){this.loading=!0;try{await mt.delete(`/subscriptions/${t}`),this.subscriptions=this.subscriptions.filter((e=>e.subscriptionId!==t))}catch(e){throw this.error="Failed to remove subscription: "+e,e}finally{this.loading=!1}},getSubscriptionById(t){return this.subscriptions.find((e=>e.subscriptionId===t))},addSubscriptionLocalStorage(t){if(!t.isValid())throw new Error("Invalid subscription");this.subscriptions.push(t),this._persistToStorage()},updateSubscriptionLocalStorage(t){if(!t.isValid())throw new Error("Invalid subscription");const e=this.getSubscriptionById(t.subscriptionId);if(!e)throw new Error(`no subscription found with id ${t.subscriptionId}`);Object.assign(e,t),this._persistToStorage()},removeSubscriptionLocalStorage(t){this.subscriptions=this.subscriptions.filter((e=>e.subscriptionId!==t)),this._persistToStorage()},_persistToStorage(){localStorage.setItem("subscriptions",JSON.stringify(this.subscriptions))}}});ut.t1.register(ut.hE,ut.m_,ut.s$,ut.Bs,ut.kc,ut.FN);const vt=["#8884d8","#82ca9d","#ffc658","#ff7300","#0088fe"];var wt={name:"DashboardView",components:{PieChart:lt.Fq,ScatterPlot:lt.Xl},data(){return{loading:!1}},computed:{subscriptionStore(){return gt()},subscriptions(){return this.subscriptionStore.subscriptions},totalMonthlyCost(){return this.subscriptions.reduce(((t,e)=>{const s=parseFloat(e.cost);return t+("annual"===e.billingCycle?s/12:s)}),0)},totalAnnualCost(){return this.subscriptions.reduce(((t,e)=>{const s=parseFloat(e.cost);return t+("annual"===e.billingCycle?s:12*s)}),0)},averageValueRating(){if(0===this.subscriptions.length)return 0;const t=this.subscriptions.reduce(((t,e)=>t+e.valueRating),0);return t/this.subscriptions.length},upcomingRenewals(){const t=new Date,e=new Date(t.getTime()+2592e6);return this.subscriptions.filter((s=>{const o=new Date(s.nextRenewal);return o>=t&&o<=e})).sort(((t,e)=>new Date(t.nextRenewal)-new Date(e.nextRenewal))).slice(0,5)},costByCategory(){const t=this.subscriptions.reduce(((t,e)=>{const s="annual"===e.billingCycle?e.cost/12:e.cost;return t[e.category]=(t[e.category]||0)+s,t}),{});return Object.entries(t).map((([t,e])=>({name:t,value:parseFloat(e.toFixed(2))})))},pieChartData(){return{labels:this.costByCategory.map((t=>t.name)),datasets:[{data:this.costByCategory.map((t=>t.value)),backgroundColor:vt}]}},pieChartOptions(){return{responsive:!0,plugins:{legend:{position:"top"},tooltip:{callbacks:{label:t=>{const e=t.raw;return"$"+e.toFixed(2)}}}}}},scatterChartData(){const t=this.subscriptions.map((t=>({serviceName:t.serviceName,x:"annual"===t.billingCycle?parseFloat((t.cost/12).toFixed(2)):parseFloat(t.cost),y:t.valueRating})));return{datasets:[{label:"Value vs. Cost",data:t,backgroundColor:"#42A5F5",borderColor:"#1E88E5",borderWidth:1}]}},scatterChartOptions(){return{responsive:!0,scales:{x:{title:{display:!0,text:"Monthly Cost ($)"}},y:{title:{display:!0,text:"Value Rating"},min:0,max:5}},plugins:{tooltip:{callbacks:{label:t=>{const{x:e,y:s,serviceName:o}=t.raw;return`${o}: Cost: $${e.toFixed(2)}, Value: ${s}`}}}}}}},methods:{formatDate(t){return new Date(t).toLocaleDateString()},async fetchSubscriptions(){this.loading=!0;try{await this.subscriptionStore.fetchSubscriptions()}catch(t){console.error("Error fetching subscriptions:",t),R("Failed to fetch subscriptions. Please try again later.")}finally{this.loading=!1}}},mounted(){this.fetchSubscriptions()},beforeUnmount(){window.removeEventListener("storage",this.loadSubscriptions)}};const ft=(0,g.A)(wt,[["render",ct],["__scopeId","data-v-2e838f15"]]);var yt=ft;const kt={id:"subscription-manager"};function Lt(t,e,s,o,i,r){const a=(0,n.g2)("subscription-form"),c=(0,n.g2)("subscription-list");return(0,n.uX)(),(0,n.CE)("div",kt,[(0,n.Lk)("header",null,[e[1]||(e[1]=(0,n.Lk)("h2",null,"Manage Subscriptions",-1)),i.showForm?(0,n.Q3)("",!0):((0,n.uX)(),(0,n.CE)("button",{key:0,onClick:e[0]||(e[0]=(...t)=>r.handleAddSubscriptionClick&&r.handleAddSubscriptionClick(...t))}," Add Subscription "))]),i.showForm?((0,n.uX)(),(0,n.Wv)(a,{key:0,subscription:i.editingSubscription,onSubscriptionSubmit:r.handleSubscriptionSubmit,onCancel:r.handleCancel,ref:"subscriptionForm"},null,8,["subscription","onSubscriptionSubmit","onCancel"])):((0,n.uX)(),(0,n.Wv)(c,{key:1,onEdit:r.handleEdit},null,8,["onEdit"]))])}const St={class:"subscription-list"},Ct={key:0,class:"loading-state"},Et={key:1},_t={key:0,class:"empty-state"},Rt={key:1,class:"subscription-grid"},Pt={class:"subscription-details"},It={class:"card-actions"},Ut=["onClick"],Ft=["onClick"];function At(t,e,s,o,i,r){return(0,n.uX)(),(0,n.CE)("div",St,[e[1]||(e[1]=(0,n.Lk)("h2",null,"Your Subscriptions",-1)),r.loading?((0,n.uX)(),(0,n.CE)("div",Ct,e[0]||(e[0]=[(0,n.Lk)("div",{class:"spinner"},null,-1),(0,n.Lk)("p",null,"Loading subscriptions...",-1)]))):((0,n.uX)(),(0,n.CE)("div",Et,[0===r.subscriptions.length?((0,n.uX)(),(0,n.CE)("div",_t," You haven't added any subscriptions yet. ")):((0,n.uX)(),(0,n.CE)("div",Rt,[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(r.subscriptions,(t=>((0,n.uX)(),(0,n.CE)("div",{key:t.subscriptionId,class:"subscription-card"},[(0,n.Lk)("h3",null,(0,$.v_)(t.serviceName),1),(0,n.Lk)("div",Pt,[(0,n.Lk)("p",null,"Category: "+(0,$.v_)(i.categories[t.category]),1),(0,n.Lk)("p",null,"Cost: $"+(0,$.v_)(t.cost.toFixed(2))+" "+(0,$.v_)(t.billingCycle),1),(0,n.Lk)("p",null,"Next Renewal: "+(0,$.v_)(r.formatDate(t.nextRenewal)),1),(0,n.Lk)("p",null,"Value Rating: "+(0,$.v_)(t.valueRating)+"/5",1)]),(0,n.Lk)("div",It,[(0,n.Lk)("button",{onClick:e=>r.editSubscription(t.subscriptionId)},"Edit",8,Ut),(0,n.Lk)("button",{onClick:e=>r.deleteSubscription(t.subscriptionId),class:"delete-btn"}," Delete ",8,Ft)])])))),128))]))]))])}var Nt={name:"SubscriptionList",data(){return{categories:u}},computed:{subscriptionStore(){return gt()},subscriptions(){return this.subscriptionStore.subscriptions},loading(){return this.subscriptionStore.loading}},methods:{async fetchSubscriptions(){try{await this.subscriptionStore.fetchSubscriptions()}catch(t){R("Failed to fetch subscriptions. Please try again later.")}},editSubscription(t){this.$emit("edit",t)},deleteSubscription(t){confirm("Are you sure you want to delete this subscription?")&&this.subscriptionStore.removeSubscription(t)},formatDate(t){return new Date(t).toLocaleDateString("en-US",{timeZone:"UTC"})}},mounted(){this.fetchSubscriptions()}};const Ot=(0,g.A)(Nt,[["render",At],["__scopeId","data-v-b50fd93c"]]);var Dt=Ot;const xt={class:"subscription-form"},Vt={class:"form-group"},Xt={class:"form-group"},$t=["value"],Tt={class:"form-group"},qt={class:"form-group"},Bt={class:"form-group"},jt={class:"form-group"},Mt={class:"form-group"},Jt={class:"form-actions"},Wt={type:"submit"};function zt(t,e,s,i,r,a){return(0,n.uX)(),(0,n.CE)("div",xt,[(0,n.Lk)("h2",null,(0,$.v_)(a.isEditing?"Edit Subscription":"Add New Subscription"),1),(0,n.Lk)("form",{onSubmit:e[9]||(e[9]=(0,o.D$)(((...t)=>a.handleSubmit&&a.handleSubmit(...t)),["prevent"]))},[a.isEditing?(0,n.bo)(((0,n.uX)(),(0,n.CE)("input",{key:0,type:"hidden","onUpdate:modelValue":e[0]||(e[0]=t=>r.form.id=t)},null,512)),[[o.Jo,r.form.id]]):(0,n.Q3)("",!0),(0,n.Lk)("div",Vt,[e[10]||(e[10]=(0,n.Lk)("label",{for:"serviceName"},"Service Name",-1)),(0,n.bo)((0,n.Lk)("input",{id:"serviceName","onUpdate:modelValue":e[1]||(e[1]=t=>r.form.serviceName=t),type:"text",required:""},null,512),[[o.Jo,r.form.serviceName]])]),(0,n.Lk)("div",Xt,[e[12]||(e[12]=(0,n.Lk)("label",{for:"category"},"Category",-1)),(0,n.bo)((0,n.Lk)("select",{id:"category","onUpdate:modelValue":e[2]||(e[2]=t=>r.form.category=t),required:""},[e[11]||(e[11]=(0,n.Lk)("option",{value:""},"Select a category",-1)),((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(r.categories,((t,e)=>((0,n.uX)(),(0,n.CE)("option",{key:e,value:e},(0,$.v_)(t),9,$t)))),128))],512),[[o.u1,r.form.category]])]),(0,n.Lk)("div",Tt,[e[13]||(e[13]=(0,n.Lk)("label",{for:"cost"},"Cost",-1)),(0,n.bo)((0,n.Lk)("input",{id:"cost","onUpdate:modelValue":e[3]||(e[3]=t=>r.form.cost=t),type:"number",step:"0.01",required:""},null,512),[[o.Jo,r.form.cost,void 0,{number:!0}]])]),(0,n.Lk)("div",qt,[e[15]||(e[15]=(0,n.Lk)("label",{for:"billingCycle"},"Billing Cycle",-1)),(0,n.bo)((0,n.Lk)("select",{id:"billingCycle","onUpdate:modelValue":e[4]||(e[4]=t=>r.form.billingCycle=t),required:""},e[14]||(e[14]=[(0,n.Lk)("option",{value:"monthly"},"Monthly",-1),(0,n.Lk)("option",{value:"annual"},"Annual",-1)]),512),[[o.u1,r.form.billingCycle]])]),(0,n.Lk)("div",Bt,[e[16]||(e[16]=(0,n.Lk)("label",{for:"nextRenewal"},"Next Renewal Date",-1)),(0,n.bo)((0,n.Lk)("input",{id:"nextRenewal","onUpdate:modelValue":e[5]||(e[5]=t=>r.form.nextRenewal=t),type:"date",required:""},null,512),[[o.Jo,r.form.nextRenewal]])]),(0,n.Lk)("div",jt,[e[17]||(e[17]=(0,n.Lk)("label",{for:"valueRating"},"Value Rating",-1)),(0,n.bo)((0,n.Lk)("input",{id:"valueRating","onUpdate:modelValue":e[6]||(e[6]=t=>r.form.valueRating=t),type:"number",min:"1",max:"5",required:""},null,512),[[o.Jo,r.form.valueRating,void 0,{number:!0}]])]),(0,n.Lk)("div",Mt,[e[18]||(e[18]=(0,n.Lk)("label",{for:"notes"},"Notes",-1)),(0,n.bo)((0,n.Lk)("textarea",{id:"notes","onUpdate:modelValue":e[7]||(e[7]=t=>r.form.notes=t),rows:"3"},null,512),[[o.Jo,r.form.notes]])]),(0,n.Lk)("div",Jt,[(0,n.Lk)("button",{type:"button",onClick:e[8]||(e[8]=e=>t.$emit("cancel"))},"Cancel"),(0,n.Lk)("button",Wt,(0,$.v_)(a.isEditing?"Update":"Add")+" Subscription ",1)])],32)])}const Gt={serviceName:"",category:"",cost:"",billingCycle:"monthly",nextRenewal:"",valueRating:3,notes:""};var Qt={name:"SubscriptionForm",props:{subscription:{type:Object,default:null}},data(){return{categories:u,form:Gt}},computed:{isEditing(){return!!this.subscription}},methods:{handleSubmit(){this.$emit("subscription-submit",this.form)},resetForm(){this.form={...Gt}}},watch:{subscription:{immediate:!0,handler(t){t?(this.form={...t},this.form.nextRenewal=new Date(t.nextRenewal).toISOString().split("T")[0]):this.resetForm()}}}};const Kt=(0,g.A)(Qt,[["render",zt],["__scopeId","data-v-7bc2175e"]]);var Yt=Kt,Ht={name:"SubscriptionManager",components:{SubscriptionList:Dt,SubscriptionForm:Yt},data(){return{showForm:!1,editingSubscription:null}},methods:{handleAddSubscriptionClick(){this.showForm=!0,this.editingSubscription=null},async handleSubscriptionSubmit(t){try{const e=pt.buildFromFormData(t),s=gt();e.subscriptionId?await s.updateSubscription(e):await s.addSubscription(e),this.$refs.subscriptionForm.resetForm(),R("Subscription saved successfully!")}catch(e){R("Sorry, there was an error while saving the subscription."),console.error(e)}this.showForm=!1,this.editingSubscription=null},handleEdit(t){const e=gt();this.editingSubscription=e.getSubscriptionById(t),this.showForm=!0},handleCancel(){this.editingSubscription=null,this.showForm=!1}}};const Zt=(0,g.A)(Ht,[["render",Lt],["__scopeId","data-v-24a15cff"]]);var te=Zt;const ee=[{path:"/",redirect:"/dashboard"},{path:"/login",name:"Login",component:X},{path:"/update-password",name:"UpdatePassword",component:D},{path:"/dashboard",name:"Dashboard",component:yt,meta:{requiresAuth:!0}},{path:"/subscriptions",name:"Subscriptions",component:te,meta:{requiresAuth:!0}}],se=(0,y.aE)({history:(0,y.Bt)(),routes:ee});se.beforeEach(((t,e,s)=>{const o=t.matched.some((t=>t.meta.requiresAuth)),n=b();o&&!n?s({name:"Login"}):s()}));var oe=se;const ne=(0,o.Ef)(w),ie=(0,f.Ey)();ne.use(ie),ne.use(oe),ne.use(E.Ay,{autoClose:5e3}),ne.mount("#app")},5682:function(){}},e={};function s(o){var n=e[o];if(void 0!==n)return n.exports;var i=e[o]={exports:{}};return t[o].call(i.exports,i,i.exports,s),i.exports}s.m=t,function(){var t=[];s.O=function(e,o,n,i){if(!o){var r=1/0;for(u=0;u<t.length;u++){o=t[u][0],n=t[u][1],i=t[u][2];for(var a=!0,c=0;c<o.length;c++)(!1&i||r>=i)&&Object.keys(s.O).every((function(t){return s.O[t](o[c])}))?o.splice(c--,1):(a=!1,i<r&&(r=i));if(a){t.splice(u--,1);var l=n();void 0!==l&&(e=l)}}return e}i=i||0;for(var u=t.length;u>0&&t[u-1][2]>i;u--)t[u]=t[u-1];t[u]=[o,n,i]}}(),function(){s.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,{a:e}),e}}(),function(){s.d=function(t,e){for(var o in e)s.o(e,o)&&!s.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:e[o]})}}(),function(){s.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}}(),function(){var t={524:0};s.O.j=function(e){return 0===t[e]};var e=function(e,o){var n,i,r=o[0],a=o[1],c=o[2],l=0;if(r.some((function(e){return 0!==t[e]}))){for(n in a)s.o(a,n)&&(s.m[n]=a[n]);if(c)var u=c(s)}for(e&&e(o);l<r.length;l++)i=r[l],s.o(t,i)&&t[i]&&t[i][0](),t[i]=0;return s.O(u)},o=self["webpackChunksub_pop"]=self["webpackChunksub_pop"]||[];o.forEach(e.bind(null,0)),o.push=e.bind(null,o.push.bind(o))}();var o=s.O(void 0,[504],(function(){return s(3649)}));o=s.O(o)})();
//# sourceMappingURL=app.423a4979.js.map