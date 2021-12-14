//返回
$('.back').on('click',function() {
	window.location.replace('/login/login.html');
})
//  });
 var $registerForm = $("form.register-form").Validform({
 	 tiptype:3
 });
 $("span.checkbox").on("click",function () {
 	$(this).toggleClass("checked")
 });
 $("button.next1").on("click",function () {
	 let name = $("input.name").val().trim();
	 	let pwd = $("input.pwd").val().trim();
	 	let phone = $("input.phone").val().trim();
		let phone1 = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;;
	 	
	 console.log(1);
 	if (!($("span.checkbox").hasClass("checked"))){
		layer.msg("请同意条款再注册",{icon:2});
		return;
	}
	if(name === ""){
				layer.msg("用户名不能为空",{time:1000});
				return;
			}
			else if(phone === ""){
			layer.msg("电话号码不能为空",{time:1000});
			return;		
			}
			else if( !phone1.test(phone)){
			layer.msg("电话号码无效",{time:1000});
			return;
		
			}
	else{
		
		console.log(name,pwd,phone);
		// 验证用户名
		$.ajax({
			type:"get",
			url:'/user/check_name/${name}',
			success:function (res) {
				if(res.code!==200){
					layer.msg(res.msg);
					console.log(res);
					return;
				}else{
					if(res.data !==0){
						layer.msg("用户名已存在")
						return;
					}
				}
			}
		})
		// 验证手机号码
		$.ajax({
			type:"get",
			url:'/user/check_phone/${phone}',
			success:function (res) {
				if(res.code!==200){
					layer.msg(res.msg);
					console.log(res);
					return;
				}else{
					if(res.data!==0){
						layer.msg("该手机号码已注册")
						return;
					}
				}
			}
		})
		// 注册
		$.ajax({
			type:"post",
			url:"/user/register",
			data:{
				name:name,
				pwd:pwd,
				phone:phone
			},
			success:function (res) {
				if(res.code!==200){
					layer.msg(res.msg);
					console.log(res);
					return;
				}
				else{
					layer.msg("注册成功")
					setTimeout(function () {
						window.location.href ="/login/login.html"
					},1000)
					return;
				}
			}
			
		})
		
	}

 })
 