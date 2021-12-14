var cid = parseInt($.query.get('cid')) || 17;
// 返回上一页
$('.uppage').on('click', function() {
	console.log("返回上一页被激活");
	window.location.replace('/list/list.html');
});

$('.islike').on('click', function() {
	$(this).toggleClass('nolike like');
	if ($(this).hasClass('like')) {
		layer.msg('已收藏');
	};
	if ($(this).hasClass('nolike')) {
		layer.msg('已取消收藏');
	};
});
// ajax请求banner轮播图
(function() {
	$.ajax({
		type: "get",
		url: "/product/model/" + cid,
		success: function(res) {
			if (res.code !== 200) {
				console.log(res.msg);
				return;
			}
			
			console.log(res.data.price);
			$('.price').text(res.data.price);
			$('.shop-name').text(res.data.name);
			$('.shop-brief').text(res.data.brief);
			// 字符串截取,返回的是截取的部分
			var arr = res.data.bannerImgs;
			console.log(res.data.bannerImgs);
			var reg = /\,/;
			if(reg.test(arr)) {
				// var idss = arr.split(',');
				var data = arr.split(",");
			}else {
				var data = arr;
				var data = [data];
				console.log(data);
			}
			
			var divStr = "";
			data.forEach(function(item) {
				console.log(item);
				divStr += `
					<div class="swiper-slide"><a href=""><img src="${item}" ></a></div>
				`;
			});
			$('.swiper-wrapper').html(divStr);
			new Swiper(".banner", {
				loop: true, //无缝
				// autoplay: true, //开启自动播放,默认3s
				autoplay: {
					delay: 2000,
					disableOnInteraction: false
				},
				freeMode: false,
				pagination: {
					el: ".banner>.swiper-pagination",
					type: "fraction" //silde样式
				},
			});
			// 商品详情部分
			
			// 字符串截取,返回的是截取的部分
			// var xq = res.data.otherImgs;
			// console.log(res.data.otherImgs);
			// var details = xq.split(",");
			// console.log(details);
			
			var xq = res.data.otherImgs;
			console.log(res.data.otherImgs);
			var reg = /\,/;
			if(reg.test(xq)) {
				// var idss = arr.split(',');
				var details = xq.split(",");
			}else {
				var details = xq;
				var details = [details];
				console.log(details);
			}
			
			var xqStr = "";
			details.forEach(function(item) {
				console.log(item);
				xqStr += `
					<div class="detail-image"><a href=""><img src="${item}" ></a></div>
				`;
			});
			$('.details-bd').html(xqStr);
			initOrRefreshScroll();
		},
	});
})();

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
		$('.hours').text(hours);
		var minutes = parseInt(diff / 1000 / 60 % 60, 10);
		$('.min').text(minutes);
		var seconds = parseInt(diff / 1000 % 60, 10);
		$('.miao').text(seconds);
	}
	setInterval(countdown, 1000)

})();


// 准备向购物车添加商品
(function() {
	// 选择加入购物车的蒙版出现
	$('.incart').on('click', function() {
		$('.paydialog').toggleClass('hiden');
	});
	$('.btn-quxiao').on('click', function() {
		$('.paydialog').toggleClass('hiden');
	});
	// 商品数量加减
	$(".deandin")
		.on('click', '.btn-decrease', function() {
			console.log('-');
			var countInput = parseInt($(this).next().val());
			var count = countInput - 1;
			console.log(count);
			$(this).attr('disabled', count === 1);
			$(this).next().next().attr('disabled', false);
			$(this).next().val(count);
		})
		.on('click', '.btn-increase', function() {
			console.log('+');
			var countInput = parseInt($(this).prev().val());
			var count = countInput + 1;
			console.log(count);
			$(this).attr('disabled', count === 5);
			$(this).prev().prev().attr('disabled', false);
			$(this).prev().val(count);
		});
		
	// ajax向购物车中添加商品 
	$('.btn-sure').on('click', function() {
		//找到目前添加的数量
		var count = parseInt($('.shuliang').val());
		console.log($('.shuliang').val());
		//找到此商品的cid作为传到购物车中的pid
		var pid = parseInt($.query.get('cid'));
		console.log(cid);
		$.ajax({
			type: "post",
			headers: {
				Authorization: Cookies.get("token")
			},
			url: "/cart/add",
			data: {
				pid: pid,
				count: $('.shuliang').val(),
			},
			success: function(res) {
					//请求数据库中所有的商品数量total
					$.ajax({
						type: "get",
						headers: {
							Authorization: Cookies.get("token")
						},
						url: "/cart/total",
						data: {
						},
						success: function(res) {
							$('.total-number').text(res.data);
						}
					});
			}
		});
		$('.paydialog').toggleClass('hiden');
	});
	
	//点击购物车图标跳转到购物车
	$('.alltotal').on('click',function() {
		window.location.replace('/cart/cart.html');
	})
})();
// 默认地址
$.ajax({
		type: "get",
		headers: { Authorization: Cookies.get('token') },
		url: "/address/get_default",
		data: {},
		success: function(res) {
			if(res.code !== 200) {layer.msg(res.msg); return;}
			var htmlStr = '';
				htmlStr = `
					${res.data.receiveRegion}${res.data.receiveDetail}
			`;
			$('.huoqu-address').text(htmlStr);
		},
});	

// 地址
$('.huoqu-address').on('click',function() {
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
							<div class="dialog-update"></div>
						</div>
					`;
				});
				$('.dialog-address-wrapper').html(htmlAddress);
			},
		});
		
	
	// 点击x取消地址选择蒙版
	$('.btn-cancel').on('click',function() {
		$('.address-dialog').addClass('hiden');
	});	

});
	// 选中的渲染dialog-content
	$('.dialog-content').on('click','.dialog-address-checkbox',function() {
		console.log(11);
		$(this).toggleClass('active');
		var dataname = $(this).closest('.dialog-address-info').find('.dialog-info-name-name').text();
		console.log(dataname);
		var dataphone = $(this).closest('.dialog-address-info').find('.dialog-info-phone').text();
		var dataaddress = $(this).closest('.dialog-address-info').find('.dialog-info-address').text();
		// $('h4.xm').text(dataname);
		// $('span.ph').text(dataphone);
		// $('p.address-ph').text(dataaddress);
		console.log()
		var id = $(this).closest('.dialog-address-info').attr('data-id');
		// var id = $(`fid[data-id = ${id}]`)
		var htmlStr = '';
			htmlStr = `
				${dataaddress}
		`;
		$('.huoqu-address').text(htmlStr);
		$('.edit-dialog').toggleClass('active').fadeOut(200);
		$('.address-dialog').toggleClass('hiden').fadeOut(200);
	});
// //关联滚动/返回顶部
function initOrRefreshScroll() {	
	imagesLoaded($('.content-wrapper')[0],function() {
		
		scroll = new IScroll($('.content-wrapper')[0], {
			bounce: false,				//边界回弹效果关闭，一定要关闭否则影响后面监听scroll.y的问题
			probeType: 2,				//开启滚动监听
			click: true,				
		});
		scroll.on("scroll", function() {
			//返回顶部
			var threshold = 1070;
			console.log(scroll.maxScrollY,scroll.y);
			
			isTriggerLoadMore = scroll.maxScrollY - scroll.y ;
			console.log(isTriggerLoadMore);
			if(isTriggerLoadMore >= -threshold) {
				$('.back-to-top').addClass('show');
				console.log(111);
			}else {
				$('.back-to-top').removeClass('show');
				console.log(222);
			}
				
			$('.back-to-top').on('click',function(e) {
				console.log('back-top-active');
				// $('div.wrapper').animate({scrollTop: 0},500)
				scroll.scrollTo(0,10,1000)
			});
			// jianyin
			var headerhold = -4840;
			if(headerhold <= isTriggerLoadMore) {
				console.log('-375高度');
				$('.part-indicators').addClass('hiden');
			}else {
				$('.part-indicators').removeClass('hiden');
			};
			//关联滚动
			var thresholds = [];
			var indicators = $('ul.part-indicators li');
			var parts = $('.part');
			for(var i = 0; i < parts.length; i++) {
				threshold = parts[i].getBoundingClientRect().top ;
				thresholds.push(Math.ceil(threshold));
				if(i === parts.length - 1) {
					thresholds.push(Math.ceil(threshold + parts[i].getBoundingClientRect().height));
				}
			}
			console.log(thresholds);
			threshold = 0;
			if(scroll.y >= -773 && scroll.y <= -0) {
				$('.lisp').addClass('active').siblings('li').removeClass('active');
			}else if(scroll.y <= -773 && scroll.y >= -1240) {
				$('.lipj').addClass('active').siblings('li').removeClass('active');
			}else if(scroll.y <= -1240 && scroll.y >= -5167) {
				$('.lixq').addClass('active').siblings('li').removeClass('active');
			}else if(scroll.y === -5167) {
				$('.litj').addClass('active').siblings('li').removeClass('active');
			}
			
		});
			
	});
}

// 立即购买
// 立即抢购
$('.nowpay').on('click',function() {
	console.log('立即抢购激活' + cid);
// 	//找到此商品的cid作为传到购物车中的pid
	$.ajax({
		type: "post",
		headers: {
			Authorization: Cookies.get("token")
		},
		url: "/cart/add",
		data: {
			pid: cid,
			count: $('.shuliang').val(),
		},
		success: function(res) {
			//根据给定的一个或多个购物记录id获取相应的详细购物信息(订单确认页用)
			setTimeout(function() {
				$.ajax({
					type: "post",
					headers: {
						Authorization: Cookies.get("token")
					},
					url: "/cart/list",
					data: {
						
					},
					success: function(res) {
						res.data.forEach(function(item) {
							console.log(cid);				//已找到
							var id = [];
							console.log(item.id);		//
							id.push(item.id);
							console.log(id);
							window.location.href = `/order_confirm/order_confirm.html?ids=${id}`;
						});
					}
				});
			},1000)
			
		}
	});
})
