if(!Cookies.get("userName")) {window.location.replace('/login/login.html');}
// 刚进来时候
//123****4567
// .slice().replaceWith('*');
setTimeout(function() {
	var phones = $('.ph').text();
	console.log(phones);	
	$('.ph').each(function() {
		var phoneNumber = $(this).text();
		var tel = phoneNumber.substr(0,3) + '****' + phoneNumber.substr(7);
		$(this).text(tel);
	});
},200);
// 

(function() {
	var ids = $.query.get('ids');
	console.log(typeof(ids));
	console.log(ids);
	var reg = /\,/;
	if(reg.test(ids)) {
		var idss = ids.split(',');
	}else {
		var idss = ids;
		var idss = [idss];
		console.log(idss);
	}
	console.log(idss);
	
	
	// 根据当前登录的用户获取其默认地址
	
	$.ajax({
		type: "get",
		headers: { Authorization: Cookies.get('token') },
		url: "/address/get_default",
		data: {},
		success: function(res) {
			if(res.code !== 200) {layer.msg(res.msg); return;}
			var htmlStr = '';
				htmlStr = `
					<div class="address-info-left" data-id=${res.data.id}>
						<div class="name-phone">
							<h4 class="xm">${res.data.receiveName}</h4>
							<span class="ph">${res.data.receivePhone}</span>
						</div>
						<div class="regions-phone">
							<p class="address-ph">${res.data.receiveRegion}${res.data.receiveDetail}</p>
						</div>
					</div>
					<div class="address-info-right">
						&gt;
						<!-- <img src="../detail/images/coupon_list_arrow.png" > -->
					</div>
				`;
			$('.address-info').html(htmlStr);
			
			console.log(res.data.id);
			
		},
	});	
	
	// 根据当前登录的用户获取其所有相关收货地址信息
	//点击address-info时弹出地址选择蒙版 address-dialog 所以hiden去掉
	$('.address-info').on('click',function() {
		$('.address-dialog').toggleClass('hiden');
		//123****4567
		// .slice().replaceWith('*');
		setTimeout(function() {
			var phones = $('.dialog-info-phone').text();
			console.log(phones);	
			$('.dialog-info-phone').each(function() {
				var phoneNumber = $(this).text();
				var tel = phoneNumber.substr(0,3) + '****' + phoneNumber.substr(7);
				$(this).text(tel);
			});
		},200);
		// 根据当前登录的用户获取其所有相关收货地址信息
		$.ajax({
			type: "get",
			headers: {Authorization: Cookies.get("token")},
			url: "/address/list" ,
			data: { },
			success: function(res) {
				if(res.code !== 200) {layer.msg(res.msg); return;}
				var htmlAddress = "";
				res.data.forEach(function(item) {
					htmlAddress += `
						<div  class="dialog-address-info" data-id=${item.id}>
							<div class="dialog-address-checkbox"></div>
							<div class="dialog-info">
								<div class="dialog-info-namephone">
									<div class="dialog-info-name">
										<span class="dialog-info-name-name">${item.receiveName}</span>
										<span class="dialog-info-name-moren ${item.isDefault ? 'default' : ''} ">
											<span >默认地址</span>
										</span>
									</div>
									<div class="dialog-info-phone">${item.receivePhone}</div>
								</div>
								<div class="dialog-info-address">${item.receiveRegion} ${item.receiveDetail}</div>
							</div>
							<div class="dialog-update"><img src="images/edit.png"></div>
						</div>
					`;
				});
				$('.dialog-address-wrapper').html(htmlAddress);
			},
		});
		
	});
	// 点击x取消地址选择蒙版
	$('.btn-cancel').on('click',function() {
		$('.address-dialog').toggleClass('hiden');
	});	
	// 地址的事件委托
	$('.container')
	// 开始新增
		.on('click','.dialog-content-footer-wrapper',function() {
			var id = parseInt($('input.id').val('0'));
			console.log(id);
			$('.btn-remove').addClass('hiden');
			$('.edit-dialog').toggleClass('active').fadeIn(200);
			
		})
	//开始修改
		.on('click','.dialog-update ',function() {
			var id = parseInt($(this).closest('.dialog-address-info').attr('data-id'));
			$('input.id').val(id);
			$('.btn-remove').removeClass('hiden');
			$('.edit-dialog').toggleClass('active').fadeIn(200);
		})
	//点保存时候根据取到的input的id判断是新增还是修改
		//保存
		.on('click',"span.btn-save",function() {
			var id = parseInt($('input.id').val());
			var address = {
				receiveName: $('input.receive-name').val(),
				receivePhone: $('input.receive-phone').val(),
				receiveRegion: $('input.receive-region').val(),
				receiveDetail: $('input.receive-detail').val()
			};
			//判断手机号位数
			var phoneLength = $('input.receive-phone').val().length;
			if(phoneLength !== 11) {
				layer.msg("手机位数为11位");
				return;
			}
			if( id === 0) {		//为0为新增
				$.ajax({
					type: "post",
					headers: {Authorization: Cookies.get("token")},
					url: "/address/add" ,
					data: {
						receiveName: $('input.receive-name').val(),
						receivePhone: $('input.receive-phone').val(),
						receiveRegion: $('input.receive-region').val(),
						receiveDetail: $('input.receive-detail').val()
					},
					success: function(res) {
						if(res.code !== 200) {layer.msg(res.msg); return;}
						else { 
							var htmlAddress = "";
							htmlAddress += `
								<div  class="dialog-address-info" data-id=${res.data}>
									<div class="dialog-address-checkbox"></div>
									<div class="dialog-info">
										<div class="dialog-info-namephone">
											<div class="dialog-info-name">
												<span class="dialog-info-name-name">${address.receiveName}</span>
												<span class="dialog-info-name-moren ${address.isDefault ? 'default' : ''} ">
													<span >默认地址</span>
												</span>
											</div>
											<div class="dialog-info-phone">${address.receivePhone}</div>
										</div>
										<div class="dialog-info-address">${address.receiveRegion} ${address.receiveDetail}</div>
									</div>
									<div class="dialog-update"><img src="images/edit.png"></div>
								</div>
							`;
							$('.dialog-address-wrapper').append(htmlAddress);
							return; 
						}
					},
						
				});
			}else {
				$.ajax({
					type: "post",
					headers: {Authorization: Cookies.get("token")},
					url: "/address/update" ,
					data: {
						id: id,
						receiveName: $('input.receive-name').val(),
						receivePhone: $('input.receive-phone').val(),
						receiveRegion: $('input.receive-region').val(),
						receiveDetail: $('input.receive-detail').val()
					},
					success: function(res) {
						if(res.code !== 200) {layer.msg(res.msg); return;}
						else {
							var htmlAddress = "";
							htmlAddress += `
								<div  class="dialog-address-info" data-id=${res.id}>
									<div class="dialog-address-checkbox"></div>
									<div class="dialog-info">
										<div class="dialog-info-namephone">
											<div class="dialog-info-name">
												<span class="dialog-info-name-name">${address.receiveName}</span>
												<span class="dialog-info-name-moren ${address.isDefault ? 'default' : ''} ">
													<span >默认地址</span>
												</span>
											</div>
											<div class="dialog-info-phone">${address.receivePhone}</div>
										</div>
										<div class="dialog-info-address">${address.receiveRegion} ${address.receiveDetail}</div>
									</div>
									<div class="dialog-update"><img src="images/edit.png"></div>
								</div>
							`;
							$(`.dialog-address-wrapper>div[ data-id="${id}"]`).replaceWith(htmlStr);
							return; 
						}
					},
				});
			}
			
			
			$('.edit-dialog').toggleClass('active').fadeOut(200);
			$('.address-dialog').toggleClass('hiden').fadeOut(200);
		})
		//删除
		.on('click','.btn-remove',function() {
			var id = parseInt($('input.id').val());
			$.ajax({
				type: "get",
				headers: {Authorization: Cookies.get("token")},
				url: "/address/remove/" + id ,
				data: { },
				success: function(res) {
					if(res.code !== 200) {layer.msg(res.msg); return;}
					else { 
						console.log($(`.new-address[data-id = ${id}]`));
						$(`.new-address[data-id = ${id}]`).remove();
						
						layer.msg('删除成功'); return;
					}
				},
			});
			$('.edit-dialog').toggleClass('active').fadeOut(200);
			$('.address-dialog').toggleClass('hiden').fadeOut(200);
		})
		//默认地址
		.on('click','.btn-setaddress',function() {
			var id = parseInt($('input.id').val());
			$.ajax({
				type: "get",
				headers: {Authorization: Cookies.get("token")},
				url: "/address/set_default/" + id ,
				data: { },
				success: function(res) {
					if(res.code !== 200) {layer.msg(res.msg); return;}
					else { 
						layer.msg('设置默认地址成功');
						
						return;
					}
				},
			});
			$('.edit-dialog').toggleClass('active').fadeOut(200);
			$('.address-dialog').toggleClass('hiden').fadeOut(200);
		})
		// 选中的渲染
		.on('click','.dialog-address-checkbox',function() {
			$(this).toggleClass('active');
			var dataname = $(this).closest('.dialog-address-info').find('.dialog-info-name-name').text();
			console.log(dataname);
			var dataphone = $(this).closest('.dialog-address-info').find('.dialog-info-phone').text();
			var dataaddress = $(this).closest('.dialog-address-info').find('.dialog-info-address').text();
			
			console.log()
			var id = $(this).closest('.dialog-address-info').attr('data-id');
			// var id = $(`fid[data-id = ${id}]`)
			var htmlStr = '';
				htmlStr = `
					<div class="address-info-left" data-id=${id}>
						<div class="name-phone">
							<h4 class="xm">${dataname}</h4>
							<span class="ph">${dataphone}</span>
						</div>
						<div class="regions-phone">
							<p class="address-ph">${dataaddress}</p>
						</div>
					</div>
					<div class="address-info-right">
						&gt;
						<!-- <img src="../detail/images/coupon_list_arrow.png" > -->
					</div>
				`;
			$('.address-info').html(htmlStr);
			$('.edit-dialog').toggleClass('active').fadeOut(200);
			$('.address-dialog').toggleClass('hiden').fadeOut(200);
		});
	
	

	
	
//蒙板返回
$('.dialog-uppage').on('click',function () {
	$('.edit-dialog').fadeOut(200);
});	
// 返回上一页
$('.uppage').on('click',function () {
	window.location.replace('/cart/cart.html');
});

// 提交订单按钮 
// "ids": 购物记录id购成的整型数组(不要传空数组),"account": 要生成订单的总金额,"addressId": 要生成订单的送货地址的id
// 根据给定的一个或多个购物记录id获取相应的详细购物信息(订单确认页用)
	$.ajax({
		type: "post",
		headers: { Authorization: Cookies.get('token') },
		url: "/cart/list_ids",
		data: {
			ids :  idss,
		},
		success: function(res) {
			if(res.code !== 200) {layer.msg(res.msg); return;}
			var htmlStr = "";
			res.data.forEach(function(item) {
				htmlStr += `
					<div class="shop-info-content" data-id=${item.id}>
						<div class="shop-info-content-img"><img
								src="${item.avatar}"></div>
						<div class="shop-info-content-left">
							<div><span class="tejia">特价</span>
								<p class="shop-name">${item.name}</p>
							</div>
							<div class="shop-info-content-left-between"><span
									class="shop-price">￥${item.price}</span><span class="shop-count"
									style="color: rgb(0,0,0);">x${item.count}</span></div>
							<div><span class="seven" style="color: #b1b1b1;">${item.brief}</span></div>
						</div>
					</div>
				`;
			});
			$('.shop-info-content-wrapper').html(htmlStr);
			//总价
			var allTotal = 0;
			res.data.forEach(function(item) {
				allTotal += item.count * item.price;
			});
			$('span.price-total').text(`￥` + allTotal + `.00`);
			console.log(allTotal);
			var ids = idss;
			var account = allTotal;
			var addressId = $('.address-info-left').attr('data-id');
			console.log(ids);
			console.log(account);
			console.log(addressId);
			//订单确认(生成订单)
			//请求头的Authorization节点必须携带有效token 请求头的Content-Type必须设置为application/json 
			//请求体必须按如下键名要求向服务器传递必要数据：
			//{ ids: 购物记录id购成的数组(不要传空数组)， account: 订单的总金额, addressId: 订单送货地址的id }
			// 返回值： 成功返回携带新生成订单的编号（订单编号是一个字符串）
			$('.btn-submit').on('click',function() {
				$.ajax({
					type: "post",
					headers: { Authorization: Cookies.get('token') },
					url: "/order/confirm",
					data: {
						ids :  idss,
						account: allTotal,
						addressId: addressId,
					},
					success: function(res) {
						window.location.href =  `/order/order.html`;
					},
				});
			});
			
			
			
			
			
		},
	});

})();

