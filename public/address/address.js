//获取当前用户的token
var token = Cookies.get("token");
//获取当前用户的所有地址信息
$.ajax({
	type: "get",
	headers: {Authorization: Cookies.get("token")},
	url: "/address/list" ,
	data: {
		
	},
	success: function(res) {
		if(res.code !== 200) { layer.msg(res.msg);}
		if(res.data.length === 0) {
			$('.nonew-address').addClass('hiden');
		}
		var htmlStr = "";
		res.data.forEach(function(item) {
			htmlStr += `
				<div class="new-address " data-id="${item.id}">
					<div>
						<div class="left">
							<div class="top"><h3>${item.receiveName}</h3><span class="hiden-phone">${item.receivePhone}</span></div>
							<div class="botton">
								<span class="isdefault ${item.isDefault ? 'default' : ''} ">
									<span >默认地址</span>
								</span>
								<div><p>${item.receiveRegion} ${item.receiveDetail}</p></div>
							</div>
						</div>
						<div class="right">
							<img src="images/icon_edit_gray.png" >
						</div>
					</div>
				</div>
			`;
			});
			$('.has-address').append(htmlStr);
			
	},
});
//默认地址显示

$('span.isdefault default').children().text('默认地址');


//事件委托
$('.container')
// 开始新增
	.on('click','span.add-address',function() {
		var id = parseInt($('input.id').val(0));
		console.log(id);
		
		$('.edit-dialog').fadeIn(200);
	})
//开始修改
	.on('click','.new-address ',function() {
		$('.edit-dialog').fadeIn(200);
		var id = parseInt($(this).attr('data-id'));
		$('input.id').val(id);
	})
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
						var htmlStr = "";
							htmlStr += `
								<div class="new-address " data-id="${res.data}">
									<div>
										<div class="left">
											<div class="top"><h3>${address.receiveName}</h3><span class="hiden-phone">${address.receivePhone}</span></div>
											<div class="botton">
												<span class="isdefault ${address.isDefault ? 'default' : ''} ">
													<span >默认地址</span>
												</span>
												<div><p>${address.receiveRegion} ${address.receiveDetail}</p></div>
											</div>
										</div>
										<div class="right">
											<img src="images/icon_edit_gray.png" >
										</div>
									</div>
								</div>
							`;
							
							$('.has-address').append(htmlStr);
							$('form')[0].reset();
						return; 
					}
				},
			});
		}else {			//修改
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
						var htmlStr = "";
						
							htmlStr += `
								<div class="new-address " data-id="${res.id}">
									<div>
										<div class="left">
											<div class="top"><h3>${address.receiveName}</h3><span class="hiden-phone">${address.receivePhone}</span></div>
											<div class="botton">
												<span class="isdefault ${address.isDefault ? 'default' : ''} ">
													<span >默认地址</span>
												</span>
												<div><p>${address.receiveRegion} ${address.receiveDetail}</p></div>
											</div>
										</div>
										<div class="right">
											<img src="images/icon_edit_gray.png" >
										</div>
									</div>
								</div>
							`;
							
							$(`.has-address>div[ data-id="${id}"]`).replaceWith(htmlStr);
							
						return; 
					}
				},
			});
		}
	
		
		
		
		$('.edit-dialog').fadeOut(200);
	})
//删除
	
	.on('click','.btn-remove',function() {
		// var id = parseInt($(this).attr('data-id'));
		// $('input.id').val(id);
		var id = parseInt($('input.id').val());
		$.ajax({
			type: "get",
			headers: {Authorization: Cookies.get("token")},
			url: "/address/remove/" + id ,
			data: { },
			success: function(res) {
				if(res.code !== 200) {layer.msg(res.msg); return;}
				else { 
					$(`.new-address[data-id = ${id}]`).remove();
					
					layer.msg('删除成功'); return;
				}
			},
		});
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
					console.log(id);
					
					$(`.new-address`).find('.isdefault').removeClass('default');
					$(`.new-address[data-id=${id}]`).find('.isdefault').addClass('default');
					// console.log($(`.new-address[data-id=id]`).find('.isdefault'));
					layer.msg('设置默认地址成功'); return;
				}
			},
		});
	});
//蒙板返回
$('.dialog-uppage').on('click',function () {
	$('.edit-dialog').fadeOut(200);
});
$('.uppage').on('click',function () {
	window.location.replace('/profile/profile.html');
});
//没有数据
$.ajax({
	type: "get",
	headers: {Authorization: Cookies.get("token")},
	url: "/address/list" ,
	data: { },
	success: function(res) {
		console.log(res.data.length);
		if(res.data.length === 0) {
			$('.nonew-address').removeClass('hiden');
		}else {
			$('.nonew-address').addClass('hiden');
		}
		
	},
});
//123****4567
// .slice().replaceWith('*');
setTimeout(function() {
	var spans = $('.hiden-phone').text();
	console.log(spans);	
	$('.hiden-phone').each(function() {
		var phoneNumber = $(this).text();
		var tel = phoneNumber.substr(0,3) + '****' + phoneNumber.substr(7);
		$(this).text(tel);
	});
},200)


