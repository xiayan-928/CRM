$(function(){
   
    let departmentId = null;
    //console.dir(window.location.href)
    let params = window.location.href.queryURLParams();
    //console.log(params)
    //实现数据回显
    if(params.hasOwnProperty("id")){
        departmentId = params.id;
     //根据id实现数据回显
        getBaseInfo();
    }
    async function getBaseInfo(){
        let result = await axios.get("/department/info",{
            //params是一个参数传递的方式
            params:{departmentId}
        })
        if(result.code === 0){
            result = result.data;
            $(".departmentName").val(result.name);
            $(".departmentDesc").val(result.desc);
            return;
        }
        alert("编辑不成功，可能网络不给力....");
        departmentId = null;
     }
//增加和修改之前对输入的部门进行验证
async function checkDepartment(){
    let  Newname= $(".departmentName").val().trim();
    let departmentData = await queryDepart();
    let data = departmentData.data
    let name =  data.map(function(item,index){
            return item.name
        })
     let flag =  name.some(function(item,index){
            if(Newname === item){
                return true;
            }
            else{
                return false;
            }
        })
  if(Newname.length === 0){
            $(".departmentspan").html("此为必填项")
            return;
        }
    if(flag){
        $(".departmentspan").html("这个部门已经存在")
        return;
    }
    $(".departmentspan").html("部门可以")
    return true;
}
//增加和修改
 addDepartment()
  function addDepartment(){
  $(".departmentName").blur(checkDepartment);
   $(".submit").click(async function(e){
    //需要对添加的部门进行验证，不能重复添加部门
    if( !checkDepartment()){
        alert("你填写的数据不合法");
        return;
      }  
    let name= $(".departmentName").val().trim();
    let desc= $(".departmentDesc").val();
    //如果存在departmentId就修改
    if(departmentId){
        let result = await axios.post("/department/update",{
            departmentId,name,desc 
        })
        if(result.code === 0){
            alert("修改成功");
            window.location.href = "departmentlist.html"
            return
        }
        alert("网络不给力，稍后在试")
    }
        let result = await axios.post("/department/add",{
            name,desc
        })
        if(result.code === 0){
            alert("添加成功");
            window.location.href = "departmentlist.html"
            return
        }
        alert("网络不给力，稍后在试")
   })
    
    }

})