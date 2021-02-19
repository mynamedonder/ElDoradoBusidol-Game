/**********************************************
 * 웹프로그램 제작에 필요한 요소들을 모아둠
 *
 * @제작자 : ywlee
 * @파일명 : util_Function4web.js
 * @제작일 : 2017년 4월 10일
 *
 **********************************************/

var util4web =
{
	device :
	{
		w : 0,
		h : 0
		// backup_h:0   필요없어 주석 처리 함.dblee.20180530
	},
	screen_mode : 1, //0,1  0-->세로모드, 1-->가로모드  dblee.20180530
	browser_name : '', // dblee.20180530
	os_name : '', // dblee.20180530
	is_mobile : true, //mobile(Android,iOS)이면 true,  아니면 false 이다.
	is_ad_fit: true	// AdFit 광고 적용 - 20201127_dblee
}

//device의 wh등을 알아 낸다.
util4web.init = function()
{
	util4web.setWebPlatform();
	util4web.browser_name = util4web.getBrowserCheck();

	// 화면 resize 구현  dblee.20180530
	window.addEventListener( 'orientationchange', util4web.screenAdjust.bind(this) );
	window.addEventListener( 'resize', util4web.screenAdjust.bind(this) );
	util4web.screenAdjust();
	// 마우스 오른쪽 클릭 방지 dblee.20180530
	document.oncontextmenu = function (e) {
		return false;
	}

	// 마우스 오른쪽 contextmenu방지 20181227_yhlee -- main.css에 -webkit-touch-callout: none !important;와 함께 사용 할 것
	window.oncontextmenu = function (e) {
		e.preventDefault();
		e.stopPropagation(); // not necessary in my case, could leave in case stopImmediateProp isn't available?
		e.stopImmediatePropagation();
		return false;
	}

	// 아이폰에서 사용자의 화면 scael 방지 코드. 사파리에서는 안됨. dblee.20180530
	document.documentElement.addEventListener('touchstart', function (event) {
		// event = event.originalEvent || event;
		if (event.touches.length > 1) {
			event.preventDefault();
		}
	}, false);
	var lastTouchEnd = 0;
	document.documentElement.addEventListener('touchend', function (event) {
		var now = (new Date()).getTime();
		if (now - lastTouchEnd <= 300) {
			event.preventDefault();
		}
		lastTouchEnd = now;
	}, false);

	// chrome에서 전체 화면 기능 적용, 네이버 5분에서는 안됨 dblee.20180530
	document.body.style.height = (document.documentElement.clientHeight + 70) + 'px';
	setTimeout(function() {
		window.scrollTo(0, 1);
	},0);

	// document load 되기전에 코드가 실행이 되어 이쪽으로 이동 시킴
	setInterval(
		function()
		{
			util4web.device.h = util4web.getHeight();
			util4web.device.w = util4web.getWidth();
			/* 필요 없는 부분 dblee.20180530
			if( util4web.device.backup_h != util4web.device.h || util4web.device.backup_w != util4web.device.w )
			{
				util4web.device.backup_h = util4web.device.h;
				util4web.device.backup_w = util4web.device.w;
				util4web.screenAdjust(); //w,h값을 계산하고, 화면을 재조정해준다.
			}
			*/
			// util4web.onScreenGuide(); // 세로 가이드 화면  dblee.20180530
			util4web.screenAdjust();
	},100);
}

/**
 * web platform 정보를 얻는 코드를 함수로 만듦
 * dblee.20180530
 */
util4web.setWebPlatform = function() {

	var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false );
	var isAndroid = navigator.userAgent.match(/android/i) || navigator.platform.match(/android/i) ? true : false;

	if (iOS || isAndroid) { // @since 2018.04.23
		util4web.is_mobile = true;
	} else {
		util4web.is_mobile = false;
		util4web.screen_mode = 1;
	}

	// util4web.is_mobile = true;	// test
}
util4web.isiOS = function()
{
	return ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false );
}

//화면 변경이 있을때 즉, 가로보기, 세로보기 등이 바뀔때
//가끔 onresize가 호출되지 않는 문제가 있어 setTimeout으로 변경 예정
//window.onresize = function()


// 가로모드 / 세로 모드 일 때 동작 정의 20180528.dblee
util4web.onScreenGuide = function() {
	// AdFit 광고 적용 - 20201127_dblee
	var mobile_h = parseInt($('#AD_BOX_LEFT').css('height'));

	// console.log(" mobile_h : "+mobile_h)
	// console.log(" orientation : "+window.orientation)
	util4web.screenAdjust();

	if (mobile_h > 0)
	{
		util4web.screen_mode = 1; //가로모드
		$('#rotate_screen').css({ 'display': 'none' });
		return;
	}

	if (window.orientation == 90 || window.orientation == -90)
	{
		util4web.screen_mode = 1; //가로모드
		$('#rotate_screen').css({'display':'none'});
	}
	else
	{
		if (mobile_h == 0) {
			// 모바일 버전
			var device_w = util4web.getWidth();
			var device_h = util4web.getHeight();
			if (device_w > device_h)
			{
				util4web.screen_mode = 1; //가로모드
				$('#rotate_screen').css({ 'display': 'none' });
				return;
			}

			// console.log(" device_w : "+device_w)
			// console.log(" device_h : "+device_h)
		}
		util4web.screen_mode = 0; //세로모드
		//세로 모드 이므로 화면을 돌려 가로로 사용 하라는 표기 보여주기
		//"화면을 가로로 돌려 주세요"
		var fname = './image/info_horizontal.jpg';
		$('#rotate_screen').attr('src',fname).css({
											left: 0 + 'px',
											top: 0 +  'px',
											position: 'absolute' });
		$('#rotate_screen').css({'display':'block'});

		if (util4web.isiOS()) {
			 var scaleX = window.screen.width/720;
			 var scaleY = window.screen.height/1280;
		} else {
			var scaleX = util4web.device.w/720;
			var scaleY = util4web.device.h/1280;
		}

		var originV = '0% 0%';
		var command = 'scale('+scaleX+','+scaleY+')';


		$('#rotate_screen').css({
				'transform': command,
				'-ms-transform': command, /* IE 9 */
				'-webkit-transform': command, /* Safari and Chrome */
				'-o-transform': command, /* Opera */
				'-moz-transform': command, /* Firefox */

				'transform-origin': originV ,
				'-ms-transform-origin': originV, /* IE 9 */
				'-webkit-transform-origin': originV, /* Safari and Chrome */
				'-o-transform-origin': originV, /* Opera */
				'-moz-transform-origin': originV /* Firefox */
		});


	}
}

// 가로 세로 비율에 맞게 스크린을 재 조정 한다. 20180528.dblee
util4web.screenAdjust = function()
{
	var device_w = util4web.getWidth();
	var device_h = util4web.getHeight();
	// LG G7 ThinQ chrom 브라우저 문제점 수정
	device_w = document.body.clientWidth;
	device_h = document.body.clientHeight;

	if (util4web.is_mobile)
	{

		var mobile_h = parseInt($('#AD_BOX_MOBILE').css('height'));

		// console.log("  mobile_h:" + mobile_h);

		var gamebox_w = parseInt($('#GAME_BOX').css('width'));


		$('#AD_FIT_BG').attr({ width: device_w, height: device_h });

		var mobile_w = parseInt($('#AD_BOX_MOBILE .kakao_ad_area').css('width'));
		var wScale = device_w / 1280;
		var gamebox_h = (gamebox_w * 720 / 1280);
		var hScale = (device_h - 50) / 720;
		var gamebox_top = 50;
		var gamebox_left = 15;

		console.log("  mobile_w:" + mobile_w);

		var mobile_left = (device_w - mobile_w) / 2;
		if (mobile_left < 0) mobile_left = 0;
		if (device_w < device_h) mobile_left = 0;

		$('#AD_BOX_MOBILE').css({
			"left": mobile_left + 'px',
			"top": 0 + 'px',
			"position": 'absolute'
		});

	}
	else
	{
		// AdFit 광고 적용 - 20201127_dblee

		var mobile_h = parseInt($('#AD_BOX_LEFT').css('height'));
		var gamebox_w = parseInt($('#GAME_BOX').css('width'));


		$('#AD_FIT_BG').attr({ width: device_w, height: device_h });

		var ad_w = parseInt($('#AD_BOX_LEFT').css('width'));
		var kakao_w = parseInt($('.kakao_ad_area').css('width'));
		var kakao_h = parseInt($('.kakao_ad_area').css('height'));
		var ad_left = (ad_w - kakao_w + 15) /2 ;
		var ad_top = (device_h - kakao_h) /2 ;
		if (ad_top < 0) ad_top = 0;

		$("#ad-block-left").css({
			"padding-left": ad_left + 'px',
			"padding-top": ad_top + 'px'
		});

		var ad_w = parseInt($('#AD_BOX_RIGHT').css('width'));
		var ad_right = (ad_w - kakao_w -15) / 2;
		$("#ad-block-right").css({
			"padding-left": ad_right + 'px',
			"padding-top": ad_top + 'px'
		});


		// console.log("  ad_left:" + ad_left + "   ad_w:" + ad_w + "   ad_w:" + ad_w );

		var wScale = gamebox_w / 1280;
		var gamebox_h = gamebox_w * 720 / 1280;
		var hScale = (gamebox_h) / 720;
		var gamebox_top = (device_h - gamebox_h) / 2;
		var gamebox_left = 0;

	}
	var originV = '0% 0%';
	var command = 'scale(' + wScale + ',' + hScale + ')';

	// console.log("  wScale:" + wScale + "   hScale:" + hScale + "   gamebox_w:" + gamebox_w + "   gamebox_h:" + gamebox_h);
	// console.log("  device_w:" + device_w + "   device_h:" + device_h );

	$('#div_body').css({
		// width: gamebox_w +'px',
		// width: 1280+'px',
		// height: '10%', //25를 +한 이유 : 모바일 가로 모드에서 스크롤 될 수 있게
		"left": gamebox_left + 'px',
		"top": gamebox_top + 'px',

		'transform': command,
		'-ms-transform': command, /* IE 9 */
		'-webkit-transform': command, /* Safari and Chrome */
		'-o-transform': command, /* Opera */
		'-moz-transform': command, /* Firefox */

		'transform-origin': originV,
		'-ms-transform-origin': originV, /* IE 9 */
		'-webkit-transform-origin': originV, /* Safari and Chrome */
		'-o-transform-origin': originV, /* Opera */
		'-moz-transform-origin': originV /* Firefox */
	});

}

util4web.getWidth = function()
{
	//모바일이면 screen.width를 사용한다.

/*
	if(util4web.is_mobile)
		return document.documentElement.clientWidth;//screen.width; 가로 모드일때 가상 키보드 영역 제거를 위해 clientWidth사용함.

*/
	//아래 작동이 이상한듯 하여 screen.width만 사용
	if (window.innerWidth) {
		return window.innerWidth;
	}

	if (document.documentElement && document.documentElement.clientWidth) {
	return document.documentElement.clientWidth;
	}

	if (document.body) {
	return document.body.clientWidth;
	}
}

util4web.getHeight = function()
{
	//alert("screen.height:"+screen.height);
/*
	if(util4web.is_mobile)
		return screen.height;
*/

	// console.log("innerHeight:"+window.innerHeight+ "  document.body.clientHeight:"+document.body.clientHeight);
	// console.log("clientHeight:"+document.documentElement.clientHeight+ "  document.body.clientHeight:"+document.body.clientHeight);

	if (window.innerHeight) {
		return window.innerHeight;
	}


	if (document.documentElement && document.documentElement.clientHeight) {
	return document.documentElement.clientHeight;
	}

	if (document.body) {
	return document.body.clientHeight;
	}
}

//broser의 종류를 return한다.
/* return 값

	'ie.....'
	'ie11'
	'edge'
	'Opera'
	'Chrome'
	'Firefox'
	'Samsung'
	'Safari'
	'naver'
*/
util4web.getBrowserCheck = function()
{
	var agt = navigator.userAgent.toLowerCase(),
	name = navigator.appName,
	browser;

	if(name === 'Microsoft Internet Explorer' || agt.indexOf('trident') > -1 || agt.indexOf('edge/') > -1)
	{
		browser = 'ie';
		if(name === 'Microsoft Internet Explorer') // IE old version (IE 10 or Lower)
		{
			agt = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agt);
			browser += parseInt(agt[1]);
		}
		else // IE 11+
		{
			if(agt.indexOf('trident') > -1) // IE 11
			{
				browser += 11;
			} else if(agt.indexOf('edge/') > -1) // Edge
			{
				browser = 'edge';
			}
		}
	}
	else if(agt.indexOf('safari') > -1) // Chrome or Safari
	{
		if(agt.indexOf('opr') > -1) // Opera
		{
			browser = 'Opera';
		}
		else if(agt.indexOf('chrome') > -1|| agt.indexOf('cr') > -1) // Chrome
		{
			if (agt.indexOf('samsung') > -1)
			{
				browser = 'Samsung';
			}
			else
			{
				browser = 'Chrome';
			}
		}
		else if(agt.indexOf('firefox') > -1 || agt.indexOf('fx') > -1)  // Firefox
		{
			browser = 'Firefox';
		} else if (agt.indexOf('samsung') > -1)
		{
			browser = 'Samsung';
		} else // Safari
		{
			browser = 'Safari';
		}
	}
	else if(agt.indexOf('naver'))
	{
		browser = 'naver';
	}
	// console.log("  browser:"+browser);
	return browser;
}

//저사양 모델의 브라우저 이면 return true, 그렇지 않으면 return false
//저사양 모델일 경우 처리
//1. 메인화면에서 selectmap진입시 줌인 기능 삭제
//2. 메인화면에서 반짝이 기능 제거
util4web.is_low = function()
{
	//우선은 삼성 브라우저 일경우는 return true로 처리 한다.

	var browser = util4web.getBrowserCheck();
	switch(browser)
	{
		case "Samsung" : return true;
		default		   : return false;
	}
}


//~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$
//20200525_yhlee 아이폰 스크롤을 막기위해 선언합니다.
util4web.scrollDisable = function(){
    $('body').addClass('scrollDisable').on('scroll touchmove mousewheel', function(e){
        e.preventDefault();
    });
}
util4web.scrollAble = function(){
    $('body').removeClass('scrollDisable').off('scroll touchmove mousewheel');
}
//~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$~~$

//Design Your Own Free Website! Free Drag & Drop Website Builder
document.addEventListener("touchmove", function(e) { e.preventDefault() });


/////////////////google analytics 정보를 보낸다.///////////////////
// analytics 정보를 보낸다. 정보를 입력한다.
function send_analytics(scene)
{
	try
	{

		//ga('set', 'page', '/'+scene);
		//	ga('set', {page: '/'+scene, title: 'ELDORADO'});


		bga('send', 'pageview', "LOGIN"+'/'+scene);

		/*
		참고사이트:
		https://developers.google.com/analytics/devguides/collection/analyticsjs/events

		ga('send', 'screenview', {
		  'appName': 'ELDORADO',
		  'appId': gAPP_INFO.APP_NAME||"",
		  'appVersion': gAPP_INFO.VERSION||"",
		  'appInstallerId': STORAGE.data1.id||"",
		  'screenName': scene||""
		});
		*/
	}
	catch(e)
	{
		// utilConsoleLog("Error in google analytics!:"+e);
	}
}

//ga send를 위한것
function bga(a,b,c,d,e)
{
	try
	{
		ga(a,b,c,d,e);
		//document.getElementById('iframe_ga').contentWindow.ga(a,b,c,d,e);
		//utilConsoleLog("bga send: "+a+" "+b+" "+c+" "+d+" "+e);
	}
	catch(e)
	{
		//utilConsoleLog("Error in google analytics! bga:"+e);
	}

}
