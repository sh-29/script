$(document).ready(function () {
  // 1)변수 설정
  var _slider = $('.slider');
  var _pagiEle = _slider.find('.pagination li');
  var _itemWrap = _slider.find('.item_wrap');
  var _item = _itemWrap.children();
  var total = _item.length; //아이템 개수
  var current = 0;  //현재보여지는 아이템 인덱스번호
  var timer;  //setInterval()을 참조하는 참조 변수명 => clearInterval()에서 호출
  // console.log(total);
  var visualWid; //.visual의 가로 너비

  $(window).on('resize',function(){
    visualWid = _slider.find('.visual').width();
    _itemWrap.css('width',visualWid*total).children().css('width',visualWid);
    // console.log(visualWid);
  });
  $(window).trigger('resize');

  // 2)기초 설정 : play버튼 숨기기, 페이징 첫번째 li.on, 접근성(현재보이는 슬라이드만 읽히도록)aria-hidden,aria-inert
  _pagiEle.eq(0).addClass('on');
  _item.eq(0).siblings().attr({'aria-hidden':true, inert:''}).find('a').attr('tabIndex',-1); //스크린에서 접근하지 못하도록.find()부터 키보드 접근하지 못하도록

  // 3)pagination 버튼 클릭 이벤트
  _pagiEle.children().on('click',function () {
    current = $(this).parent().index();
    // console.log(current);
    // 자동실행 멈추기 .play버튼 보이고, .pause버튼 숨기고

    clearInterval(timer);
    _slider.find('.play').show().siblings().hide();
    // aria-live="polite"변경
    _slider.find('.visual').attr('aria-live','polite');

    // 움직임을 function 호출
    sliderActive();
  });
  function sliderActive () {
    //페이지네이션 li.on 클래스
    _pagiEle.eq(current).addClass('on').siblings().removeClass('on');
    //_itemWrap의 애니메이트로 left좌표값 움직이기
    _itemWrap.stop().animate({left:visualWid * current * -1},function () {
      //접근성 추가 제어 : 현재 item(접근 가능), 나머지 item들(접근 불가능)
      _item.eq(current).removeAttr('aria-hidden inert').find('a').removeAttr('tabIndex');
      _item.eq(0).siblings().attr({'aria-hidden':true, inert:''}).find('a').attr('tabIndex',-1);
    });
    
  }

  // 4)이전과 다음 버튼 클릭 이벤트 =>해당 pagenation 버튼 클릭을 강제 실행
  _slider.find('.prev_next button').on('click', function () {
    // 4-1)이전과 다음을 구분하는 변수
    var btnNum = $(this).index();
    // console.log(btnNum); //이전0=>current 1감소 , 다음1=>current 1증가

    // 4-2)이전,다음 클릭할때, current값 없데이트
    //삼항조건 연산자 : 조건식? (참)실행문1 : (거짓)실행문2
    btnNum === 0? current-- : current++;
    if(current < 0) current = total -1;
    else if(current === total) current = 0;
    // console.log(current); //0,1,2

    // 4-3)인덱스 번호를 만족하는 페이지네이션을 강제로 클릭하게 함
    _pagiEle.eq(current).children().click();
    // _pagiEle.eq(current).children().trigger('click'); 강제 클릭 63번과 같은 말
  });

  // 5)자동실행(setInterval:next버튼을 연속으로 누르기와 동일) - 페이지 로딩시 자동실행 => function생성
  function playSlider(){
    timer = setInterval(function () {
      current++;
      if(current === total) current = 0;
      sliderActive();
      _slider.find('.visual').attr('aria-live','off');

    }, 2500);
  }
  playSlider();

  // 6)자동실행과 일시정지(clearInterval) 버튼 클릭 이벤트 - 버튼을 눌렀을 때 동작
  _slider.find('.play_pause button').on('click',function(){
    // 6-1)자동실행과 일시정지를 구분하는 변수
    var btnNum = $(this).index(); //0->play 1->pause
    console.log(btnNum);

    // 6-2)버튼별 동작
    if (btnNum === 0) playSlider();
    else clearInterval(timer);
    _slider.find('.visual').attr('aria-live','polite');

    // 6-3) 아이콘변경
    $(this).hide().siblings().show();
  });
});