$('.fanhui').on('click',function() {
	console.log('返回被激活');
	window.location.href = '/category/category.html';
})
// 未登录之前点击立即登录弹出msg
$('span.btn-nowgologin').on('click',function() {
	console.log(1);
	layer.confirm('欢迎您来到小米有品！您需阅读并同意相关政策条款方可进行登录。', {
	  btn: ['不同意','同意'] //按钮
	}, function(){
	  layer.msg('不同意', {icon: 2});
	}, function(){
	  layer.msg('同意', {time: 10000}),
	  window.location.replace('/login/login.html');
	});
});
//去首页
$('span.btn-nowgoindex').on('click',function() {
	console.log("去首页");
	layer.confirm('是否去添加商品？', {
	  btn: ['不是','是'] //按钮
	}, function(){
	  layer.msg('已取消', {icon: 2});
	}, function(){
	  layer.msg('正在去首页', {time: 10000}),
	  window.location.replace('/home/index.html');
	});
});
// 获取登录的cookie
console.log(Cookies.get("token"));
// 没有登录时候
if(Cookies.get("token") === '') {
	$('.islogin').removeClass('hide');
	$('.isshopping').addClass('hide');
	$('.cartinfo-wrapper').addClass('hide');
	$('.footer').addClass('hide');
	$('.bg').removeClass('active');					//bg隐藏一部分
	// $('.islogin').css('display','flex');			//是否去登录显示
	// $('.isshopping').css('display',"none");			//是否去主页隐藏
	// $('.cartinfo-wrapper').css('display',"none");	 //购物车主体隐藏
	// $('.footer').css('display',"none");				//底部隐藏
	$('.toggle').css('display',"none");				//编辑文字隐藏
};
// 获取数据库购物记录
var datalength = "";
$.ajax({
		type: "post",
		headers: {Authorization: Cookies.get("token")},
		url: "/cart/list/",
		data: {},
		success: function(res) {
			if(res.code !== 200) {console.log(res.msg);return;}
			var datalength = res.data;
			// console.log(datalength.length);
			var htmlStr = "";
			res.data.forEach(function(item) {
				htmlStr += `
					<div class='info' data-id="${item.id}" data-max="${item.maxCount}">
						<div class='anniu'>
							<span class="checkbox"></span>
						</div>
						<div class="if-rt">
							<img src="${item.avatar}" >
							<div class='wzbf'>
								<div>
									<img src="images/4babede2912b259d01b2a72ffa3d8eff.png" >
									<h4>${item.name}</h4>
								</div>
								<div class='tip'>
									<span>${item.brief}</span>
								</div>
								<div class="jiaOrjian">
									<span class="redprice">￥${item.price}.00</span>
									<div>
										<input class="btn-decrease" } value='-' ${item.count <= 1 ? "disabled" : ""} type="button" />
										<input type="text" value="${item.count}">
										<input class="btn-increase" } value='+' ${item.count >= 10 ? "disabled" : ""} type="button" />
									</div>
								</div>
							</div>
						</div>
					</div>
				`;
			});
			$('.cartinfo-bd').html(htmlStr);
			(function() {
				// 已经登录并且数据库有商品
				if((Cookies.get("token") !== '') && (datalength.length !== 0) ){
					$('.bg').addClass('active');					//bg显示一部分
					$('.islogin').addClass('hide');				//是否去登录隐藏
					$('.isshopping').addClass('hide');				//是否去主页隐藏
					$('.bianji').css('display',"flex");				//编辑文字隐藏
					$('.cartinfo-wrapper').removeClass('hide');		 //购物车主体显示
					$('.footer').removeClass('hide');					//底部显示
					$('.toggle').css('display',"flex");				//编辑文字显示
					console.log('购物车有商品');
				};
				//已经登录但购物车没有商品时
				setTimeout(function() {
					if((Cookies.get("token") !== '') && (datalength.length === 0) ){
						console.log('购物车没有商品');
						$('.cartinfo-wrapper').addClass('hide');	 //购物车主体隐藏
						$('.footer').addClass('hide');				//底部隐藏
						$('.toggle').addClass('hide');				//编辑文字隐藏
						$('.islogin').addClass('hide');				//是否登录隐藏
						$('.isshopping').removeClass('hide');			//是否去主页显示
						console.log('购物车没有商品');
					};
				},0);
				
			})();
			
		}
});
console.log(datalength.length);
// 
		
// 绑定事件
//切换编辑时，免运费、合计隐藏，结算变成删除功能
$('.toggle').on('click','.bianji',function() {
	console.log('编辑按钮');
	$('.bianji').toggleClass('hide show');
	if($(this).hasClass('hide')) {
		$(this).text('编辑');
		console.log('编辑');
	}else {
		$(this).text('完成');
		console.log('完成');
	};
	
	
	
	$('.myf').toggleClass('hide');
	$('.other').toggleClass('hide');
	$('.gotopay').toggleClass('btn-toggle');
	$('.btn-remove').toggleClass('hide');
	
})
$('.container')
// 数量减少
	.on('click','.btn-decrease',function() {
		var id = $(this).parents('.info').attr('data-id');
		var countInput = parseInt($(this).next().val());
		var count = countInput -1;
		$(this).attr('disabled', count === 1);
		$(this).next().next().attr('disabled',false);
		var that = this;
		// var target = $(this).closest('.info').find(function(item) { return item.id === id});
		// target.count -= 1;
		// $(this).attr('disabled', target.count === 1)
		// 	   .prev().text(target.count)
		// 	   .prev().attr('disabled', false);
		$.ajax({
			type: "post",
			headers: {Authorization: Cookies.get("token")},
			url: "/cart/decrease/" + $(this).parents('.info').attr('data-id'),
			data: {
				
			},
			success: function(res) {
				if(res.code === 200) {
					$(that).next().val(count);
					// res.count -= 1;
					// $('.btn-decrease').attr('disabled', res.count === 1)
				 //   .next().text(res.count)
				 //   .next().attr('disabled', false);
				}
			},
		});
		updateTotal();
	})
// 数量增加
	.on('click','.btn-increase',function() {
		var id = $(this).closest('.info').attr('data-id');
		var countInput = parseInt($(this).prev().val());
		var count = countInput + 1;
		$(this).attr('disabled', count === 10);
		$(this).prev().prev().attr('disabled',false);
		var that = this;
		$.ajax({
			type: "post",
			headers: {Authorization: Cookies.get("token")},
			url: "/cart/increase/" + $(this).parents('.info').attr('data-id'),
			data: {},
			success: function(res) {
				console.log(res.count);
				if(res.code === 200) {
					$(that).prev().val(count);
				}
			},
		});
		updateTotal();
	})
// 复选
	.on('click','.checkbox:not(.all)',function() {
		var id = $(this).parents('.info').attr('data-id');
		console.log(id);
		$(this).toggleClass('checked');
		var unchecked = $('.info').find('.checkbox:not(.checked)');
		console.log(unchecked);
		//
		// var ischecked = $('.info').find('.checkbox.checked');
		
		// if(unchecked.length === 0) {$('.shuliang').text("").remove(); }
		$('.checkbox.all').toggleClass('checked', unchecked.length === 0);
		updateTotal();
	})
//全选全不选
	.on('click','span.checkbox.all',function(e) {
		console.log(111);
		$('span.checkbox.all').toggleClass('checked');
		$(e.delegateTarget).find('span.checkbox:not(.all)').toggleClass('checked',$('span.checkbox.all').hasClass('checked'))
		
		updateTotal();
	})
//删除
	.on('click','.btn-remove',function() {
		
		if(!confirm('是否删除？')) return;
		else {
			var ids = [];
			$('span.checkbox:not(.all).checked').each(function(i,div) {
				var id= $(div).parents('.info').attr('data-id');
				ids.push(id);
				$(div).parents('.info').remove();
			});
			$.ajax({
				type: "post",
				headers: {Authorization: Cookies.get("token")},
				url: "/cart/remove" ,
				data: {
					ids: ids,
				},
				success: function(res) {
					if(res.code !== 200) {
						layer.msg(res.msg); return;
					} 
					
					
					$.ajax({
						type: "post",
						headers: {Authorization: Cookies.get("token")},
						url: "/cart/list/",
						data: {},
						success: function(res) {
							var datalength = res.data;
							if((Cookies.get("userName") !== undefined) && (datalength.length === 0) ){
								console.log('购物车没有商品');
								$('.cartinfo-wrapper').addClass('hide');	 //购物车主体隐藏
								$('.footer').addClass('hide');				//底部隐藏
								$('.toggle').addClass('hide');				//编辑文字隐藏
								$('.islogin').addClass('hide');				//是否登录隐藏
								$('.isshopping').removeClass('hide');			//是否去主页显示
								console.log('购物车没有商品');
							};
							
						},
					});
				
				},
			});
			
		}
		updateTotal();
	});
//总计
function updateTotal() {
	setTimeout(function() {
		$.ajax({
			type: "post",
			headers: {Authorization: Cookies.get("token")},
			url: "/cart/list",
			success: function(res) {
				var $checkedTrs = $('.info:has(span.checkbox.checked)');
				var total = 0, target = null, allCount = 0;
				$checkedTrs.each(function(i, div){
					var id = parseInt($(div).attr('data-id'));
					console.log('选择的id' + id);
					
					var ids = [];
					$('span.checkbox:not(.all).checked').each(function(i,div) {
						var id= $(div).parents('.info').attr('data-id');
						ids.push(id);
						console.log(ids);
						$('.gotopay').on('click',function() {
							console.log('结算被点了');
							window.location.href = `/order_confirm/order_confirm.html?ids=${ids}`;
						});
					});
					
					
					target = res.data.find(function(item) { 
						return item.id === id;
					});
					// console.log(target);
					total += target.price * target.count;
					allCount += target.count
				});
				$('span.total').text(total);
				$('span.shuliang').text(`(` + allCount + `)`);
			},
		});
	},100);
}



