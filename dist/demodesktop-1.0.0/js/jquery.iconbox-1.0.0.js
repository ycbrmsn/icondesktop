;(function (factory) {
  if (typeof define === "function" && define.amd) {
    // AMD模式
    define([ "jquery" ], factory);
  } else {
    // 全局模式
    factory(jQuery);
  }
}(function ($) {
  $.fn.iconbox = function (options) {
    var defaultOption = {
      desktopPadding: 20, // 桌面内边距
      pageHeight: 50, // 分页栏高度
      closeBoxColor: '#8e8e8e', // 桌面背景颜色
      closeBoxWidth: 128, // 盒子关闭时的宽度
      closeBoxHeight: 0, // 盒子关闭时的高度，为0时与宽度相同
      closeBoxPadding: 10, // 盒子关闭时的内边距
      closeBoxMargin: 20, // 盒子关闭时的外边距
      closeBoxTitleHeight: 30, // 盒子关闭时的标题高度
      closeBoxTitleFontSize: 16, // 盒子关闭时的标题字体大小
      thumbnailWidth: 30, // 盒子关闭时里面的小图标宽度
      thumbnailHeight: 0, // 盒子关闭时里面的小图标高度，为0时与宽度相同
      openBoxColor: '#3C3C3C', // 盒子打开时的背景颜色
      openBoxTitleHeight: 40, // 盒子打开时的标题高度
      openBoxTitleFontSize: 18, // 盒子打开时的标题字体大小
      openBoxPadding: 20, // 盒子打开时的内边距
      openBoxIconMargin: 20, // 盒子打开时里面的图标的外边距
      openBoxIconClick: function (data) {}, // 盒子打开时里面的图标点击事件
      data: [
        {
          title: '图标1',
          extraClass: '',
          children: [
            {
              title: '电子邮件',
              extraClass: 'rockicon',
              img: 'img/email.png'
            }
          ]
        },
        {
          title: '图标2',
          extraClass: '',
          children: [
            {
              title: '电子邮件',
              extraClass: 'rockicon',
              img: 'img/email.png'
            }
          ]
        }
      ]
    }
    var opt = $.extend(defaultOption, options);
    // 如果未设置高度，则与宽度相同
    if (!opt.closeBoxHeight) {
      opt.closeBoxHeight = opt.closeBoxWidth;
    }
    if (!opt.thumbnailHeight) {
      opt.thumbnailHeight = opt.thumbnailWidth
    }
    return this.each(function () {
      var width = $(this).width();
      var height = $(this).height();

      // *******************************初始化状态开始*************************************
      // 计算水平可以放几个盒子
      // (桌面宽度 - 桌面上下的内边距 + 图标之间的外边距) / (图标的宽度 + 图标的外边距)
      var horSize = Math.floor((width - opt.desktopPadding * 2 + opt.closeBoxMargin) / (opt.closeBoxWidth + opt.closeBoxMargin));
      // 计算垂直方向可以放几个盒子
      // (桌面高度 - 分页栏高度 - 上边桌面的内边距 + 图标之间的外边距) / (图标高度 + 图标名称 + 图标外边距)
      var verSize = Math.floor((height - opt.pageHeight - opt.desktopPadding + opt.closeBoxMargin) / (opt.closeBoxHeight + opt.closeBoxTitleHeight + opt.closeBoxMargin));
      // 一页的盒子数量
      var pageSize = horSize * verSize;
      // 页数
      var pages = Math.ceil(opt.data.length / pageSize);

      // 构造节点
      var $dl, $dd;
      // 盒子部分
      var $box, $boxTitle;
      // 盒子内图标部分
      var $icon, $iconTitle, $iconImg;
      // 分页栏部分
      var $pagePanel, $pageBox, $pageNum;
      // 循环对象
      var dataBox, dataIcon;
      $dl = $(document.createElement('dl'));
      $dl.addClass('icondesktop-slidebox');
      $pagePanel = $(document.createElement('div'));
      $pagePanel.addClass('icondesktop-pagination');
      $pageBox = $(document.createElement('div'));
      $pageBox.addClass('icondesktop-pagebox');
      $pagePanel.append($pageBox);
      for (var i = 0; i < opt.data.length; i++) {
        dataBox = opt.data[i];
        // 下一页
        if (i % pageSize === 0) {
          // 创建新桌面
          $dd = $(document.createElement('dd'));
          $dd.addClass('icondesktop-slide');
          $dl.append($dd);
          // 创建页码图标
          $pageNum = $(document.createElement('a'));
          $pageNum.addClass('icondesktop-pageitem');
          if (i === 0) {
            $pageNum.addClass('icondesktop-pageitem__active');
          }
          // $pageNum.text(Math.ceil(i / pageSize));
          $pageBox.append($pageNum);
        }
        // 创建盒子
        $box = $(document.createElement('div'));
        $box.addClass('iconbox iconbox__close');
        if (dataBox.extraClass) {
          $box.addClass(dataBox.extraClass);
        }
        $boxTitle = $(document.createElement('label'));
        $boxTitle.addClass('iconbox-title');
        $boxTitle.text(dataBox.title)
        $box.append($boxTitle);
        // 创建盒子内图标
        for (var j = 0; j < dataBox.children.length; j++) {
          dataIcon = dataBox.children[j];
          $icon = $(document.createElement('a'));
          $icon.addClass('iconbox-a');
          $iconTitle = $(document.createElement('label'));
          $iconTitle.addClass('iconbox-icontitle');
          $iconTitle.text(dataIcon.title);
          $iconImg = $(document.createElement('img'));
          $iconImg.addClass('iconbox-img');
          $iconImg.attr('src', dataIcon.img);
          if (dataIcon.extraClass) {
            $iconImg.addClass(dataIcon.extraClass);
          }
          bindClick($icon, dataIcon, opt);
          $icon.append($iconImg);
          $icon.append($iconTitle);
          $box.append($icon);
        }
        $dd.append($box);
      }
      $(this).append($dl);
      $(this).append($pagePanel);

      // 设置各个桌面大小
      $(this).find('.icondesktop-slide').width(width).height(height);
      // 设置分页栏
      $(this).find('.icondesktop-pagination').height(opt.pageHeight).css({
        'bottom': '0px'
      });
      // 设置桌面背景颜色，用于还原的时候可恢复
      $(this).css({
        'backgroundColor': opt.closeBoxColor
      });
      // 设置盒子样式
      $(this).find('.iconbox__close').css({
        'padding': opt.closeBoxPadding,
        'width': opt.closeBoxWidth - opt.closeBoxPadding * 2 + 'px',
        'height': opt.closeBoxHeight - opt.closeBoxPadding * 2 + 'px'
      });
      // 设置盒子标题样式
      $(this).find('.iconbox-title').css({
        'height': opt.closeBoxTitleHeight, 
        'lineHeight': opt.closeBoxTitleHeight + 'px', 
        'fontSize': opt.closeBoxTitleFontSize + 'px', 
        'bottom': - opt.closeBoxTitleHeight + 'px',
        'position': 'absolute'
      });
      // 计算盒子内小图标间距，固定为九宫格排列
      var horIconInCloseBoxMargin = ((opt.closeBoxWidth - opt.closeBoxPadding * 2) / 3 - opt.thumbnailWidth) / 2;
      var verIconInCloseBoxMargin = ((opt.closeBoxHeight - opt.closeBoxPadding * 2) / 3 - opt.thumbnailHeight) / 2;
      // 设置盒子内小图标大小、外边距
      $(this).find('.iconbox__close .iconbox-a').css({
        'width': opt.thumbnailWidth + 'px', 
        'height': opt.thumbnailHeight + 'px',
        'margin': verIconInCloseBoxMargin + 'px ' + horIconInCloseBoxMargin + 'px'
      });
      // 设置盒子内最多显示9个图标
      var maxShowIconInBox = 9;
      $(this).find('.iconbox__close .iconbox-a').each(function () {
        // 此处index从1开始，why?
        if ($(this).index() > maxShowIconInBox) {
          $(this).hide();
        }
      });
      
      // 根据页数设置所有桌面的总长度
      $(this).find('.icondesktop-slidebox').width(width * pages);
      // 盒子定位
      $(this).find('.iconbox').each(function (index, element) {
        // 此处index从0开始
        // 垂直序数，从0开始
        var topIndex = Math.floor(index % pageSize / horSize);
        // 水平序数，从0开始
        var leftIndex = index % horSize;
        $(this).css({
          top: topIndex * (opt.closeBoxHeight + opt.closeBoxMargin + opt.closeBoxTitleHeight) + opt.desktopPadding + 'px', 
          left: leftIndex * (opt.closeBoxWidth + opt.closeBoxMargin) + opt.desktopPadding + 'px'
        });
      });
      // *******************************初始化状态结束*************************************

      // 打开/关闭盒子
      var openBox = {};
      var ableClick = true; // 避免多次点击动画错乱
      $(this).find('.iconbox').click(function () {
        if (ableClick) {
          ableClick = false;
        } else {
          return false;
        }
        var $this = $(this);
        if ($this.hasClass('iconbox__close')) { // 打开盒子
          $this.removeClass('iconbox__close').addClass('iconbox__open');
          openBox.top = $this.css('top');
          openBox.left = $this.css('left');
          $this.css('zIndex', 2);
          // 盒子放大
          $this.animate({  
            'backgroundColor': opt.openBoxColor,
            'width': width - opt.openBoxPadding * 2 + 'px',
            'height': height - opt.openBoxPadding * 2 + 'px',
            'left': '0',
            'top': '0',
            'padding': opt.openBoxPadding
          }, function () {
            ableClick = true;
          });
          // 放大标题
          $this.find('.iconbox-title').css({
            'height': '0px',
            'lineHeight': '0px',
            'fontSize': '0px',
            'position': ''
          }).animate({
            'height': opt.openBoxTitleHeight + 'px',
            'lineHeight': opt.openBoxTitleHeight + 'px',
            'fontSize': opt.openBoxTitleFontSize + 'px'
          });
          // 缩略图放大
          $this.find('.iconbox-a').animate({
            'width': opt.closeBoxWidth + 'px',
            'height': opt.closeBoxHeight + 'px',
            'margin': opt.openBoxIconMargin + 'px'
          });
        } else { // 关闭盒子
          $this.removeClass('iconbox__open').addClass('iconbox__close');
          // 盒子缩小
          $this.animate({
            'backgroundColor': opt.closeBoxColor,
            'width': opt.closeBoxWidth - opt.closeBoxPadding * 2 + 'px',
            'height': opt.closeBoxHeight - opt.closeBoxPadding * 2 + 'px',
            'left': openBox.left,
            'top': openBox.top,
            'padding': opt.closeBoxPadding
          }, function () {
            $this.css('zIndex', 1);
            $this.find('.iconbox-a').each(function () {
              if ($(this).index() > maxShowIconInBox) {
                $(this).hide();
              }
            });
            ableClick = true;
          });
          // 缩小标题
          $this.find('.iconbox-title').animate({
            'height': '0px',
            'lineHeight': '0px',
            'fontSize': '0px'
          }, function () {
            $(this).css({
              'height': opt.closeBoxTitleHeight + 'px',
              'lineHeight': opt.closeBoxTitleHeight + 'px',
              'fontSize': opt.closeBoxTitleFontSize + 'px',
              'bottom': - opt.closeBoxTitleHeight + 'px',
              'position': 'absolute'
            });
          });
          // 缩略图缩小
          $this.find('.iconbox-a').animate({
            'width': opt.thumbnailWidth + 'px',
            'height': opt.thumbnailHeight + 'px',
            'margin': verIconInCloseBoxMargin + 'px ' + horIconInCloseBoxMargin + 'px'
          });
        }
      });

      // 点击盒子里的图标
      $(this).find('.iconbox-a').click(function (e) {
        if ($(this).parents('.iconbox').hasClass('iconbox__open')) {
          e.stopPropagation();
        }
      });

      // 点击翻页
      var ableTurnPage = true; // 是否能够翻页
      $(this).find('.icondesktop-pageitem').click(function () {
        // index从0开始
        var pageIndex = $(this).index();
        turnPage($(this).parents('.icondesktop'), pageIndex, width, pages);
      })

      // 滑动翻页
      var mousedownX;
      var isMouseDown = false;
      var minDistance = 100;
      $(this).mousedown(function (e) {
        isMouseDown = true;
        mousedownX = e.pageX;
      });
      $(this).mousemove(function (e) {
        var currentX = e.pageX;
        if (isMouseDown) {
          if (currentX - mousedownX > minDistance) { // 有效右滑，上一页
            turnPage($(this), currentPageIndex - 1, width, pages);
            isMouseDown = false;
          } else if (currentX - mousedownX < - minDistance) { // 有效左滑，下一页
            turnPage($(this), currentPageIndex + 1, width, pages);
            isMouseDown = false;
          }
        }
      });
      $(this).mouseup(function () {
        isMouseDown = false;
      });
    });
  };

  /** 翻页 **/
  // 设置初始为第一页
  var currentPageIndex = 0;
  function turnPage($icondesktop, pageIndex, width, pages) {
    // 对于不合法的序数，不进行翻页
    if (pageIndex < 0 || pageIndex >= pages) {
      return;
    }
    currentPageIndex = pageIndex;
    $icondesktop.find('.icondesktop-slide').eq(0).animate({
      'marginLeft': - pageIndex * width + 'px'
    });
    $icondesktop.find('.icondesktop-pageitem').eq(pageIndex)
    .addClass('icondesktop-pageitem__active').siblings().removeClass('icondesktop-pageitem__active');
  }

  /** 绑定图标的点击事件 **/
  function bindClick($dom, data, opt) {
    $dom.click(function (e) {
      opt.openBoxIconClick(data, e);
    });
  }
}));