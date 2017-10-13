$(()=>{

	let $login = $('.login-box');
	let $register = $('.register-box');
	let $user = $('.user-box');

	// 点击显示注册框
	$login.find('.register-btn').on('click',()=>{
		$login.addClass('hide');
		$register.removeClass('hide');
	});

	// 点击显示登陆框
	$register.find('.login-btn').on('click',()=>{
		$register.addClass('hide');
		$login.removeClass('hide');
	});

	// 注册
	$register.find('.form-btn a').on('click',()=>{
		$.ajax({
			type: 'post',
			url: '/api/user/register',
			data: {
				username: $register.find('[name="username"]').val(),
				password: $register.find('[name="password"]').val(),
				repassword: $register.find('[name="repassword"]').val()
			},
			dataType: 'json',
			success: (result)=>{
				// console.log(result);
				$register.find('.tip').html(result.message);
				// 注册成功
				if(result.code == 0){
					setTimeout(()=>{
						$register.addClass('hide');
						$login.removeClass('hide');
					},1000);
				}
			}
		});
	});

	// 登陆
	$login.find('.form-btn a').on('click',()=>{
		$.ajax({
			type: 'post',
			url: '/api/user/login',
			data: {
				username: $login.find('[name="username"]').val(),
				password: $login.find('[name="password"]').val()
			},
			dataType: 'json',
			success: (result)=>{
				// console.log(result);
				$login.find('.tip').html(result.message);
				// 注册成功
				if(result.code == 0){
					// setTimeout(()=>{
					// 	$login.addClass('hide');
					// 	$user.removeClass('hide');

					// 	$user.find('.user').html(result.userInfo.username);

					// 	// $login.removeClass('hide');
					// },1000);

					window.location.reload();
				}
			}
		});
	});

	// 退出登录
	$('.signOut').on('click',()=>{
		$.ajax({
			url: '/api/user/logout',
			success: (result)=>{
				window.location.reload();
			}
		});
	});

	// 后台退出登陆
	$('.mSignOut').on('click',()=>{
		$.ajax({
			url: '/api/user/logout',
			success: (result)=>{
				window.location = 'http://localhost:8888';
			}
		});
	});



	// 提交评论
	let $comments = $('.comments-form');
	let $list = $('.comments-list');
	let $num = $('.comments-num');
	let $load = $('.comments .list-btn');
	let $text =  $comments.find('.text');
	let $tip = $('.comments .tip');
	let limit = 3;
	let pageNum = 1;
	let comments = null;
	$comments.find('.btn').on('click',()=>{
		if(!$text.val()){
			$tip.html('评论不能为空').show();
			return;
		}
		$tip.hide();
		$.ajax({
			type: 'POST',
			url: '/api/comments/post',
			dataType: 'json',
			data: {
				comment: $text.val(),
				id: $comments.find('[name="contentId"]').val()
			},
			success: (result)=>{
				$comments.find('.text').val('');
				comments = result.data.comments.reverse();
				$num.html(comments.length);
				page(comments, pageNum);
				
			}
		});
	});

	// 加载评论
	$.ajax({
		url: '/api/comments',
		data: {
			id:  $comments.find('[name="contentId"]').val()
		},
		success: (result)=>{
			comments = result.data.comments.reverse();
			$num.html(comments.length);
			page(comments, pageNum);
		}
	});

	$load.on('click',()=>{
		pageNum++;
		page(comments, pageNum);
	});



	function formatDate(time){
		let date = new Date(time);
		return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
	}

	function page(comments, pageNum){
		let html = '';
		if(pageNum*limit >= comments.length){
			$load.hide();
		}else{
			$load.show();
		}
		$.each(comments,(i, comment)=>{

			if(i< pageNum*limit){

				html+=`<div class="list-item">
							<div class="item-title clear">
								<p class="left">${comment.username}</p>
								<p class="right">${formatDate(comment.time)}</p>
								</div>
								<div class="item-content">
									<p>${comment.content}</p>
								</div>
							</div>`;
			}

			});

			$list.html(html);
	}

});