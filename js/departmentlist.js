$(function(){
    showDepartmentList()
    async function showDepartmentList(){
      
    let result = await axios.get("/department/list")
     //console.log(result)
     let str = ``;
    result.data.forEach(item=>{
        let {
            id,
            name,
            desc
        } = item;
        str += `<tr>
            <td class="w10">${id}</td>
            <td class="w20">${name}</td>
            <td class="w40">${desc}</td>
            <td class="w20" departmentId="${id}">
                <a href="javascript:;">编辑</a>
                <a href="javascript:;">删除</a>
            </td>
        </tr>`;
    })
    $("tbody").html(str)
     }
//基于事件委托的使用编辑和删除
operate()
    function operate(){
        //.on()的描述中第二个可选参数：selector
        //当事件冒泡到document对象时，检测事件的target，如果与传入的选择符（这里是button）匹配，就触发事件，否则不触发。
        $("tbody").on("click","a",async e=>{
            //console.log(e) 
           let target = e.target,
               tag = target.tagName,
               text = target.innerHTML.trim();
               console.log(tag)
         if(tag === "A"){
            let departmentId = $(target).parent().attr("departmentId")
            if(text === "编辑"){
                window.location.href = `departmentadd.html?id=${departmentId}`
                return;
            }
            if(text === "删除"){
                let flag = confirm("你确定要删除吗")
                if(!flag) return;
                let result = await axios.get("/department/delete",{
                    params:{departmentId}
                }) 
                //部门删除以后还要更新员工列表里面的部门管理
                if(result.code === 0){
                    alert("删除部门信息")
                    //把这一行删除
                   $(target).parent().parent().remove();
                    return; 
                   }
                return;
            }

         }
        })

    }
})