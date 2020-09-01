$(function(){
let checkList = null;
    initDepartment();
//显示部门
    async function initDepartment(){
 let result = await queryDepart();
 if(result.code == 0){
    let str = `<option value="0">全部员工</option>`;
    result.data.forEach(item=>{
        str += `<option value="${item.id}">${item.name}</option>`;
    })
    $(".selectBox").html(str);
}
    }
//显示员工列表
showUserlist();
async function showUserlist(){
  //刚开始有默认值不用传值
     let params = {
        departmentId:$(".selectBox").val(),
        search:$(".searchInp").val().trim()
    } 
    console.log(params);
   //刚开始默认0 ''
    let result = await axios.get("/user/list",{params})
    let str = ``;
    result.data.forEach(item=>{
        let {
            id,
            name,
            sex,
            email,
            phone,
            department,
            job,
            desc
        } = item;
        str += `<tr>
            <td class="w3"><input type="checkbox" userId="${id}"></td>
            <td class="w10">${name}</td>
            <td class="w5">${sex==0?'男':'女'}</td>
            <td class="w10">${department}</td>
            <td class="w10">${job}</td>
            <td class="w15">${email}</td>
            <td class="w15">${phone}</td>
            <td class="w20">${desc}</td>
            <td class="w12" userId="${id}">
                <a href="javascript:;">编辑</a>
                <a href="javascript:;">删除</a>
                <a href="javascript:;">重置密码</a>
            </td>
        </tr>`;
    })
    $("tbody").html(str)
    checkList = $("tbody").find('input[type="checkbox"]')
    //console.log(checkList) 四个input
}
//筛选员工列表
searchHandle()
function searchHandle() {
    $(".selectBox").change(showUserlist);
     $(".searchInp").on("keydown",e=>{
         if(e.keyCode === 13){
             showUserlist();
         }
     })
}
//基于事件委托的使用编辑和删除和修改密码
  delegate();
   function delegate(){
    $("tbody").on("click","a",async e=>{
         //console.log(e) 
        let target = e.target,
            tag = target.tagName,
            text = target.innerHTML.trim();
            //console.log(target,tag,text)
        if(tag === "A"){
        //e.target是一个“原生”DOM节点类型，通常是HTMLElement；
          //$(e.target)是一个jQuery类型的实例。
          //jQ封装的是事件对象，不是事件对象里的那些属性！
            //target代表我当前点的a
            let userid = $(target).parent().attr("userid")
            if(text === "编辑"){
                window.location.href = `useradd.html?id=${userid}`
                return;
            }
            if(text === "删除"){
                let flag = confirm("你确定要删除吗")
                if(!flag) return;
                let result = await axios.get("/user/delete",{
                    params:{userId:userid}
                }) 
               if(result.code === 0){
                alert("删除用户信息")
                //把这一行删除
               $(target).parent().parent().remove();
               //删除完重新给input赋值
               checkList = $("tbody").find('input[type="checkbox"]');
               console.log(checkList)
                return; 
               }
               return;
               
            }
            if(text === "重置密码"){
                let flag = confirm("你确定要重置此用户的密码吗")
                if (!flag) return;
                let result = await axios.post("/user/resetpassword",{
                   userId:userid 
                })
                if(result.code === 0){
                    alert("重置密码成功，告诉你的员工")
                    return;
                }
                return; 
            }
        }
    })

}
//实现选择框操作
selectHandle();
function selectHandle(){
    $("#checkAll").click(e=>{
        let checked = $("#checkAll").prop("checked")
        //console.log(checked)
        checkList.prop("checked",checked)
    });
$("tbody").on("click","input",e=>{
    if(e.target.tagName === "INPUT"){
        let flag = true;
        //为数组转成数组
        //1、拥有length属性，其它属性（索引）为非负整数(对象中的索引会被当做字符串来处理，这里你可以当做是个非负整数串来理解)
       // 2、不具有数组所具有的方法
        newCheckList = Array.from(checkList);
        //console.log(newCheckList)
         newCheckList.forEach(item=>{
            // console.log($(item))
             //转成js对象上面封装了很多方法，不加的就是普通的DoM对象
             if(!$(item).prop("checked")){
                 flag = false
             }
         })
         $("#checkAll").prop("checked",flag)
    }
})

}
//实现批量删除
$(".deleteAll").click(e=>{
    let arr = [];
    [].forEach.call(checkList,item=>{
        if($(item).prop("checked")){
            arr.push($(item).attr('userid'))
        }
    })
    console.log(arr);
    if(arr.length === 0){
        alert("你需要选择一些用户删除")
        return;
    }
    let flag = confirm("你确定要删除这些用户吗");
    if(!flag) return;
//确定删除执行下面的代码
let index = -1;
async function deleteUser(){
    let userid = arr[++index];
    if(index>=arr.length){//递归的出口
        alert("已成功删除员工")
        //删除完调用显示列表接口
        showUserlist();
        return;
    }
    let result = await axios.get("/user/delete",{
        params:{
         userId:userid
        }
    })
    if(result.code !=0){
        return;
    }
    deleteUser();
}
deleteUser();
})







})