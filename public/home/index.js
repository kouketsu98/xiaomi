new Swiper (".banner", {
	loop: true, //无缝
	// autoplay: true, //开启自动播放,默认3s
	autoplay: {
		delay:2000,
		disableOnInteraction: false
	},
	freeMode: false,
	pagination: {
		el: ".banner>.swiper-pagination",
		type: "progressbar" //silde样式
	},
	navigation: {
		nextEl: ".banner>.swiper-button-next",
		prevEl: ".banner>.swiper-button-prev",
	}
});

// 
$.ajax({
	// type: "post",
	url: "/category/list/" + 1,
	data: {  },
	success: function(res) {
		if(res.code !== 200) return;
		var ulStr = "";
		res.data.forEach(function(item) {
			ulStr +=`
				<li class="active1">
					<a  href="/list/list.html?cid=${item.id}&cName=${item.name}&fid=${item.fid}">
						<img src="${item.avatar}" >
						<span>${item.name}</span>
					</a>
				</li>
			`;
		});
		$('ul.chose-bd-content').html(ulStr);
	
	}
});
// 有品秒杀
$.ajax({
	// type: "post",
	url: "/category/list/" + 2,
	data: {  },
	success: function(res) {
		if(res.code !== 200) return;
		var ulStr = "";
		res.data.forEach(function(item) {
			ulStr +=`
				<li class="active1">
					<a  href="/list/list.html?cid=${item.id}&cName=${item.name}&fid=${item.fid}">
						<img src="${item.avatar}" >
						<span>${item.name}</span>
					</a>
				</li>
			`;
		});
		$('ul.chose2-bd-content').html(ulStr);
	
	}
});
// 倒计时
(function() {
	var targetDate = new Date(2021,12,31,00,00,0);
	var timer = null;
	function countdown() {
		var diff = targetDate.getTime() - new Date().getTime();
		if(diff <=0 ) { clearInterval(timer); timer = null; return;}
		var days = parseInt(diff / 1000 / 60 / 60 / 24 , 10);
		var hours = parseInt(diff / 1000 / 60 / 60 % 24 , 10);
		var minutes = parseInt(diff / 1000 / 60 % 60, 10);
		var seconds = parseInt(diff / 1000 % 60, 10);
		var ltime =days + "天" + hours+"小时" + minutes+"分"+seconds+"秒"; 
		$('.djs').text(ltime);
	}
	setInterval(countdown,1000)
	
})();
// openapp
$('.oppen-app').on('click',function() {
	layer.msg('未检测到app');
})