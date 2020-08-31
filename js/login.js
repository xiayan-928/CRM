$(function(){
    $(".submit").click(async function(e) {
        let account = $(".userName").val().trim();
        let password = $(".userPass").val().trim();

        if(account === "" || password === ""){
            alert("账号密码不能为空");
            return;
        }
        password = md5(password);
        console.log(account,password);
/*         axios.post("/user/login",{
            account,
            password
        }).then(res=>{
            console.log(res)
        }).catch(err=>{
            console.log(err)
        }) */
 //如果有错误会返回一个失败的promise
    let res = await axios.post("/user/login",{account,password}) 
    if(parseInt(res.code) === 0){
        alert("登录成功")
        window.location.href="index.html"
        return;
    }
    alert("用户名和密码出错了");
    })
})