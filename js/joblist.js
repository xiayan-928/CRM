$(function(){
    jobList()
    async function jobList(){
    let result = await axios.get("/job/list")
     let str = ``;
    result.data.forEach(item=>{
       // console.log(item)
        str += `<tr>
            <td class="w8">${item.id}</td>
            <td class="w10">${item.name}</td>
            <td class="w20">${item.desc}</td>
            <td class="w50">${item.power}</td>
            <td class="w10" jobId="${item.id}">
            <a href="javascript:;">编辑</a>
            <a href="javascript:;">删除</a>
        </td>
        </tr>`;
    })
    $("tbody").html(str)
     }
 //编辑和删除
    operate()
    function operate(){
        //.on()的描述中第二个可选参数：selector
        //当事件冒泡到document对象时，检测事件的target，如果与传入的选择符（这里是button）匹配，就触发事件，否则不触发。
        $("tbody").on("click","a",async e=>{
            //console.log(e) 
           let target = e.target,
               tag = target.tagName,
               text = target.innerHTML.trim();
         if(tag === "A"){
            let jobId = $(target).parent().attr("jobId")
           if(text === "编辑"){
                window.location.href = `jobadd.html?id=${jobId}`
                return;
            } 
            if(text === "删除"){
                let flag = confirm("你确定要删除吗")
                if(!flag) return;
                let result = await axios.get("/job/delete",{
                    params:{jobId}
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