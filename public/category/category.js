// 发 ajax请求一级分类的数据，并动态渲染
$.ajax({
	url:"/category/list/0",
	success: function(res){
		if(res.code !== 200) {
			console.log(res.msg);
			return;
		}
		var htmlStr = "";
		res.data.forEach(function(item) {
			htmlStr += `
				<li data-id="${item.id}" data-avatar="${item.avatar}" fids = "${item.fid}">
					<span>${item.name}</span>
				</li>
			`;
		});
		
		// $('ul.list-main').html(htmlStr).find('li').eq(0).trigger('click');
		$('ul.list-main').html(htmlStr).children().eq(0).trigger('click');
	}
});
// 给ul.list-main绑定点击事件，实现一级分类切换
$('ul.list-main').on('click', function(e) {
	var $li = e.target.tagName === "LI" ? $(e.target) : $(e.target).parent();
	if($li.hasClass('active')) return;
	$li.addClass('active').siblings('.active').removeClass('active');
	$('img.avatar').attr('src',$li.attr('data-avatar'));
	// 请求对应的二级分类数据，并进行动态渲染
	console.log($li);
	$.ajax({
		url: "/category/list/" + $li.attr("data-id"),
		success: function(res) {
			if(res.code !== 200) {
				console.log(res.msg);
				return;
			}
			$('ul.list-sub').empty();
			if(res.data.length) {
				$('p.tip').hide();
				var htmlStr = "";
				res.data.forEach(function(item) {
					htmlStr += `
						<li>
							<a href="/list/list.html?cid=${item.id}&cName=${item.name}&fid=${item.fid}&fids=${$li.attr("fids")}">
								<img src="${item.avatar}"/>
								<span>${item.name}</span>
							</a>
						</li>
					`;
				});
				$('ul.list-sub').html(htmlStr).show();
			} else {
				$('p.tip').show();
				$('ul.list-sub').hide();
			}
		}
	});
});