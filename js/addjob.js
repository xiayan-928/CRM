$(function(){
    let jobId = null;
    //console.dir(window.location.href)
    let params = window.location.href.queryURLParams();//获取id
    //console.log(params)
    if(params.hasOwnProperty("id")){
        jobId = params.id;
     //根据id实现数据回显
        getBaseInfo();
    }
    //数据回显
   async function  getBaseInfo(){
        let result = await axios.get("/job/info",{
            //params是一个参数传递的方式
            params:{jobId}
        })
        if(result.code === 0){
            result = result.data;
            $(".jobName").val(result.name);
            $(".jobDesc").val(result.desc);
         //实现复选框回显
        let hasPower = result.power;
        //通过正则来管理复选框
        let userhandle =  /userhandle/
        let flag1 = userhandle.test(hasPower)
        $("#userhandle").attr("checked",flag1)
        let departhandle =  /departhandle/
        let flag2 = departhandle.test(hasPower)
        $("#departhandle").attr("checked",flag2)
        let jobhandle =  /jobhandle/
        let flag3 = jobhandle.test(hasPower)
        $("#jobhandle").attr("checked",flag3)
        let customerall =  /customerall/
        let flag4 = customerall.test(hasPower)
        $("#customerall").attr("checked",flag4)
        let customermy =  /customeramy/
        let flag5 = customermy.test(hasPower)
        $("#customermy").attr("checked",flag5)
        //管理复选框结束
        return;
        }
        alert("编辑不成功，可能网络不给力....");
        jobId = null;
    }
    
    //首先进行验证
    async function checkJob(){
        let  jobName= $(".jobName").val().trim();
        let jobData = await  queryJob();
        let data = jobData.data
        let name =  data.map(function(item,index){
                return item.name
            })
         let flag =  name.some(function(item,index){
                if(jobName === item){
                    return true;
                }
                else{
                    return false;
                }
            })
      if(jobName.length === 0){
                $(".jobCheck").html("此为必填项")
                return;
            }
     if(flag){
            $(".jobCheck").html("这个职位已经存在")
            return;
        }
        $(".jobCheck").html("职位可以")
        return true;
    }
    addJob()
    //验证完以后进行增加部门还有编辑职务
    function addJob(){
        $(".jobName").blur(checkJob);
        $(".submit").click(async function(e){
            if( !checkJob()){
                alert("你填写的数据不合法");
                return;
              }
       //首先获取数据
         let name= $(".jobName").val().trim();
        let desc= $(".jobDesc").val();
       let power = ""
       $("[name='job']:checked").each(function(index, element) {
                  power += $(this).val()+"|";
              });	
              //从索引0开始，到索引最后一个结束，不包括最后索引项
      power = power.slice(0,-1);//去掉最后一条线
            //如果存在jobId就进行修改  
        if(jobId){
                jobId = params.id;
                let result = await axios.post("/job/update",{
                    jobId,name,desc,power
                })
                if(result.code === 0){
                    alert("修改成功");

                    window.location.href = "joblist.html"
                    return
                }
                alert("网络不给力，稍后在试")
            }
        let result = await axios.post("/job/add",{
                name,desc,power
            })
            if(result.code === 0){
                alert("添加成功");
                window.location.href = "joblist.html"
                return
            }
        })

    }
})