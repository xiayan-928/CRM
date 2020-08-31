$(function(){
    init();
    let $itemBoxList = null;
    //点击的两个按钮
     //0: a  1: a
    let $navBoxList = $(".navBox>a");

    //订阅，没有先后顺序
    //获取用户信息
    let $plan = $.Callbacks();
    $plan.add((_,baseInfo)=>{
       /*  console.log("渲染用户信息",baseInfo) */
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

    //定义用户权限
    $plan.add((power)=>{
    let str = ``;
    if(power.includes("userhandle")){
        str += `
        <div class = "itemBox" text="员工管理">
        <h3>
        <i class="iconfont icon-yuangong"></i>
        员工管理
        </h3>
    <nav class="item">
        <a href="page/userlist.html" target="iframeBox">员工列表</a>
        <a href="page/useradd.html" target="iframeBox">新增员工</a>
    </nav>
    </div>
        `
    }
    if(power.includes("departhandle")){
        str += `
        <div class = "itemBox" text="部门管理">
        <h3>
        <i class="iconfont icon-yuangong"></i>
        员工管理
        </h3>
    <nav class="item">
        <a href="page/departmentlist.html" target="iframeBox">部门列表</a>
        <a href="page/departmenadd.html" target="iframeBox">新增部门</a>
    </nav>
    </div>
        `
    }
    if(power.includes("jobhandle")){
        str += `
        <div class = "itemBox" text="职位管理">
        <h3>
        <i class="iconfont icon-yuangong"></i>
        职位管理
        </h3>
    <nav class="item">
        <a href="page/departmentlist.html" target="iframeBox">职位列表</a>
        <a href="page/departmenadd.html" target="iframeBox">新增职位</a>
    </nav>
    </div>
        `
    }
    if(power.includes("customerall")){
        str += `
        <div class = "itemBox" text="客户管理">
        <h3>
        <i class="iconfont icon-yuangong"></i>
        客户管理
        </h3>
    <nav class="item">
        <a href="page/customerlist.html" target="iframeBox">我的客户</a>
        <a href="page/customerlist.html" target="iframeBox">全部客户</a>
        <a href="page/customeradd.html" target="iframeBox">新增客户</a>
    </nav>
    </div>
        `
    }
    $(".menuBox").html(str);
    //一般是用jquery变量前边加$，用来区别js变量。
   $itemBoxList = $(".menuBox").find(".itemBox");
    //当点击客户管理或者组织管理掉这个函数
    })
    //控制组织结构和客户管理点击切换
    function handGroup(index){
        let $group1 = $itemBoxList.filter((_,item)=>{
           let text = $(item).attr("text");
           return text === "客户管理"
        });
        let $group2 = $itemBoxList.filter((_,item)=>{
           let text = $(item).attr("text");
           return /^(员工管理|部门管理|职位管理)/.test(text)
        });
     //[div.itemBox, div.itemBox,]
         if(index === 0){
        $group1.css("display","block");
        $group2.css("display","none");
   
        }
        else if(index === 1){
        $group1.css("display","none");
        $group2.css("display","block");
        } 
       }
$plan.add(power=>{
//控制默认显示什么
   let initIndex = power.includes("customer") ? 0 : 1;
   $navBoxList.eq(initIndex).addClass("active").siblings().removeClass("active");
   handGroup(initIndex)
    //点击按钮切换
    $navBoxList.click(function(){
        let index = $(this).index();
        let text = $(this).html().trim();
        console.log(text)
        //当点击按钮来首先处理权限问题
       if((text === "客户管理" && !/customerall/.test(power)) || (text === "组织结构" && !/(userhandle|departhandle|jobhandle)/.test(power)))
       {
           alert("没有权限访问");
           return;
       }
       //要是默认显示的就是，不用点击
       if(index === initIndex) return;
        //active点击瞬间元素的样式
        //$(this).addClass("active")
        $(this).addClass("active").siblings().removeClass("active");
            handGroup(index);
            initIndex = index;
        })
   
})
//控制默认的iframe的src
$plan.add(power=>{
    let url = "page/customerlist.html"
    if(power.includes("customerall")){
        $(".iframeBox").attr("src",url)
        console.log(".......")
        console.log(power)
    }
   
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
        //power代表用户权限
        //baseInfo代表用户权限
        let [power,baseInfo] = await axios.all([
            //用户权限
            axios.get("/user/power"),
            //用户信息
            axios.get("/user/info")
        ])
        
        power.code === 0 ? power = power.power : null;
        baseInfo.code === 0? baseInfo = baseInfo.data : null;
        //把这两个参数传给$plan  发布
        $plan.fire(power,baseInfo)
    }
})