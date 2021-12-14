//
$('.back').on('click',function() {
	window.location.href= '/cart/cart.html';
});
//
function bigOrder(item) {
	// var orderWrapper = '';
		// orderWrapper += `
		
		return `
			<div class="order-header">
				<img src="images/logo.png" alt="">
				<h6>小米自营</h6>
				<span>待付款</span>
			</div>
			<div class="order-content">
			${smallOrder(item)}
			</div>
			<div class="total-price-wrapper">
				<span>
					共<span class="thisTotal">${maxCount(item)}</span>件商品，总金额￥<span class="total-price">${item.account}</span>.00
				</span>
			</div>
			<div class="pay-time">
				<div class="deadline hiden">
					<span></span>后订单将关闭
				</div>
				<div class="overdur ">
					<span>删除订单</span>
				</div>
				<button class="go-pay">去支付</button>
			</div>
		
		`;
		
}
// 

function smallOrder(item) {
	var orderCount = '';
	console.log(item.details);
	
	item.details.forEach(function(item){
		
		orderCount += `
			<div class="order" data-count = ${item.count}>
				<img src="${item.avatar}" alt="">
				<div class="order-right">
					<div class="name-remark">
						<h6 class="product-name">${item.name}</h6>
						<span class="remark">${item.name}</span>
					</div>
					<div class="price-count" data-id = ${item.count}>
						<span class="price">￥${item.price}.00</span>
						<span class="count">x ${item.count}</span>
					</div>
				</div>
			</div>
		`;
		
	});
	return orderCount;	
}
// 每个大块的数量
function maxCount(item) {
	var count = 0;
	item.details.forEach(function(item) {
		count += item.count;
	});
	return count;
}

//

//nav切换
orderAll();
$('.menu')
	.on('click','.whole',function() {
		$(this).addClass('active').siblings().removeClass('active');
		$('.order-wrapper').empty();
		$('.no-order').removeClass('hiden');
		$('.no-order-tips').text('目前没有订单哦~');
		orderAll();
		// shippedOrder();
		
	})
	.on('click','.obligation',function() {
		$(this).addClass('active').siblings().removeClass('active');
		$('.order-wrapper').empty();
		$('.no-order').removeClass('hiden');
		$('.no-order-tips').text('目前没有待付款订单哦~');
		obligationOrder();
		//点去支付
		setTimeout(function(){
			$('.go-pay').on('click',function() {
				console.log(1);
			var orderId = $(this).closest('.order-wrapper-content').attr('data-id');
			console.log(orderId);
			window.location.href = `/pay/index.html?orderId=${orderId}`;
		});
		},200)
	})
	.on('click','.shipped',function() {
		$(this).addClass('active').siblings().removeClass('active');
		$('.order-wrapper').empty();
		$('.no-order').removeClass('hiden');
		$('.no-order-tips').text('目前没有待收货订单哦~');
		shippedOrder();
	})
	.on('click','.refund-order',function() {
		$(this).addClass('active').siblings().removeClass('active');
		$('.order-wrapper').empty();
		$('.no-order').removeClass('hiden');
		$('.no-order-tips').text('目前没有退款订单哦~');
		
	})
	.on('click','.received-order',function() {
		$(this).addClass('active').siblings().removeClass('active');
		$('.order-wrapper').empty();
		$('.no-order').removeClass('hiden');
		$('.no-order-tips').text('目前没有已收货订单哦~');
		
	});


//获取当前登录用户所有待付款订单信息
function obligationOrder() {
	$.ajax({
		type: "get",
		headers: {Authorization: Cookies.get("token")},
		url: "/order/list_unpay",
		data: {},
		success: function(res) {
			if(res.code !== 200) {layer.msg(res.msg); return;}
			else { 
				//判断是否有订单
				if(res.data.length === 0) { return;} 
				$('.no-order').addClass('hiden');		//有数据时
				console.log(res.data.length);
				var htmlStr = '';
				res.data.forEach(function(item,i) {
						// 
					htmlStr +=`
						<div class="order-wrapper-content" data-id=${item.orderId} >
							${bigOrder(item)}
						</div>
					`;  
				});
				$('.order-wrapper').html(htmlStr);
				$('.deadline').removeClass('hiden');
				$('.overdur').addClass('hiden');
				
			};
			 //
			// var countmax = $('.order').attr('data-id').parent().closest('.thisTotal');
			
			// console.log(countmax);
			//获取指定订单的总金额
			$('.order-wrapper').on('click','.order-wrapper-content',function() {
				var orderId = $(this).closest('.order-wrapper-content').attr('data-id');
				console.log(orderId);
				$.ajax({
					type: "get",
					headers: {Authorization: Cookies.get("token")},
					url: "/order/account/" + orderId,
					data: {},
					success: function(res) {
						
					},
				});
			});
			
			// djs
			setTimeout(function() {
				res.data.forEach(function(item) {
					var orderid = item.orderId;
					console.log(item.orderTime);
					// 2021-09-05 18:08:49.467
						var djs = item.orderTime;
						console.log(djs);
						var reg = /^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2}).(\d{3})/;
						
						var y = reg.exec(djs)[1];
						var m = reg.exec(djs)[2];
						var d = reg.exec(djs)[3];
						var h = reg.exec(djs)[4];
						var min = reg.exec(djs)[5];
						var s = reg.exec(djs)[6];
						var ms = reg.exec(djs)[7];
						console.log(y, m  , d, h , m, s,ms);
						var targetDate = new Date(y, m - 1, d, h, m, s,ms );
						console.log(targetDate);
						var timer = null;
						function countdown() {
							var diff = targetDate.getTime() +3600000 - new Date().getTime();
							if (diff <= 0) {
								clearInterval(timer);
								timer = null;
								return;
								console.log(orderid);
								$(`.order-wrapper-content[data-id = ${item.orderId}]`).find('.deadline').addClass('hiden');
								$(`.order-wrapper-content[data-id = ${item.orderId}]`).find('.overdur').removeClass('hiden');
								$(`.order-wrapper-content[data-id = ${item.orderId}]`).find('.go-pay').text('再次购买');
							}
							console.log(orderid);
							var hours = parseInt(diff / 1000 / 60 / 60 % 24, 10);
							var minutes = parseInt(diff / 1000 / 60 % 60, 10);
							var seconds = parseInt(diff / 1000 % 60, 10);
							$(`.order-wrapper-content[data-id = ${orderid}]`).find('.deadline>span').text(hours + `:` + minutes + `:` + seconds);
						}
						setInterval(countdown, 1000);
					
					
				});
			},0);	
			
		},
	});
}
// 获取已付款的
function shippedOrder() {
	$.ajax({
		type: "get",
		headers: {Authorization: Cookies.get("token")},
		url: "/order/list_pay"  ,
		data: { },
		success: function(res) {
			if(res.code !== 200) {layer.msg(res.msg); return;}
			else { 
				//判断是否有订单
				if(res.data.length === 0) { return;} 
				$('.no-order').addClass('hiden');		//有数据时
				console.log(res.data.length);
				var htmlStr = '';
				res.data.forEach(function(item,i) {
					htmlStr +=`
						<div class="order-wrapper-content" data-id=${item.orderId} >
							${bigOrder(item)}
						</div>
					`;  
				});
				$('.order-wrapper').html(htmlStr);
				$('.order-header>span').text('待收货');
				$('.go-pay').text('已支付');
			};
			 //
			// var countmax = $('.order').attr('data-id').parent().closest('.thisTotal');
			
			// console.log(countmax);
			//获取指定订单的总金额
			$('.order-wrapper').on('click','.order-wrapper-content',function() {
				var orderId = $(this).closest('.order-wrapper-content').attr('data-id');
				console.log(orderId);
				$.ajax({
					type: "get",
					headers: {Authorization: Cookies.get("token")},
					url: "/order/account/" + orderId,
					data: {},
					success: function(res) {
						
					},
				});
			});
		
			
			
			
			
		},
	});
};

	


//

// 获取当前登录用户所有订单信息
function orderAll() {
	$.ajax({
		type: "get",
		headers: {Authorization: Cookies.get("token")},
		url: "/order/list_all" ,
		data: { },
		success: function(res) {
			if(res.code !== 200) {layer.msg(res.msg); return;}
			else { 
				//判断是否有订单
				if(res.data.length === 0) { return;} 
				$('.no-order').addClass('hiden');		//有数据时
				console.log(res.data.length);
				var htmlStr = '';
				res.data.forEach(function(item,i) {
					htmlStr +=`
						<div class="order-wrapper-content" data-id=${item.orderId} >
							${bigOrder(item)}
						</div>
					`;  
					
				});
				$('.order-wrapper').html(htmlStr);
				res.data.forEach(function(item,i) {
					var orderid = item.orderId;
					if(item.pay === 0) {
						$(`.order-wrapper-content[data-id = ${orderid}]`).find('.overdur').addClass('hiden');
						$(`.order-wrapper-content[data-id = ${orderid}]`).find('.deadline').removeClass('hiden');
						// $(`.order-wrapper-content[data-id = ${orderid}]`).find('.order-header>span').text('已取消');
						var orderid = item.orderId;
						console.log(item.orderTime);
						// 2021-09-05 18:08:49.467
							var djs = item.orderTime;
							console.log(djs);
							var reg = /^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2}).(\d{3})/;
							
							var y = reg.exec(djs)[1];
							var m = reg.exec(djs)[2];
							var d = reg.exec(djs)[3];
							var h = reg.exec(djs)[4];
							var min = reg.exec(djs)[5];
							var s = reg.exec(djs)[6];
							var ms = reg.exec(djs)[7];
							console.log(y, m  , d, h , m, s,ms);
							var targetDate = new Date(y, m - 1, d, h, m, s,ms );
							console.log(targetDate);
							var timer = null;
							function countdown(i) {
								var diff = targetDate.getTime() +3600000 - new Date().getTime();
								if (diff <= 0) {
									clearInterval(timer);
									timer = null;
									
									console.log(item.orderId);
									$(`.order-wrapper-content[data-id = ${item.orderId}]`).find('.deadline').addClass('hiden');
									$(`.order-wrapper-content[data-id = ${item.orderId}]`).find('.overdur').removeClass('hiden');
									$(`.order-wrapper-content[data-id = ${item.orderId}]`).find('.go-pay').text('再次购买');
									return;
								}
								console.log(orderid);
								var hours = parseInt(diff / 1000 / 60 / 60 % 24, 10);
								var minutes = parseInt(diff / 1000 / 60 % 60, 10);
								var seconds = parseInt(diff / 1000 % 60, 10);
								$(`.order-wrapper-content[data-id = ${orderid}]`).find('.deadline>span').text(hours + `:` + minutes + `:` + seconds);
							}
							setInterval(countdown, 1000);
					}
					if(item.pay === 1) {
						// $(`.order-wrapper-content[data-id = ${orderid}]`).find('.overdur').addClass('hiden');
						// $(`.order-wrapper-content[data-id = ${orderid}]`).find('.deadline').removeClass('hiden');
						$(`.order-wrapper-content[data-id = ${orderid}]`).find('.order-header>span').text('已付款');
					}
					
				});
				
			};
			
			// console.log(countmax);
			//获取指定订单的总金额
			$('.order-wrapper').on('click','.order-wrapper-content',function() {
				var orderId = $(this).closest('.order-wrapper-content').attr('data-id');
				// console.log(orderId);
				$.ajax({
					type: "get",
					headers: {Authorization: Cookies.get("token")},
					url: "/order/account/" + orderId,
					data: {},
					success: function(res) {
						
					},
				});
			});
			//删除指定订单
			$('.overdur').on('click',function(){
				var moveId = $(this).closest('.order-wrapper-content').attr('data-id');
				console.log(moveId);
				var that = this;
				
						//弹出提示框判断是否删除
						// else {
							layer.confirm("", 
							{
								title:["确定删除订单"],
								content: `,
									<p>删除后，您可在小米有品官网的订单回</p>
									<p style="text-align:center;">收站找回</p>
								`,
								btn: ['取消','确定'],
								closeBtn: false
							}, function() {
								layer.msg('已取消', {icon: 2});
								return;
							}, function() {
								layer.msg('已删除');
									$.ajax({
									type: "get",
									headers: {Authorization: Cookies.get("token")},
									url: "/order/remove/" + moveId,
									data: {},
									success: function(res) {
										if(res.code !== 200) {layer.msg(res.msg); return;} 
										$(that).closest('.order-wrapper-content').remove();
									},
								
							});
						// };
						
					
				});
			})
		},
	});
};

