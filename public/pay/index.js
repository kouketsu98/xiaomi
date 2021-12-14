var orderId = $.query.get('orderId');
console.log(orderId);
//
$('.back').on('click', function() {
	console.log("返回上一页被激活");
	layer.confirm("",
	{
		title:["确定离开"],
		content: `
			<p><span>订单有效时间剩余<span><span class="djs" style="color: rgb(255, 0, 0);"></span><span>，超时后您</span></p>
			<p style="text-align:center;">的订单将自动取消</p>
		`,
		btn: ['取消','确定'],
		closeBtn: false
	}, function() {
		layer.msg('已取消返回', {icon: 2});
		return;
	}, function() {
		layer.msg('正在返回');
		window.location.replace(document.referrer || '/order/order.html');	
		
	});
	
});
$('.payment-wrapper').on('click','.ischecked',function() {
	$(this).find('.checkedbox').addClass('active').siblings().removeClass('active');
})
//获取指定订单的总金额
$.ajax({
	type: "get",
	headers: {Authorization: Cookies.get("token")},
	url: "/order/account/" + orderId,
	data: {},
	success: function(res) {
		if(res.code !==200) {layer.msg(res.msg); return;}
		else {
			$('.account>span').text(res.data);
			$('.btn-pay').text(`确认支付￥`+ res.data);
		}
	},
});
//点确定支付进行订单的提交
$('.btn-pay').on('click',function() {
	console.log("确认支付按钮被激活");
	layer.confirm("",
	{
		title:["是否支付金额"],
		content: `
			<span class="" style="color: rgb(255, 0, 0);">是否立即支付</span>
			
		`,
		btn: ['取消','支付'],
		closeBtn: false
	}, function() {
		layer.msg('已取消支付', {icon: 2});
		return;
	}, function() {
		layer.msg('正在支付中');
		//为指定的订单付款
		$.ajax({
			type: "get",
			headers: {Authorization: Cookies.get("token")},
			url: "/order/pay/" + orderId,
			data: {},
			success: function(res) {
				if(res.code !==200) {layer.msg(res.msg); return;}
				window.location.replace(document.referrer || '/order/order.html');	
			},
		});
		
	});
});
// 倒计时
(function() {
	var targetDate = new Date(2021, 12, 31, 00, 00, 0);
	var timer = null;

	function countdown() {
		var diff = targetDate.getTime() - new Date().getTime();
		if (diff <= 0) {
			clearInterval(timer);
			timer = null;
			return;
		}
		var hours = parseInt(diff / 1000 / 60 / 60 % 24, 10);
		var minutes = parseInt(diff / 1000 / 60 % 60, 10);
		var seconds = parseInt(diff / 1000 % 60, 10);
		$('.deadline>span').text(hours + `:` + minutes + `:` + seconds);
		$('.djs').text(hours + `:` + minutes + `:` + seconds);
	}
	setInterval(countdown, 1000)

})();