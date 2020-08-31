$(function(){
    init();
    let $plan = $.Callbacks();
    //订阅，没有先后顺序
    $plan.add((_,baseInfo)=>{
        console.log("渲染用户信息",baseInfo)
        $(".baseBox>span").html(`你好,${baseInfo.name || ''}`)
        $(".baseBox>a").click(async function(){
            let result = await axios.get("user/signout")
            if(result.code == 0){
                window.location.href = "login.html";
                return;
            }
            alert("网络不给力，稍后在试")
        })
    })
    $plan.add((power)=>{
        console.log("渲染菜单",power)
    })
    
   async function init(){
        let result = await axios.get("user/login");
        console.log((result))
        if(result.code != 0){
            alert("你还没有登录，请先登录");
            window.location.href="login.html";
            return;
        }
        //当登录成功
        //使用发布订阅
        let [power,baseInfo] = await axios.all([
            //用户权限
            axios.get("/user/power"),
            //用户信息
            axios.get("/user/info")
        ])
        baseInfo.code === 0? baseInfo = baseInfo.data : null;
        //把这两个参数传给$plan  发布
        $plan.fire(power,baseInfo)

    }
})