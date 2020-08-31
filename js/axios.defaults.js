axios.defaults.baseURL = "http://127.0.0.1:8888";
//使用ajax请求时默认不会携带cookie,所以需要写这句话
axios.defaults.withCredentials = true;
//以表单形式把数据给服务器
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = function(data){
if (!data) return data;
let result = ''
for (let attr in data) {
  if(!data.hasOwnProperty(attr)) break;
  result += `&${attr}=${data[attr]}`;
}
return result.substring(1);
}
//配置请求拦截器
axios.interceptors.request.use(config =>{
    return config
})
//配置响应拦截器
//把这个返回的数据传给res
axios.interceptors.response.use(response=> {
    return response.data;
},reason=>{
    if(reason.response){
        switch(String(reason.response.status)){
            case "404":
                alert("当前地址不存在")
                break;
                default:
                    break;
        }
    }
   /*  console.log(reason) */
    //会把这个传给res，没这个就不会接收到错误
   return Promise.reject(reason);
}
)
