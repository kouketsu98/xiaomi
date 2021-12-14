$('.content').on('click',function() {
	console.log('判断登录的地方激活了');
	// 获取登录的cookie
	console.log(Cookies.get("token"));
	// 没有登录时候
	if(Cookies.get("token") === '') {
		
		//去登录	
		layer.confirm("",
		{
			title:['声明与政策','font-size:20px;text-align: center;padding:0'],
			content: `
				<p style="color:#777;">欢迎您来到小米有品！</p>
				<p style="color:#777;">我们依据最新法律法规要求，制定并更新了<span style="color:rgb(159, 128, 82);">《隐</span></p>
				<p style="color:rgb(159, 128, 82);">私政策》、《小米有品用户协议》<span style="color:#777;">以及</span>《小米帐号使用协议》。</p>
				<p style="color:#777;">您需阅读并同意相关政策条款方可进行登录。</p>
			`,
			btn: ['不同意','同意'] ,//按钮
			closeBtn:false
			
		}, function(){
		  layer.msg('已取消', {icon: 2});
		}, function(){
		  layer.msg('正在去登录', {time: 10000}),
		  window.location.replace('/login/login.html');
		});
		// 
		
	};
});
if(Cookies.get("token") !== '') {
	$('.btn-out').toggleClass('hiden');
	// $('.user-avatar').text()
	$('.user-name').text(Cookies.get("userName"));
};

$('.myaddress').on('click',function() {
	if(Cookies.get("token") !== '') {
		window.location.replace('/address/address.html');	
	}
});
$('.goto-myorder').on('click',function() {
	if(Cookies.get("token") !== '') {
		window.location.replace('/order/order.html');	
	}
})
$('.btn-out>span').on('click',function() {
	console.log('退出按钮被激活');
	Cookies.set('token','') ;
	$('.user-name').text('请登录');
	$('.btn-out').addClass('hiden');
	// Cookies.set("userName",) ;
})