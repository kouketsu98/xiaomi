var $formLogin = $('form.login').Validform({
	tiptype:3,
});
var $formPhone = $('form.login-phone').Validform({
	tiptype:3,
});
// 登录绑定点击事件
$('button.btn-login').on('click',function() {
	// 表单验证
	if(!$formLogin.check(false)) return;
	// 发送ajax，进行登录请求
	$.ajax({
		type: "post",
		url: "/user/login_pwd",
		data: {
			name: $('input.name').val().trim() ,
			pwd: $('input.pwd').val().trim()
		},
		success: function(res) {
			if(res.code !==200) {
				console.log(res.msg);
				layer.msg(res.msg);
				// layer.msg('登录成功');
				return;
			}else {
				console.log(res.data)
				layer.msg('登录成功');
				Cookies.set('token',res.data);
				Cookies.set('userName',$('input.name').val().trim());
				var referrer =  (document.referrer === window.location.href  || "/home/index.html") ? "/home/index.html" : document.referrer;
				window.location.replace(referrer);
			}
		}
	});
});
// sjh
$('button.btn-phone').on('click',function() {
	// 表单验证
	if(!$formPhone.check(false)) return;
	// 发送ajax，进行登录请求
	
	$.ajax({
		type: "post",
		url: "/user/login_phone",
		data: {
			phone: $('input.phone').val().trim(),
			
		},
		success: function(res) {
			if(res.code !==200) {
				console.log(res.msg);
				layer.msg(res.msg);
				return;
			}else {
				console.log(res.data)
				layer.msg('此功能暂未开放');
			}
		}
	});
});
// 
$('input').on('focus',function() {
	console.log($(this).val())
	if($(this).val()) {
		$(this).parent().addClass('true');
		$(this).parent().removeClass('error');
		$(this).next().css('display',"block");
	}else{
		$(this).parent().addClass('error');
		$(this).parent().removeClass('true');
	}
	
	
});
$('.quxiao').on('click', function() {
		$(this).parent().removeClass('true');
		$(this).prev().val(null);
		$(this).parent().addClass('error');
	});
// 
$('.xianshi').on('click',function() {
	console.log($(this).prev());
	$(this).prev().toggleClass('active');
	if($(this).prev().hasClass('active')) {
		document.querySelector('input.pwd').type = "text";
	}else {
		document.querySelector('input.pwd').type = "password";
	}
});
// 
$('.gopage2').on('click',function() {
	$('div.content').addClass('show');
	console.log(1);
	$('div.content-phone').removeClass('show');
});
$('.gopage1').on('click',function() {
	$('.content-phone').addClass('show');
	$('.content').removeClass('show')
});
// 暂未开发
$('.nodev').on('click',function() {
	layer.msg('此功能暂未开放');
})
$('.btn-phone').on('click',function() {
	layer.msg('此功能暂未开放,请使用用户名登录方式');
})