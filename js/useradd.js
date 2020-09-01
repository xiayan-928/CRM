$(function(){
    let userid = null;
    //console.dir(window.location.href)
    let params = window.location.href.queryURLParams();
    //console.log(params)
    //hasOwnProperty() 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性（也就是，是否有指定的键）
if(params.hasOwnProperty("id")){
        userid = params.id;
     //根据id实现数据回显
        getBaseInfo();
    }
//实现数据回显
 async function getBaseInfo(){
    let result = await axios.get("/user/info",{
        //params是一个参数传递的方式
        params:{userid}
    })
    if(result.code === 0){
        result = result.data;
        $(".username").val(result.name);
        result.sex == 0 ? $("#man").prop('checked',true):$("#woman").prop('checked',true);
        $(".useremail").val(result.email);
        $(".userphone").val(result.phone);
        $(".userdepartment").val(result.departmentId);
        $(".userjob").val(result.jobId);
        $(".userdesc").val(result.desc);
        return;
    }
    alert("编辑不成功，可能网络不给力....");
    userid = null;
 }
//初始化部门和职务数据
    initDeptAndJob()
    async function initDeptAndJob() {
        let departmentData = await queryDepart();
        let jobData = await queryJob();
        console.log( departmentData);
        console.log(jobData);
        if(departmentData.code === 0){
            departmentData = departmentData.data;
            let str = ``;
            departmentData.forEach(item=>{
                str += `<option value="${item.id}">${item.name}</option>`;
            })
            $(".userdepartment").html(str)
        }
        if(jobData.code === 0){
            jobData = jobData.data;
            let str = ``;
            jobData.forEach(item=>{
                str += `<option value="${item.id}">${item.name}</option>`;
            })
            $(".userjob").html(str);
        }

    }
    //用户名进行验证
    function checkname(){
            let val = $(".username").val().trim(); 
            if(val.length === 0){
                $(".spanusername").html("此为必填项")
                return;
            }
            if(!/^[\u4e00-\u9fa5]{2,10}$/.test(val)){
                $(".spanusername").html("名字必须是2~10个汉字~")
                return false;
            }
            $(".spanusername").html("姓名可以")
            return true;
    }
    
    //邮箱进行验证
    function checkemail(){
        let val = $(".useremail").val().trim();
        if(val.length === 0){
            $(".spanuseremail").html("此为必填项~")
            return false;
        }
        // 用户名必须填写真实姓名（2~10个字）
        if(!/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(val)){
            $(".spanuseremail").html("请填写正确的邮箱~")
            return false;
        }
        $(".spanuseremail").html("邮箱可以")
        return true;
    }
    //手机号码进行验证
function checkphone() {
        let val = $(".userphone").val().trim();
        if(val.length === 0){
            $(".spanuserphone").html("此为必填项~")
            return false;
        }
        // 用户名必须填写真实姓名（2~10个字）
        if(!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(val)){
            $(".spanuserphone").html("请填写正确的手机号~")
            return false;
        }
        $(".spanuserphone").html("电话号码可以")
        return true;
    }
     // 失去焦点时，对数据进行校验
     $(".username").blur(checkname);
     $(".useremail").blur(checkemail);
     $(".userphone").blur(checkphone);
$(".submit").click(async function(){
    if( !checkname() || !checkemail() || !checkphone()){
        alert("你填写的数据不合法");
        return;
      }  
    //校验通过进行下面
    let params = {
        name:$(".username").val().trim(),
        sex:$("#man").prop("checked") ? 0:1,
        email:$(".useremail").val().trim(),
        phone:$(".userphone").val().trim(),
        departmentId:$(".userdepartment").val(),
        jobId:$(".userjob").val(),
        desc:$(".userdesc").val().trim()
    }
    //如果存在userid就进行编辑
    if(userid){
        params.userId = userid;
        let result = await axios.post("/user/update",params)
        if(result.code === 0){
            alert("修改成功")
            window.location.href = "userlist.html"
            return;
        }
        alert("网络不给力")
        return;
    }
    //不然就是添加
    let result = await axios.post("/user/add",params)
    if(result.code === 0){
        alert("添加成功");
        window.location.href = "userlist.html"
        return
    }
    alert("网络不给力，稍后在试")

})


})