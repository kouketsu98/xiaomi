(function() {
	var cid = parseInt($.query.get('cid')) || 17;
	var fid = $.query.get('fid');
	var fids = $.query.get('fids');
	var cName = $.query.get('cName') || "电视机";
	var name = "";			//搜索框输入的字符串
	var orderCol = "price"	//排序方案：price|rate|sale
	var orderDir = "asc";	//排序方向：asc|desc
	var pageSize = 6;		//每页显示多少条记录
	var isLoading = false;	//标识当前是否有未完成的ajax
	var hasMore = true;		//标识按当前条件看商品，还有没有更多可以看
	var scroll = null;		//保存new IScroll效果
	var isTriggerLoadMore = false;		//表示在滚动中是否触发了加载更多
	
	//封装tip
	function updateTip() {
		if(isLoading)
			$('p.tip').text('——— 加载中.. ———');
		else if(isTriggerLoadMore)
			$('p.tip').text('——— 放手立即加载更多 —————');
		else if(hasMore)
			$('p.tip').text('———上拉加载更多———');
		else if($('ul.list li').length === 0)
			$('p.tip').text('——— 暂无相关商品，敬请期待 ———');
		else
			$('p.tip').text('——— 到底了 —————');
	}
	//
	function initOrRefreshScroll() {
		//等滚动区域加载完,宽高确定后再进行new
		imagesLoaded($('.content')[0],function() {
			if(scroll === null) {
				scroll = new IScroll($('.content')[0], {
					deceleration: 0.003,		//阻尼系数效果
					bounce: false,				//边界回弹效果关闭，一定要关闭否则影响后面监听scroll.y的问题
					probeType: 2,				//开启滚动监听
					click: true,				//因为滚动关系点击事件li下面的a标签不能点击，要开启才能点击
				});
				scroll.on("scroll", function() {
					if(isLoading || !hasMore) return;
					console.log(scroll.maxScrollY,scroll.y);
					
					isTriggerLoadMore = scroll.maxScrollY - scroll.y === 0;
					console.log(isTriggerLoadMore);
					updateTip();
				});
				scroll.on("scrollEnd", function() {
					if(isTriggerLoadMore) {
						isTriggerLoadMore = false;
						getData(true);
					}
				});
			}else {
				scroll.refresh();		//更新滚动区域
			}
		});
	}
	/*公共的获取商品数据的函数
		1.刚进来
		2.点击搜索按钮时
		3.orderCol变化的时候
		4.orderDir变化的时候
		5.上拉加载更多时候
	*/
	
	function getData(isLoadMore = false) {
		isLoading = true;
		updateTip();
		if(!isLoadMore) {
			$('ul.list').empty();
			scroll && scroll.scrollTo(0,0,0);
		}
		//发ajax请求商品数据
		$.ajax({
			type: "post",
			url: "/product/list",
			data: { name, cid, orderCol, orderDir, begin: $('ul.list>li').length, pageSize},
			success: function(res) {
				if(res.code !== 200) return;
				hasMore = res.data.length === pageSize;
				setTimeout(function() {
					var htmlStr = "";
					res.data.forEach(function(item) {
						htmlStr +=`
							<li id="${item.id}">
								<a href="/detail/detail.html?cid=${item.id}" >
									<img src="${item.avatar}"/>
									<div>
										<h3>${item.name}</h3>
										<p>${item.brief}</p>
										<span>
											￥<span>${item.price}</span>.00
										</span>
										<div>
											<span>${item.rate}条销量</span>
											<span>${item.sale}条好评</span>
										</div>
									</div>
								</a>
							</li>
						`;
					});
					// $('ul.banner-ul').html(htmlStr);
					$(htmlStr).appendTo('ul.list');
					initOrRefreshScroll();
					
					isLoading = false;
					updateTip();
				},300)
			}
		});
	}
	//1.刚进来调一次getData
	getData();
	//排序切换
	$('.order-wrapper').on('click','li',function(e) {
		if(isLoading) {
			layer.msg('您的操作太快了，请稍候', {time: 1000, icon: 2});
			return;
		}
		if($(this).hasClass('active')) {
			orderDir = orderDir === "asc" ? "desc" : "asc";
			$(e.delegateTarget).children().toggleClass('asc desc');
			$(e.delegateTarget).children().children().toggleClass('icon-rise icon-decline');
		}else {
			orderCol = $(this).attr('data-col');
			$(this).addClass('active').siblings('.active').removeClass('active');
		}
		getData();
	})

	//banner的渲染
	$.ajax({
		// type: "post",
		url: "/category/list/" + fid,
		data: { name, cid, orderCol, orderDir, begin: $('ul.list>li').length, pageSize: 18 },
		success: function(res) {
			if(res.code !== 200) return;
			var ulStr = "";
			res.data.forEach(function(item) {
				ulStr +=`
					<li class="active1">
						<a  href="/list/list.html?cid=${item.id}&cName=${item.name}&fid=${item.fid}&fids=${("fids")}">
							<img src="${item.avatar}" >
							<span>${item.name}</span>
						</a>
					</li>
				`;
			});
			$('ul.banner-ul').html(ulStr);
		
		}
	});
	
//biaoti
	$.ajax({
		url:"/category/list/" + 0,
		success: function(res){
			if(res.code !== 200) {
				console.log(res.msg);
				return;
			}
			console.log(res.data);
			$('.nav-name').text(res.data[fid - 1].name);
		}
	});
	

})();
$('ul.banner-ul>li').on('click',function() {
	$(this).addClass('active').siblings('.active').removeClass('active');
})	
