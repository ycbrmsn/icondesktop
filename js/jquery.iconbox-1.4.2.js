/**
 * 模拟手机桌面
 * @auther jzw
 * @version 1.4.1
 * @history
 *   1.0.0 完成基本功能
 *   1.0.2 加上盒子多选功能
 *   1.0.4 修复盒子关闭时可以点击里面图标的问题
 *   1.0.6 加上图标显示的最大字数的相关限制参数
 *   1.0.8 让盒子和图标可以共存
 *   1.1.0 让盒子和图标可以拖动，并且图标可以拖动到盒子里
 *   1.1.2 点击图标的标题可编辑
 *   1.1.3 重构代码
 *   1.1.4 拖动盒子互换功能加上提示
 *   1.1.6 桌面图标刷新（自动排列补齐）功能
 *   1.1.8 加上桌面水平内边距与垂直内边距、图标水平间距与垂直间距四个配置选项
 *   1.1.10 加上盒子删除功能，修改盒子多选功能配置
 *   1.1.11 修复翻页的bug
 *   调整版本号规则
 *   1.2.0 调整桌面图标刷新功能，方法名由refreshIcon改为refreshDesktop，使当前页有图标时，不再回到第一页，refreshIcon方法废弃
 *   1.3.0 新增根据data新增图标功能
 *   1.3.1 修改标题不可修改时盒子里的图标溢出的问题
 *   1.3.2 修改重复加载事件重复绑定的问题
 *   1.4.0 新增图标角标
 *   1.4.1 修改1.3.2版本出现的图标不能拖拽等问题
 *   1.4.2 修改拖动组合图标后角标未更新的问题
 */
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
      desktopHorizontalPadding: 0, // 桌面水平方向内边距，为0时与desktopPadding相同
      desktopVerticalPadding: 0, // 桌面垂直方向内边距，为0时与desktopPadding相同
      desktopAutoFill: false, // 组合/移动图标出现空缺后，桌面是否自动填满
      pageHeight: 50, // 分页栏高度
      closeBoxColor: '#8e8e8e', // 桌面背景颜色
      closeBoxBackgroundImage: 'img/iconbox.png', // 盒子的背景图片
      closeBoxWidth: 128, // 盒子关闭时的宽度
      closeBoxHeight: 0, // 盒子关闭时的高度，为0时与宽度相同
      closeBoxPadding: 10, // 盒子关闭时的内边距
      closeBoxMargin: 20, // 盒子关闭时的外边距
      closeBoxHorizontalMargin: 0, // 盒子关闭时水平方向上的外边距，为0时与closeBoxMargin相同
      closeBoxVerticalMargin: 0, // 盒子关闭时垂直方向上的外边距，为0时与closeBoxMargin相同
      closeBoxEnlargeScale: 0.05, // 盒子关闭时的放大比例
      closeBoxTitleHeight: 30, // 盒子关闭时的标题高度
      closeBoxTitleFontSize: 14, // 盒子关闭时的标题字体大小
      thumbnailWidth: 30, // 盒子关闭时里面的小图标宽度
      thumbnailHeight: 0, // 盒子关闭时里面的小图标高度，为0时与宽度相同
      openBoxColor: '#3C3C3C', // 盒子打开时的背景颜色
      openBoxTitleHeight: 40, // 盒子打开时的标题高度
      openBoxTitleFontSize: 18, // 盒子打开时的标题字体大小
      openBoxPadding: 20, // 盒子打开时的内边距
      openBoxIconMargin: 20, // 盒子打开时里面的图标的外边距
      maxChineseCharLength: 7, // 图标显示的最大字数
      ellipticalChars: '...', // 图标字数过长截取后添加的字符串
      ableEditTitle: false, // 标题是否可以修改
      ableChecked: false, // 图标是否可以多选
      ableDel: false, // 图标是否可以删除
      openBoxIconClick: function (data) {}, // 盒子打开时里面的图标点击事件
      data: [
        {
          title: '图标1',
          extraClass: '',
          children: [
            {
              title: '电子邮件',
              extraClass: 'rockicon',
              superscript: 1,
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
    // 桌面水平方向内边距，为0时与desktopPadding相同
    if (!opt.desktopHorizontalPadding) {
      opt.desktopHorizontalPadding = opt.desktopPadding;
    }
    // 桌面垂直方向内边距，为0时与desktopPadding相同
    if (!opt.desktopVerticalPadding) {
      opt.desktopVerticalPadding = opt.desktopPadding;
    }
    // 如果未设置高度，则与宽度相同
    if (!opt.closeBoxHeight) {
      opt.closeBoxHeight = opt.closeBoxWidth;
    }
    // 盒子内小图标高度为0时，与盒子内小图标宽度相同
    if (!opt.thumbnailHeight) {
      opt.thumbnailHeight = opt.thumbnailWidth;
    }
    // 盒子关闭时水平间距为0时，与closeBoxMargin相同
    if (!opt.closeBoxHorizontalMargin) {
      opt.closeBoxHorizontalMargin = opt.closeBoxMargin;
    }
    // 盒子关闭时垂直间距为0时，与closeBoxMargin相同
    if (!opt.closeBoxVerticalMargin) {
      opt.closeBoxVerticalMargin = opt.closeBoxMargin;
    }
    this.each(function () {
      // 初始化数据
      init($(this), opt);

      // 点击翻页
      $(this).off('click', '.icondesktop-pageitem').on('click', '.icondesktop-pageitem', function () {
        // index从0开始
        var pageIndex = $(this).index();
        turnPage($(this).parents('.icondesktop'), pageIndex, opt.width, opt.pages);
      })

      // 滑动翻页
      var mousedownX;
      var isMouseDown = false;
      var minDistance = 100;
      $(this).off('mousedown').on('mousedown', function (e) {
        isMouseDown = true;
        mousedownX = e.pageX;
      });
      $(this).off('mousemove').on('mousemove', function (e) {
        var currentX = e.pageX;
        if (isMouseDown) {
          if (currentX - mousedownX > minDistance) { // 有效右滑，上一页
            turnPage($(this), currentPageIndex - 1, opt.width, opt.pages);
            isMouseDown = false;
          } else if (currentX - mousedownX < - minDistance) { // 有效左滑，下一页
            turnPage($(this), currentPageIndex + 1, opt.width, opt.pages);
            isMouseDown = false;
          }
        }
      });
      $(this).off('mouseup').on('mouseup', function () {
        isMouseDown = false;
      });

      // 打开/关闭盒子
      $(this).off('click', '.iconbox').on('click', '.iconbox', function () {
        var $this = $(this);
        // 避免拖动后自动打开盒子
        var currentTime = new Date().getTime();
        if (currentTime - opt.moveIconObj.finishTime < opt.moveIconObj.openPeriod) {
          return false;
        }
        // 防止多次点击
        if (opt.ableClickBox) {
          opt.ableClickBox = false;
        } else {
          return false;
        }
        if ($this.hasClass('iconbox__close')) {
          // ***************************** 以下为打开盒子操作 ******************************
          $this.removeClass('iconbox__close').addClass('iconbox__open');
          opt.openBox.top = $this.css('top');
          opt.openBox.left = $this.css('left');
          opt.openBox.$box = $this;
          $this.css('zIndex', 5);
          // 隐藏盒子多选按钮
          $this.find('.iconbox-checkbox__parent').hide();
          // 隐藏盒子删除按钮
          $this.find('.iconbox-delbtn__parent').hide();
          // 隐藏盒子角标
          $this.find('.iconbox-superscript__parent').hide();
          // 隐藏盒子背景图片
          $this.find('.iconbox-bg').hide();
          // 隐藏盒子内标题编辑框
          $this.find('.iconbox-icontitleinput:visible').focus().blur();
          // 隐藏标题编辑输入框
          $this.find('.iconbox-icontitleinput').hide();
          // 盒子标题超长时不省略
          var $boxTitle = $this.find('.iconbox-title');
          var boxTitle = $boxTitle.attr('title');
          if (boxTitle) {
            $boxTitle.text(boxTitle);
          }
          // 盒子放大
          $this.animate({  
            'backgroundColor': opt.openBoxColor,
            'width': opt.width - opt.openBoxPadding * 2 + 'px',
            'height': opt.height - opt.openBoxPadding * 2 + 'px',
            'left': '0',
            'top': '0',
            'padding': opt.openBoxPadding
          }, function () {
            opt.ableClickBox = true;
            // 显示图标多选按钮
            $this.find('.iconbox-checkbox__children').show();
            // 显示图标删除按钮
            $this.find('.iconbox-delbtn__children').show();
            // 更新图标角标
            updateIconInBoxSuperscript($this, opt);
            // 显示盒子内图标标题
            $this.find('.iconbox-icontitle').show();
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
        } else {
          // ***************************** 以下为关闭盒子操作 ******************************
          opt.openBox.$box = null;
          $this.removeClass('iconbox__open').addClass('iconbox__close');
          // 隐藏图标多选按钮
          $this.find('.iconbox-checkbox__children').hide();
          // 隐藏图标删除按钮
          $this.find('.iconbox-delbtn__children').hide();
          // 隐藏图标角标
          $this.find('.iconbox-superscript__children').hide();
          // 隐藏盒子内标题编辑框
          $this.find('.iconbox-icontitleinput:visible').focus().blur();
          // 隐藏盒子内图标标题
          $this.find('.iconbox-icontitle').hide();
          // 盒子缩小
          $this.animate({
            'backgroundColor': opt.closeBoxColor,
            'width': opt.closeBoxWidth - opt.closeBoxPadding * 2 + 'px',
            'height': opt.closeBoxHeight - opt.closeBoxPadding * 2 + 'px',
            'left': opt.openBox.left,
            'top': opt.openBox.top,
            'padding': opt.closeBoxPadding
          }, function () {
            $this.css({
              'zIndex': 1,
              'backgroundColor': ''
            });
            // 盒子标题超长时省略
            var $boxTitle = $this.find('.iconbox-title');
            var boxShortTitle = $boxTitle.attr('shortTitle');
            if (boxShortTitle) {
              $boxTitle.text(boxShortTitle);
            }
            // 显示盒子多选按钮
            if (opt.ableChecked) {
              $this.find('.iconbox-checkbox__parent').show();
            }
            // 显示盒子删除按钮
            if (opt.ableDel) {
              $this.find('.iconbox-delbtn__parent').show();
            }
            // 更新盒子角标
            updateBoxSuperscript($this, opt);
            // 显示盒子背景图片
            $this.find('.iconbox-bg').show();
            $this.find('.iconbox-a').each(function () {
              if ($(this).index() > opt.maxShowIconInBox) {
                $(this).hide();
              }
            });
            opt.ableClickBox = true;
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
          // console.log(opt.verIconInCloseBoxMargin + 'px ' + opt.horIconInCloseBoxMargin + 'px')
          $this.find('.iconbox-a').animate({
            'width': opt.thumbnailWidth + 'px',
            'height': opt.thumbnailHeight + 'px',
            'margin': opt.verIconInCloseBoxMargin + 'px ' + opt.horIconInCloseBoxMargin + 'px'
          });
        }
      });

      // 点击盒子里的图标
      var ev = window.event || '';
      $(this).off('click', '.iconbox-a').on('click', '.iconbox-a', function (e) {
        if ($(this).parents('.iconbox').hasClass('iconbox__open')) {
          e.stopPropagation();
        }
      });

      // 阻止冒泡触发拖动事件等
      $(this).off('mousedown', '.iconbox-icontitleinput').on('mousedown', '.iconbox-icontitleinput', function (e) {
        if (opt.ableEditTitle) {
          e.stopPropagation();
        }
      });
      // 阻止冒泡触发拖动事件等
      $(this).off('mouseup', '.iconbox-icontitleinput').on('mouseup', '.iconbox-icontitleinput', function (e) {
        if (opt.ableEditTitle) {
          e.stopPropagation();
        }
      });
      // 阻止盒子标题栏点击冒泡，而图标的阻止冒泡事件写在bindTitleClick方法中
      $(this).off('click', '.iconbox-title').on('click', '.iconbox-title', function (e) {
        if (opt.ableEditTitle) {
          e.stopPropagation();
          var $titleinput = $(this).siblings('.iconbox-icontitleinput').show().focus().select();          
          if (!$(this).parent().hasClass('iconbox__open')) {
            // 如果是盒子外的标题，标题在下方
            $titleinput.css({
              'top': '',
              'bottom': - opt.closeBoxTitleHeight + 'px'
            });
          } else {
            // 如果是盒子内的标题，标题在上方
            $titleinput.css({
              'top': opt.openBoxPadding + 'px',
              'bottom': ''
            });
          }
        }
      });
      // 阻止盒子标题编辑框冒泡，图标的写在bindTitleInputClick方法中
      $(this).off('click', '.iconbox-titleinput').on('click', '.iconbox-titleinput', function (e) {
        if (opt.ableEditTitle) {
          e.stopPropagation();
        }
      });

      // 标题编辑栏失去焦点保存新标题
      $(this).off('blur', '.iconbox-icontitleinput').on('blur', '.iconbox-icontitleinput', function (e) {
        updateTitle($(this), opt, e);
      });
      $(this).off('keydown', '.iconbox-icontitleinput').on('keydown', '.iconbox-icontitleinput', function (e) {
        if (e.keyCode == 13) {
          updateTitle($(this), opt, e);
        }
      });

      // 持续按下500毫秒后生效
      var mouseDownIconDuration = 500;
      // 鼠标按下盒子/图标事件
      $(this).off('mousedown', '.icondesktopbox').on('mousedown', '.icondesktopbox', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);
        // 非打开状态按下
        if (!$this.hasClass('iconbox__open')) {
          $this.attr({
            'isMouseDownIcon': true
          });
          mouseDownIconTimeCurrent = new Date().getTime();
          opt.moveIconObj.timeout = setTimeout(function () {
            // 生成一个半透明的指示位置图标
            var $flagDom = $($this.clone());
            $flagDom.removeClass('icondesktopbox');
            opt.moveIconObj.$flagDom = $flagDom;
            // 指示位置图标透明度
            $flagDom.css('opacity', 0.3);
            // 拖动图标在指示位置图标之上
            $this.css({'zIndex': 10});
            // 指示位置图标加入到dom中
            $this.parents('.icondesktop-slide').append($flagDom);
            // ********************* 拖动状态下的盒子/图标变化 开始 ***********************
            // 盒子稍微放大
            var iconLeft = parseInt($this.css('left'));
            var iconTop = parseInt($this.css('top'));
            var iconWidth = parseInt($this.css('width'));
            var iconHeight = parseInt($this.css('height'));
            var iconWidthChange = Math.ceil(iconWidth * opt.closeBoxEnlargeScale);
            var iconHeightChange = Math.ceil(iconHeight * opt.closeBoxEnlargeScale);
            // TODO 此处可能有问题
            $this.attr({
              'isMouseDownMove': true,
              'prevLeft': iconLeft + 'px',
              'prevTop': iconTop + 'px',
              'prevWidth': iconWidth + 'px',
              'prevHeight': iconHeight + 'px'
            }).css({
              'cursor': 'move',
              'left': iconLeft - iconWidthChange + 'px',
              'top': iconTop - iconHeightChange + 'px',
            });
            if ($this.hasClass('iconbox-a')) {
              // 如果是图标，则调整图标大小
              $this.css({
                'width': iconWidth + iconWidthChange * 2 + 'px',
                'height': iconHeight + iconHeightChange * 2 + 'px'
              });
            } else {
              // 如果是盒子，则调整盒子的内边距
              $this.css({
                'padding': opt.closeBoxPadding + iconWidthChange + 'px'
              });
            }
            // ********************* 拖动状态下的盒子/图标变化 结束 ***********************
          }, mouseDownIconDuration);
        }
      });
      // 鼠标拖动盒子/图标事件
      $(this).off('mousemove', '.icondesktopbox').on('mousemove', '.icondesktopbox', function (e) {
        if (ev) {
          ev.returnValue = false
        }
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);
        // 移动盒子/图标
        moveIcon($this, opt, e);
      });
      $(this).off('mouseup', '.icondesktopbox').on('mouseup', '.icondesktopbox', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);
        // 取消盒子/图标移动
        cancelIconMove($this, opt);
      });
      $(this).off('mouseleave', '.icondesktopbox').on('mouseleave', '.icondesktopbox', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);
        // 取消盒子/图标移动
        cancelIconMove($this, opt);
      });
    });
    var $root = $(this);
    return {
      // 获得所有选中的图标的数据
      getCheckedData: function () {
        var checkedData = [];
        if (!opt.ableChecked) {
          // 如果不可选择，则返回空数组
          return checkedData;
        }
        for (var i = 0; i < opt.data.length; i++) {
          var element = opt.data[i];
          // 判断是否是盒子
          if (element.img) {
            // 是图标则判断是否选中
            if (element.checked) {
              checkedData.push(element);
            }
          } else {
            // 是盒子，则循环里面的内容
            for (var j = 0; j < element.children.length; j++) {
              var iconObj = element.children[j];
              // 判断图标是否选中
              if (iconObj.checked) {
                checkedData.push(iconObj);
              }
            }
          }
        }
        return checkedData;
      },
      // 获得data
      getData: function () {
        var allData = jQuery.extend(true, {}, opt.data);
        return allData;
      },
      // 桌面图标自动补齐刷新，1.2.0版本开始，此方法废弃
      refreshIcon: function () {
        refreshDesktop($root, opt);
      },
      // 刷新桌面
      refreshDesktop: function () {
        refreshDesktop($root, opt);
      },
      /**
       * 新增图标
       * @param {Object}  data        icon的数据{title, extraClass, img...}
       * @param {Boolean} isOnDesktop 是否在桌面最后插入图标，如果不是，则根据当前位置插入图标
       */
      addIcons: function (data, isOnDesktop) {
        addIcons($root, opt, data, isOnDesktop);
      }
    }
  };

  /**
   * 初始化数据
   * @param  {[type]} $root [description]
   * @param  {[type]} opt   [description]
   * @return {[type]}       [description]
   */
  function initData($root, opt) {
    var width = $root.width();
    var height = $root.height();
    opt.width = width;
    opt.height = height;
    // 计算水平可以放几个盒子
    // (桌面宽度 - 桌面左右的内边距 + 图标之间的水平外边距) / (图标的宽度 + 图标的水平外边距)
    var horSize = Math.floor((width - opt.desktopHorizontalPadding * 2 + opt.closeBoxHorizontalMargin) / (opt.closeBoxWidth + opt.closeBoxHorizontalMargin));
    // 计算垂直方向可以放几个盒子
    // (桌面高度 - 分页栏高度 - 上边桌面的内边距 + 图标之间的垂直外边距) / (图标高度 + 图标名称 + 图标垂直外边距)
    var verSize = Math.floor((height - opt.pageHeight - opt.desktopVerticalPadding + opt.closeBoxVerticalMargin) / (opt.closeBoxHeight + opt.closeBoxTitleHeight + opt.closeBoxVerticalMargin));
    // 一页的盒子数量
    var pageSize = horSize * verSize;
    // 页数
    var pages = Math.ceil(opt.data.length / pageSize);
    opt.horSize = horSize;
    opt.verSize = verSize;
    opt.pageSize = pageSize;
    opt.pages = pages;

    // 计算盒子内小图标间距，固定为九宫格排列
    var horIconInCloseBoxMargin = ((opt.closeBoxWidth - opt.closeBoxPadding * 2) / 3 - opt.thumbnailWidth) / 2;
    var verIconInCloseBoxMargin = ((opt.closeBoxHeight - opt.closeBoxPadding * 2) / 3 - opt.thumbnailHeight) / 2;
    opt.horIconInCloseBoxMargin = horIconInCloseBoxMargin;
    opt.verIconInCloseBoxMargin = verIconInCloseBoxMargin;

    // 拖动桌面上的盒子或者图标
    var moveIconObj = {
      // 鼠标按下时的位置，取mousemove中的数据
      mouseDownIconCurrentPoint: {},
      // 前一次鼠标按下时的位置，取mousemove中的数据
      mouseDownIconPrevPoint: {},
      // 结束拖动盒子/图标的时间
      finishTime: 0,
      // 拖动盒子/图标后能够打开盒子的时间间隔100毫秒
      openPeriod: 100,
      // 一个空jquery对象，用来置空对比的下方icon
      $empty: $(''),
      // 拖动对象是否位于一个盒子/图标上
      isSuspended: false,
      // 盒子放大单边需要增加的宽度
      closeBoxEnlargeWidth: opt.closeBoxWidth * opt.closeBoxEnlargeScale,
      // 盒子放大单边需要增加的高度u
      closeBoxEnlargeHeight: opt.closeBoxHeight * opt.closeBoxEnlargeScale,
      // 图标组合时显示的盒子框
      $closeBoxBackground: $('<img src="' + opt.closeBoxBackgroundImage + '" class="iconbox-bg" width="'
        + opt.closeBoxWidth + '" height="' + opt.closeBoxHeight + '" style="display: none;">')
    };
    moveIconObj.$prevIconBelow = moveIconObj.$empty;
    opt.moveIconObj = moveIconObj;

    // 设置盒子内最多显示9个图标，第一个为superscript, 第二个为delbtn, 第三个为checkbox，第四个为input，第五个为label，第六个为盒子背景
    var otherThingNumInBox = 6;
    opt.otherThingNumInBox = otherThingNumInBox;
    var maxShowIconInBox = 8 + opt.otherThingNumInBox;
    opt.maxShowIconInBox = maxShowIconInBox;

    // 是否能够点击盒子，避免多次点击动画错乱
    opt.ableClickBox = true;

    opt.openBox = {};
  }

  /**
   * 构造图标
   * @param  {[type]} opt         [description]
   * @param  {[type]} checkboxObj [description]
   * @param  {[type]} dataIcon    [description]
   * @param  {[type]} dataBox     [description]
   * @return {[type]}             [description]
   */
  function constructIcon(opt, checkboxObj, dataIcon, dataBox) {
    var $icon = $(document.createElement('a'));
    $icon.addClass('iconbox-a');
    if (!dataBox) {
      $icon.addClass('icondesktopbox');
    }
    var $iconTitle = $(document.createElement('label'));
    $iconTitle.addClass('iconbox-icontitle');
    // 处理标题
    handleOverMaxLengthText($iconTitle, dataIcon.title, opt.maxChineseCharLength, opt.ellipticalChars);
    var $iconImg = $(document.createElement('img'));
    $iconImg.addClass('iconbox-img');
    $iconImg.attr('src', dataIcon.img);
    if (dataIcon.extraClass) {
      $iconImg.addClass(dataIcon.extraClass);
    }
    if (opt.ableChecked) {
      // 如果图标可选，加上多选按钮
      var $checkboxChildren = $('<a class="iconbox-checkbox iconbox-checkbox__children"></a>');
      if (dataBox) {
        $checkboxChildren.hide();
      }
      $icon.append($checkboxChildren);
      bindCheckboxClick($checkboxChildren, dataIcon, dataBox);
      // 如果是选中
      if (dataIcon.checked) {
        changeCheckboxFlagAndView($checkboxChildren, 2);
        if (checkboxObj) {
          checkboxObj.size++;
        }
      } else {
        changeCheckboxFlagAndView($checkboxChildren, 0);
      }
    }
    if (opt.ableDel) {
      // 如果图标可删除，则加上删除按钮
      var $delBtn = $('<a class="iconbox-delbtn iconbox-delbtn__children"></a>');
      if (dataBox) {
        $delBtn.hide();
      }
      $icon.append($delBtn);
      bindDelBtnClick($delBtn, opt);
    }
    var $superscript = $('<a class="iconbox-superscript iconbox-superscript__children"></a>');
    $icon.append($superscript);
    // 更新角标
    updateIconSuperscript($icon, opt, dataIcon);

    bindClick($icon, dataIcon, opt);
    $icon.append($iconImg);
    $icon.append($iconTitle);
    if (opt.ableEditTitle) {
      // 如果能够编辑标题，则加上单行文本框
      var $iconTitleInput = $('<input type="text" class="iconbox-icontitleinput" value="' + dataIcon.title + '">');
      $icon.append($iconTitleInput);
      bindTitleClick($iconTitle, opt);
      bindTitleInputClick($iconTitleInput, opt);
    }
    return $icon;
  }

  /**
   * 创建盒子
   * @param  {[type]} opt         [description]
   * @param  {[type]} dataBox     [description]
   * @return {[type]}             [description]
   */
  function constructBox(opt, dataBox) {
    var $box = $(document.createElement('div'));
    $box.addClass('iconbox iconbox__close icondesktopbox');
    if (dataBox.extraClass) {
      $box.addClass(dataBox.extraClass);
    }
    var $boxTitle = $(document.createElement('label'));
    $boxTitle.addClass('iconbox-title');
    // 处理标题
    handleOverMaxLengthText($boxTitle, dataBox.title, opt.maxChineseCharLength, opt.ellipticalChars);
    $box.append($boxTitle);
    // 编辑标题单行文本框
    var $iconTitleInput = $('<input type="text" class="iconbox-icontitleinput iconbox-titleinput" value="' + dataBox.title + '">');
    $box.append($iconTitleInput);
    // 添加盒子背景
    var $backgroundIcon = $('<img src="' + opt.closeBoxBackgroundImage + '" width="100%" height="100%" class="iconbox-bg">');
    $box.append($backgroundIcon);
    // 创建盒子内图标
    var checkboxObj = {
      size: 0
    }
    for (var j = 0; j < dataBox.children.length; j++) {
      dataIcon = dataBox.children[j];
      // 创建图标
      var $icon = constructIcon(opt, checkboxObj, dataIcon, dataBox);
      $box.append($icon);
    }
    
    // 多选按钮
    var $checkbox = $('<a class="iconbox-checkbox iconbox-checkbox__parent"></a>');
    $box.prepend($checkbox);
    if (opt.ableChecked) {
      // 盒子可以选中，则绑定多选事件
      bindCheckboxClick($checkbox, dataBox);
      // checkboxObj.size只会小于等于dataBox.children.length
      if (checkboxObj.size == dataBox.children.length) {
        changeCheckboxFlagAndView($checkbox, 2);
      } else if (checkboxObj.size > 0) {
        changeCheckboxFlagAndView($checkbox, 1);
      }
    } else {
      // 盒子不能选中，则隐藏多选按钮
      $checkbox.hide();
    }
    // 删除按钮
    var $delBtn = $('<a class="iconbox-delbtn iconbox-delbtn__parent"></a>');
    $box.prepend($delBtn);
    if (opt.ableDel) {
      // 如果图标可删除，则绑定删除事件
      bindDelBtnClick($delBtn, opt);
    } else {
      // 如果图标不可删除，则隐藏删除按钮
      $delBtn.hide();
    }
    // 角标
    var $superscript = $('<a class="iconbox-superscript iconbox-superscript__parent"></a>');
    $box.prepend($superscript);
    // 更新角标
    updateBoxSuperscript($box, opt, dataBox);
    // 隐藏盒子里图标的角标
    $box.find('.iconbox-superscript__children').hide();
    return $box;
  }

  /**
   * 初始化所有节点
   * @param  {[type]} $root       [description]
   * @param  {[type]} opt         [description]
   * @return {[type]}             [description]
   */
  function initDoms($root, opt) {
    var $dl = $(document.createElement('dl'));
    $dl.addClass('icondesktop-slidebox');
    var $pagePanel = $(document.createElement('div'));
    $pagePanel.addClass('icondesktop-pagination');
    var $pageBox = $(document.createElement('div'));
    $pageBox.addClass('icondesktop-pagebox');
    $pagePanel.append($pageBox);
    for (var i = 0; i < opt.data.length; i++) {
      var dataBox = opt.data[i];
      // 下一页
      if (i % opt.pageSize === 0) {
        // 创建新桌面
        var $dd = $(document.createElement('dd'));
        $dd.addClass('icondesktop-slide');
        $dl.append($dd);
        // 创建页码图标
        var $pageNum = $(document.createElement('a'));
        $pageNum.addClass('icondesktop-pageitem');
        if (i === 0) {
          $pageNum.addClass('icondesktop-pageitem__active');
        }
        // $pageNum.text(Math.ceil(i / pageSize));
        $pageBox.append($pageNum);
      }
      // 如果是盒子，则创建盒子；如果是图标，则创建图标
      if (dataBox.img) {
        // 是图标
        dataIcon = dataBox;
        // 创建图标
        var $icon = constructIcon(opt, null, dataIcon);
        $dd.append($icon);
      } else {
        // 是盒子，则创建盒子
        var $box = constructBox(opt, dataBox);
        $dd.append($box);
      }
    }
    // 清空节点
    $root.empty();
    // 添加桌面
    $root.append($dl);
    // 添加分页栏
    $root.append($pagePanel);
    $root.find('.icondesktop-slidebox').append(opt.moveIconObj.$closeBoxBackground);
  }

  /**
   * 初始化所有样式
   * @param  {[type]} $root [description]
   * @param  {[type]} opt   [description]
   * @return {[type]}       [description]
   */
  function initStyles($root, opt) {
    // 设置各个桌面大小
    $root.find('.icondesktop-slide').width(opt.width).height(opt.height);
    // 设置分页栏高度
    $root.find('.icondesktop-pagination').height(opt.pageHeight).css({
      'bottom': '0px'
    });
    // 设置桌面背景颜色，用于还原的时候可恢复
    $root.css({
      'backgroundColor': opt.closeBoxColor
    });
    // 设置盒子及相关样式
    setBoxStyle($root.find('.iconbox__close'), opt);
    // 设置所有标题样式
    setTitleStyle($root, opt);
    // 设置桌面图标样式
    $root.find('.iconbox-a.icondesktopbox').css({
      'width': opt.closeBoxWidth + 'px',
      'height': opt.closeBoxHeight + 'px'
    });
    // 设置盒子内最多显示9个图标，第一个为checkbox，第二个为input，第三个为label，第四个为盒子背景
    $root.find('.iconbox__close .iconbox-a').each(function () {
      // 此处index从0开始
      if ($(this).index() > opt.maxShowIconInBox) {
        $(this).hide();
      }
    });
    
    // 根据页数设置所有桌面的总长度
    $root.find('.icondesktop-slidebox').width(opt.width * opt.pages);
    // 盒子/图标定位
    $root.find('.icondesktopbox').each(function (index, element) {
      // 此处index从0开始
      // 垂直序数，从0开始
      var topIndex = Math.floor(index % opt.pageSize / opt.horSize);
      // 水平序数，从0开始
      var leftIndex = index % opt.horSize;
      $(this).css({
        top: topIndex * (opt.closeBoxHeight + opt.closeBoxVerticalMargin + opt.closeBoxTitleHeight) + opt.desktopVerticalPadding + 'px', 
        left: leftIndex * (opt.closeBoxWidth + opt.closeBoxHorizontalMargin) + opt.desktopHorizontalPadding + 'px'
      });
    });
  }

  function setBoxStyle($box, opt) {
    // 设置盒子样式
    $box.css({
      'padding': opt.closeBoxPadding,
      'width': opt.closeBoxWidth - opt.closeBoxPadding * 2 + 'px',
      'height': opt.closeBoxHeight - opt.closeBoxPadding * 2 + 'px'
    });
    // 设置盒子内小图标大小、外边距
    $box.find('.iconbox-a').css({
      'width': opt.thumbnailWidth + 'px', 
      'height': opt.thumbnailHeight + 'px',
      'margin': opt.verIconInCloseBoxMargin + 'px ' + opt.horIconInCloseBoxMargin + 'px'
    });
  }

  function setTitleStyle($dom, opt) {
    // 设置标题样式
    $dom.find('.iconbox-title,.iconbox-icontitle,.iconbox-icontitleinput').css({
      'height': opt.closeBoxTitleHeight, 
      'lineHeight': opt.closeBoxTitleHeight + 'px', 
      'fontSize': opt.closeBoxTitleFontSize + 'px', 
      'bottom': - opt.closeBoxTitleHeight + 'px',
      'position': 'absolute',
      'left': 0
    });
  }

  /** 翻页 **/
  // 设置初始为第一页
  var currentPageIndex = 0;
  function turnPage($icondesktop, pageIndex, width, pages) {
    // 对于不合法的序数，不进行翻页
    if (pageIndex < 0 || pageIndex >= pages) {
      return;
    }
    currentPageIndex = pageIndex;
    // 页码移动
    $icondesktop.find('.icondesktop-slidebox').animate({
      'marginLeft': - pageIndex * width + 'px'
    });
    // 修改页码样式
    $icondesktop.find('.icondesktop-pageitem').eq(pageIndex)
    .addClass('icondesktop-pageitem__active').siblings().removeClass('icondesktop-pageitem__active');
  }

  /**
   * 改变多选按钮的状态
   * @param  {[type]} $checkbox [description]
   * @param  {[type]} flag      0:不选;1:有选;2:全选
   * @return {[type]}           [void]
   */
  function changeCheckboxFlagAndView($checkbox, flag) {
    if (flag == 0) {
      $checkbox.removeClass('iconbox-checkbox__checksome').removeClass('iconbox-checkbox__checked');
    } else if (flag == 1) {
      $checkbox.addClass('iconbox-checkbox__checksome').removeClass('iconbox-checkbox__checked');
    } else if (flag == 2) {
      $checkbox.addClass('iconbox-checkbox__checked').removeClass('iconbox-checkbox__checksome');
    }
  }

  /** 转化为中文后的字体长度 **/
  function covertToZhTextLength(text) {
    var wholeText = text.replace(/^\s*/g, '').replace(/\s*$/g, '');
    // 去掉中文、全角后的字符串
    var noChineseText = wholeText.replace(/[^\x00-\xff]/g, '');
    // 中文字符串的长度
    var chineseTextLength = wholeText.length - noChineseText.length;
    // 换算成中文后的字符串总长度，比例为目测得出，ie8下可能会有少许出入
    var textLength = chineseTextLength + noChineseText.length / 20 * 11;
    return textLength;
  }

  /**
   * 获得省略后的标题
   * @param  {[type]} $dom                 [description]
   * @param  {[type]} title                [description]
   * @param  {[type]} maxChineseCharLength [description]
   * @param  {[type]} ellipticalChars      [description]
   * @return {[type]}                      [description]
   */
  function getOverMaxShortText($dom, title, maxChineseCharLength, ellipticalChars) {
    var shortTitle = '';
    // 换算为中文后的字数
    var textLength = covertToZhTextLength(title);
    var ellipticalLength = Math.ceil(covertToZhTextLength(ellipticalChars));
    // 如果字数大于最大字数，则简单处理
    if (textLength > maxChineseCharLength) {
      shortTitle = title.substring(0, maxChineseCharLength - ellipticalLength) + ellipticalChars;
    }
    return shortTitle;
  }

  /**
   * 处理超出中文最大长度的title
   * @param  {[type]} $dom                 [description]
   * @param  {[type]} title                标题
   * @param  {[type]} maxChineseCharLength 最大中文长度
   * @param  {[type]} ellipticalChars      省略追加字符串
   * @return {[type]}                      [void]
   */
  function handleOverMaxLengthText($dom, title, maxChineseCharLength, ellipticalChars) {
    var shortTitle = getOverMaxShortText($dom, title, maxChineseCharLength, ellipticalChars);
    if (shortTitle) {
      $dom.attr({
        'title': title,
        'shortTitle': shortTitle
      });
      if ($dom.parent().hasClass('iconbox__open')) {
        // 如果标题是在打开的盒子内，则标题不省略
        $dom.text(title);
      } else {
        // 如果标题是在桌面上，则省略
        $dom.text(shortTitle);
      }
    } else {
      $dom.text(title);
    }
  }

  function updateTitle($this, opt, e) {
    if (opt.ableEditTitle) {
      if (e) {
        e.stopPropagation();
      }
      var text = $this.val();
      var $iconTitle = $this.siblings('.iconbox-icontitle,.iconbox-title');
      handleOverMaxLengthText($iconTitle, text, opt.maxChineseCharLength, opt.ellipticalChars);
      $this.hide();
      // $iconTitle.show();
      // 更新data
      var data = getIconData($this.parent(), opt);
      data.title = text;
    }
  }

  /**
   * 移动图标
   * @param  {[type]} $this [description]
   * @param  {[type]} opt   [description]
   * @param  {[type]} e     [description]
   * @return {[type]}       [description]
   */
  function moveIcon($this, opt, e) {
    var moveIconObj = opt.moveIconObj;
    // 图标处于在移动状态
    if ($this.attr('isMouseDownMove')) {
      moveIconObj.mouseDownIconCurrentPoint.x = e.pageX;
      moveIconObj.mouseDownIconCurrentPoint.y = e.pageY;
      // 更新盒子/图标的移动位置
      $this.css({
        'left': parseInt($this.css('left')) + moveIconObj.mouseDownIconCurrentPoint.x - moveIconObj.mouseDownIconPrevPoint.x + 'px',
        'top': parseInt($this.css('top')) + moveIconObj.mouseDownIconCurrentPoint.y - moveIconObj.mouseDownIconPrevPoint.y + 'px'
      });
      if (!moveIconObj.iconInterval) {
        // 如果没有开启检查盒子/图标所在位置区域的定时器，则开启，固定为500毫秒检测一次所在位置区域
        moveIconObj.iconInterval = setInterval(function () {
          // 获取盒子/图标所在位置区域的盒子/图标，即被遮挡处在下方的盒子/图标
          var $iconBelow = getIconBelow($this);
          moveIconObj.$iconBelow = $iconBelow;
          if (!$iconBelow) {
            // 如果此时不存在盒子/图标，说明没有在其他盒子/图标上，则恢复之前被遮挡的盒子/图标的状态，并显示指示位置图标
            recoverIconBelow($this, opt);
            // 删除被遮挡物体的指示图标
            removeFlagDomBelow(moveIconObj);
            moveIconObj.$flagDom.show();
          } else if ($iconBelow.css('left') != moveIconObj.$prevIconBelow.css('left')
            || $iconBelow.css('top') != moveIconObj.$prevIconBelow.css('top')) {
            // console.log($iconBelow.css('left') + '---' + moveIconObj.$prevIconBelow.css('left'))
            // 如果当前被遮挡的盒子/图标与之前的不同，则说明进入了一个盒子/图标的范围，此时是通过前后图标的位置来确定的
            // 恢复状态，避免定时器间隔过长，间隔中发生过多变化，导致响应结果不正确
            recoverIconBelow($this, opt, true);
            
            // 设置当前图标处于悬浮状态
            moveIconObj.isSuspended = true;
            moveIconObj.$prevIconBelow = $iconBelow;
            if ($this.hasClass('iconbox__close')) {
              // 如果被拖动物体是一个盒子
              // 删除被遮挡物体的指示图标
              removeFlagDomBelow(moveIconObj);
              // 创建一个被遮挡的图标的指示位置图标
              var $flagDomBelow = $($iconBelow.clone());
              $flagDomBelow.removeClass('icondesktopbox');
              moveIconObj.$flagDomBelow = $flagDomBelow;
              // 指示位置图标透明度
              $flagDomBelow.css('opacity', 0.3);
              // 指示位置图标加入到dom中
              $this.parents('.icondesktop-slide').append($flagDomBelow);
              // 指示位置图标移动到拖动物体的原位置
              $flagDomBelow.stop().animate({
                'left': $this.attr('prevLeft'),
                'top': $this.attr('prevTop')
              });
              // 隐藏指示位置图标
              moveIconObj.$flagDom.hide();
            } else if ($iconBelow.hasClass('iconbox-a')) {
              // 如果是在一个图标上方，则图标加一个放大的盒子框
              // 提高高度，是图标置于盒子框的上方
              $iconBelow.css({'zIndex': 2});
              moveIconObj.$closeBoxBackground.css({
                'left': $iconBelow.css('left'),
                'top': $iconBelow.css('top'),
                'width': opt.closeBoxWidth + 'px',
                'height': opt.closeBoxHeight + 'px',
                'display': 'block'
              }).stop().animate({
                'left': parseInt($iconBelow.css('left')) - moveIconObj.closeBoxEnlargeWidth + 'px',
                'top': parseInt($iconBelow.css('top')) - moveIconObj.closeBoxEnlargeHeight + 'px',
                'width': opt.closeBoxWidth + moveIconObj.closeBoxEnlargeWidth * 2 + 'px',
                'height': opt.closeBoxHeight + moveIconObj.closeBoxEnlargeHeight * 2 + 'px'
              }, 'fast');
              // 隐藏指示位置图标
              moveIconObj.$flagDom.hide();
            } else if ($iconBelow.hasClass('iconbox__close')) {
              // 如果是在一个盒子上方，则盒子放大
              var iconLeft = parseInt($iconBelow.css('left'));
              var iconTop = parseInt($iconBelow.css('top'));
              var iconWidth = parseInt($iconBelow.css('width'));
              var iconHeight = parseInt($iconBelow.css('height'));
              // var iconWidthChange = Math.ceil(iconWidth * opt.closeBoxEnlargeScale);
              // var iconHeightChange = Math.ceil(iconHeight * opt.closeBoxEnlargeScale);
              // 先记录盒子的当前状态，然后再变换，便于恢复
              $iconBelow.attr({
                'prevLeft': iconLeft + 'px',
                'prevTop': iconTop + 'px',
                'prevWidth': iconWidth + 'px',
                'prevHeight': iconHeight + 'px'
              }).animate({
                'left': iconLeft - moveIconObj.closeBoxEnlargeWidth + 'px',
                'top': iconTop - moveIconObj.closeBoxEnlargeHeight + 'px',
                'padding': opt.closeBoxPadding + moveIconObj.closeBoxEnlargeWidth + 'px'
              }, 'fast');
              // 隐藏指示位置图标
              moveIconObj.$flagDom.hide();
            }
          }
        }, 500);
      }
    }
    moveIconObj.mouseDownIconPrevPoint.x = e.pageX;
    moveIconObj.mouseDownIconPrevPoint.y = e.pageY;
  }

  /**
   * 取消移动
   * @param  {[type]} $this       [description]
   * @param  {[type]} opt         [description]
   * @return {[type]}             [description]
   */
  function cancelIconMove($this, opt) {
    var moveIconObj = opt.moveIconObj;
    // 是否鼠标按下
    if ($this.attr('isMouseDownIcon')) {
      $this.attr({
        'isMouseDownIcon': ''
      });
      clearTimeout(moveIconObj.timeout);
      // 是否处于拖动状态
      if ($this.attr('isMouseDownMove')) {
        $this.attr({
          'isMouseDownMove': ''
        });
        // 判断是否处于特定位置特定状态
        var moveFlag = 0;
        // 如果是，则作特殊变换
        var $iconBelow = moveIconObj.$iconBelow;
        if (moveIconObj.isSuspended && $iconBelow) {
          // 如果拖动盒子/图标处于悬浮状态
          if ($this.hasClass('iconbox__close')) {
            // 如果被拖动物体是一个盒子，则交换位置
            exchangeData(opt.data, getIconIndex($this), getIconIndex($iconBelow));
            exchangeDoms($this, $iconBelow, opt);
            moveFlag = 1;
          } else {
            // 如果被拖动物体是一个图标，则进行分组
            var dstData = groupData(opt.data, getIconIndex($this), getIconIndex($iconBelow));
            // 此处$this与$iconBelow被删除重新创建，所以重新赋值
            $groupObj = groupDoms($this, $iconBelow, opt, dstData);
            $this = $groupObj.$this;
            $iconBelow = $groupObj.$iconBelow;
            recoverIconBelow($this, opt);
            moveFlag = 2;
          }
        } else {
          // 如果不是，则还原
          if ($this.hasClass('iconbox-a')) {
            // 如果是图标，则调整图标大小
            $this.animate({
              'left': $this.attr('prevLeft'),
              'top': $this.attr('prevTop'),
              'width': $this.attr('prevWidth'),
              'height': $this.attr('prevHeight')
            }, {
              'duration': 'fast',
              'easing': 'swing',
              'step': function () {
                $this.css('overflow', 'visible');
              },
              'complete': function () {
                $this.css({
                  'cursor': 'pointer',
                  'zIndex': 1
                });
              }
            });
          } else if ($this.hasClass('iconbox__close')) {
            // 如果是盒子，则调整盒子的内边距
            $this.animate({
              'left': $this.attr('prevLeft'),
              'top': $this.attr('prevTop'),
              'padding': opt.closeBoxPadding + 'px'
            }, 'fast', 'swing', function () {
              $this.css({
                'cursor': 'pointer',
                'zIndex': 1
              });
            });
          }
          recoverIconBelow($this, opt, true);
        }
        moveIconObj.finishTime = new Date().getTime();
        // 删除拖动物体的指示图标
        if (moveIconObj.$flagDom) {
          moveIconObj.$flagDom.remove();
          moveIconObj.$flagDom = null;
        }
        // 删除遮挡物体的指示图标
        removeFlagDomBelow(moveIconObj);
        // 如果判断是否有下方图标的定时器开着，则关闭，并置空对应对象
        if (moveIconObj.iconInterval) {
          clearInterval(moveIconObj.iconInterval);
          moveIconObj.iconInterval = null;

          moveIconObj.$prevIconBelow = moveIconObj.$empty;
          moveIconObj.isSuspended = false;
        }
        if (opt.desktopAutoFill && moveFlag) {
          refreshDesktop($this.parents('.icondesktop'), opt);
        }
      }
    }
  }

  function removeFlagDomBelow(moveIconObj) {
    if (moveIconObj.$flagDomBelow) {
      moveIconObj.$flagDomBelow.remove();
      moveIconObj.$flagDomBelow = null;
    }
  }

  /**
   * 恢复下方盒子/图标的变大效果
   * @param  {[type]} $this      [description]
   * @param  {[type]} opt        [description]
   * @param  {[type]} onlyEffect [description]
   * @return {[type]}            [description]
   */
  function recoverIconBelow($this, opt, onlyEffect) {
    var moveIconObj = opt.moveIconObj;
    // 隐藏悬浮在图标上时出现的盒子背景
    moveIconObj.$closeBoxBackground.hide();
    // 盒子背景还原
    // $this.parents('.icondesktop-slide').find('.iconbox__close').each(function (index, element) {
    //   if ($(this).attr('prevLeft')) {
    //     $(this).stop().css({
    //       'left': $(this).attr('prevLeft'),
    //       'top': $(this).attr('prevTop'),
    //       'padding': opt.closeBoxPadding + 'px'
    //     })/*.attr({
    //       'prevLeft': '',
    //       'prevTop': ''
    //     })*/;
    //   }
    // });
    var $prevIconBelow = moveIconObj.$prevIconBelow;
    if ($prevIconBelow.hasClass('iconbox__close') && $prevIconBelow.attr('prevLeft')) {
      // 如果是盒子，并且记录有之前的位置信息，则恢复
      $prevIconBelow.stop().css({
        'left': $prevIconBelow.attr('prevLeft'),
        'top': $prevIconBelow.attr('prevTop'),
        'padding': opt.closeBoxPadding + 'px'
      });
    }
    if (!onlyEffect) {
      moveIconObj.$prevIconBelow = moveIconObj.$empty;
      moveIconObj.isSuspended = false;
    }
  }

  function getSeparateLocations($dom) {
    
  }

  /**
   * 获得当前图标所在桌面的其他图标的位置数组
   * @param  {[type]} $icon [description]
   * @return {[type]}       [description]
   */
  function getOtherIconLocations($icon) {
    var $desktop = $icon.parents('.icondesktop-slide');
    var icons = [];
    $icon.siblings('.icondesktopbox').each(function (index, element) {
      var left = parseInt($(this).css('left'));
      var top = parseInt($(this).css('top'));
      var width = parseInt($(this).css('width'));
      var height = parseInt($(this).css('height'));
      icons.push({
        'left': left,
        'top': top,
        'right': left + width,
        'bottom': top + height,
        '$icon': $(this)
      });
    });
    return icons;
  }

  /**
   * 获得当前图标下方的图标，没有则返回null
   * @param  {[type]} $icon [description]
   * @return {[type]}       [description]
   */
  function getIconBelow($icon) {
    var icons = getOtherIconLocations($icon);
    // 查询当前图标的中心点
    var centerPointX = parseInt($icon.css('left')) + parseInt($icon.css('width')) / 2;
    var centerPointY = parseInt($icon.css('top')) + parseInt($icon.css('height')) / 2;
    // 循环判断该中心点是否在其他图标的范围内
    for (var i = 0; i < icons.length; i++) {
      var icon = icons[i];
      if (centerPointX > icon.left && centerPointX < icon.right && centerPointY > icon.top && centerPointY < icon.bottom) {
        return icon.$icon;
      }
    }
    return null;
  }

  /**
   * 获得图标在data中的序数
   * @param  {[type]} $icon [description]
   * @return {[type]}       [description]
   */
  function getIconIndex($icon) {
    var $desktop = $icon.parents('.icondesktop-slide');
    var desktopIndex = $desktop.index();
    var iconIndex = 0;
    $desktop.prevAll('.icondesktop-slide').each(function (index, element) {
      iconIndex += $(this).children('.icondesktopbox').size();
    });
    iconIndex += $icon.index();
    return iconIndex;
  }

  /**
   * 获得图标在盒子中的序数
   * @param  {[type]} $icon [description]
   * @param  {[type]} opt   [description]
   * @return {[type]}       [description]
   */
  function getIconChildIndex($icon, opt) {
    // 目前是三个其他图标
    return $icon.index() - opt.otherThingNumInBox;
  }

  /**
   * 获得图标对应的data
   * @param  {[type]} $icon [description]
   * @param  {[type]} opt   [description]
   * @return {[type]}       [description]
   */
  function getIconData($icon, opt) {
    var srcData = opt.data;
    var data;
    if ($icon.hasClass('icondesktopbox')) {
      // 如果是第一层盒子/图标
      data = srcData[getIconIndex($icon)];
    } else {
      // 如果是盒子里面的图标
      // 第一层
      data = srcData[getIconIndex($icon.parent())];
      // 第二层
      data = data.children[getIconChildIndex($icon, opt)];
    }
    return data;
  }

  /**
   * 删除图标对应的data
   * @param  {[type]} $icon [description]
   * @param  {[type]} opt   [description]
   * @return {[type]}       [description]
   */
  function delIconData($icon, opt) {
    var srcData = opt.data;
    if ($icon.hasClass('icondesktopbox')) {
      // 如果是第一层盒子/图标
      var index = getIconIndex($icon);
      srcData.splice(index, 1);
    } else {
      // 如果是盒子里面的图标
      // 第一层
      var data = srcData[getIconIndex($icon.parent())];
      // 第二层
      var index = getIconChildIndex($icon, opt);
      data.children.splice(index, 1);
    }
  }

  /**
   * 合并节点数据，仅限于$this是图标，$iconBelow是盒子/图标
   * @param  {[type]} data     基本数据
   * @param  {[type]} srcIndex 移动的图标的序数
   * @param  {[type]} dstIndex 目标图标的序数
   * @return {[type]}          [void]
   */
  function groupData(data, srcIndex, dstIndex) {
    var srcData = data[srcIndex];
    var dstData = data[dstIndex];
    var newData;
    if (dstData.img) {
      // 目标是个图标
      newData = {
        title: '新分组',
        extraClass: dstData.extraClass,
        children: [dstData, srcData]
      };
      // 那么判断srcIndex与dstIndex哪个大，先删除大的，序号将不会受到影响
      if (srcIndex > dstIndex) {
        // 删除后面的数据
        data.splice(srcIndex, 1);
        // 合并前面的数据
        data.splice(dstIndex, 1, newData);
      } else {
        // 合并后面的数据
        data.splice(dstIndex, 1, newData);
        // 删除前面的数据
        data.splice(srcIndex, 1);
      }
    } else {
      // 目标是个盒子
      // 删除图标位置数据
      data.splice(srcIndex, 1);
      // 添加到盒子中
      dstData.children.push(srcData);
      newData = dstData;
    }
    return newData;
  }

  /**
   * 合并节点，仅限于$this是图标，$iconBelow是盒子/图标
   * @param  {[type]} $this      被拖动的图标
   * @param  {[type]} $iconBelow 被遮挡的图标
   * @param  {[type]} opt        [description]
   * @param  {[type]} newData    [description]
   * @return {[type]}            {$this, $iconBelow}
   */
  function groupDoms($this, $iconBelow, opt, newData) {
    if ($iconBelow.hasClass('iconbox-a')) {
      // 在一个图标上，并且拖动物体不是盒子，则两个组合成一个盒子
      var $newIconBox = constructBox(opt, newData);
      setBoxStyle($newIconBox, opt);
      setTitleStyle($newIconBox, opt);
      $newIconBox.css({
        'top': $iconBelow.css('top'),
        'left': $iconBelow.css('left')
      });
      // 新盒子插入到目标节点之后
      $newIconBox.insertAfter($iconBelow);
      // 删除之前的两个图标
      var $temp = $iconBelow;
      $iconBelow = $newIconBox.children('.iconbox-a').eq(0);
      $temp.remove();
      $temp = $this;
      $this = $newIconBox.children('.iconbox-a').eq(1);
      $temp.remove();
    } else {
      // 在一个盒子上，则加入到盒子里
      // 改成小图标样式
      $this.css({
        'cursor': '',
        'width': opt.thumbnailWidth + 'px',
        'height': opt.thumbnailHeight + 'px',
        'left': '',
        'top': '',
        'zIndex': '',
        'margin': opt.verIconInCloseBoxMargin + 'px ' + opt.horIconInCloseBoxMargin + 'px',
        'position': 'relative'
      }).removeClass('icondesktopbox').find('.iconbox-checkbox').hide();
      // 重新绑定多选框点击事件
      bindCheckboxClick($this.children('.iconbox-checkbox'), newData.children[newData.children.length - 1], newData);
      $this.appendTo($iconBelow);
      // 判断是否已经超过9个图标
      if ($this.index() > 8 + opt.otherThingNumInBox) {
        $this.hide();
      }
      // 更新盒子的角标
      updateBoxSuperscript($iconBelow, opt);
    }
    return {
      $this: $this,
      $iconBelow: $iconBelow
    }
  }

  /**
   * 交换节点数据，仅适用于拖动盒子
   * @param  {[type]} data     [description]
   * @param  {[type]} srcIndex [description]
   * @param  {[type]} dstIndex [description]
   * @return {[type]}          [description]
   */
  function exchangeData(data, srcIndex, dstIndex) {
    var srcData = data[srcIndex];
    var dstData = data[dstIndex];
    data[srcIndex] = dstData;
    data[dstIndex] = srcData;
  }

  /**
   * 交换节点，仅适用于拖动盒子
   * @param  {[type]} $this      [description]
   * @param  {[type]} $iconBelow [description]
   * @param  {[type]} opt        [description]
   * @return {[type]}            [void]
   */
  function exchangeDoms($this, $iconBelow, opt) {
    $this.animate({
      'left': $iconBelow.css('left'),
      'top': $iconBelow.css('top'),
      'padding': opt.closeBoxPadding + 'px'
    }, 'fast', 'swing', function () {
      $(this).css({
        'zIndex': 1,
        'cursor': 'pointer'
      });
      $(this).attr({
        'prevLeft': $(this).css('left'),
        'prevTop': $(this).css('top')
      });
    });
    $iconBelow.animate({
      'left': $this.attr('prevLeft'),
      'top': $this.attr('prevTop')
    }, 'fast', 'swing', function () {
      $(this).css('zIndex', 1);
      $(this).attr({
        'prevLeft': $(this).css('left'),
        'prevTop': $(this).css('top')
      });
    });
  }

  /**
   * 初始化
   * @param  {[type]} $root [description]
   * @param  {[type]} opt   [description]
   * @return {[type]}       [description]
   */
  function init($root, opt) {
    // 初始化数据
    initData($root, opt);
    // 初始化所有节点
    initDoms($root, opt);
    // 初始化所有样式
    initStyles($root, opt);
  }

  /**
   * 刷新桌面
   * @param  {[type]} $root [description]
   * @param  {[type]} opt   [description]
   * @return {[type]}       [description]
   */
  function refreshDesktop($root, opt) {
    // 初始化
    init($root, opt);
    // 如果当前页数大于总页数，则当前页数置为最后一页
    if (currentPageIndex >= opt.pages) {
      currentPageIndex = opt.pages - 1;
    }
    // 桌面页码切换
    $root.find('.icondesktop-slidebox').css({
      'marginLeft': - currentPageIndex * opt.width + 'px'
    });
    // 修改页码样式
    $root.find('.icondesktop-pageitem').eq(currentPageIndex)
    .addClass('icondesktop-pageitem__active').siblings().removeClass('icondesktop-pageitem__active');
  }

  /**
   * 新增图标
   * @param {[type]}  $root       [description]
   * @param {[type]}  opt         [description]
   * @param {Object}  data        icon的数据{title, extraClass, img...}
   * @param {Boolean} isOnDesktop 是否在桌面最后插入图标，如果不是，则根据当前位置插入图标
   */
  function addIcons($root, opt, data, isOnDesktop) {
    if (isOnDesktop) {
      // 如果是在桌面最后新增图标，则直接向数据尾部插入
      insertData(opt.data, data);
      refreshDesktop($root, opt);
    } else {
      // 如果是根据当前位置插入图标
      // 判断当前桌面是否有盒子打开
      if (opt.openBox.$box) {
        // 如果当前桌面有盒子打开，则在盒子中插入图标
        var index = getIconIndex(opt.openBox.$box, opt);
        var boxData = opt.data[index];
        // 插入数据
        insertData(boxData.children, data);
        // 插入节点
        insertIcons(opt.openBox.$box, opt, data, boxData);
      } else {
        // 如果当前桌面没有盒子打开，则判断当前桌面是否有空位置
        if (false) {
          // 如果有空位置，则在第一个空位置处插入图标（此判断暂不考虑）
          
        } else {
          insertData(opt.data, data);
          refreshDesktop($root, opt);
        }
      }
    }
  }

  function insertData(dstData, srcData) {
    if (srcData.push) {
      // 如果data是一个数组，则循环添加
      for (var i = 0; i < srcData.length; i++) {
        var element = srcData[i];
        dstData.push(element);
      }
    } else {
      // 如果data是单一对象，则直接添加
      dstData.push(srcData);
    }
  }

  function insertIcon($box, opt, dataIcon, dataBox) {
    // 暂不考虑多选的勾选状态及相关影响
    var $icon = constructIcon(opt, null, dataIcon, dataBox);

    // 显示图标多选按钮
    $icon.find('.iconbox-checkbox__children').show();
    // 显示图标删除按钮
    $icon.find('.iconbox-delbtn__children').show();
    // 显示角标
    $icon.find('.iconbox-superscript__children').show();
    // 显示盒子内图标标题
    $icon.find('.iconbox-icontitle').show();
    // 缩略图放大
    $icon.css({
      'width': opt.closeBoxWidth + 'px',
      'height': opt.closeBoxHeight + 'px',
      'margin': opt.openBoxIconMargin + 'px'
    });
    // 标题样式
    setTitleStyle($icon, opt);

    $box.append($icon);
  }

  function insertIcons($box, opt, data, dataBox) {
    if (data.push) {
      // 如果data是一个数组，则循环添加
      for (var i = 0; i < data.length; i++) {
        var element = data[i];
        insertIcon($box, opt, element, dataBox);
      }
    } else {
      // 如果data是单一对象，则直接添加
      insertIcon($box, opt, data, dataBox);
    }
  }

  /**
   * 更新图标的角标
   * @param  {[type]} $icon [description]
   * @param  {[type]} opt   [description]
   * @param  {[type]} data  [description]
   * @return {[type]}       [description]
   */
  function updateIconSuperscript($icon, opt, data) {
    if (!data) {
      data = getIconData($icon, opt);
    }
    var $superscript = $icon.find('.iconbox-superscript__children');
    if (data.superscript) {
      // 如果有角标，则显示
      $superscript.text(data.superscript).show();
    } else {
      // 如果没有角标，则隐藏
      $superscript.text(0).hide();
    }
  }

  /**
   * 更新盒子的角标
   * @param  {[type]} $box [description]
   * @param  {[type]} opt  [description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  function updateBoxSuperscript($box, opt, data) {
    if (!data) {
      data = getIconData($box, opt);
    }
    var $superscript = $box.find('.iconbox-superscript__parent');
    var total = 0;
    for (var i = 0; i < data.children.length; i++) {
      var dataIcon = data.children[i];
      if (dataIcon.superscript) {
        total += dataIcon.superscript;
      }
    }
    $superscript.text(total);
    if (total > 0) {
      // 如果盒子里的图标的总角标数大于0，则显示
      $superscript.show();
    } else {
      // 如果盒子里的图标的总角标数不大于0，则隐藏
      $superscript.hide();
    }
  }

  /**
   * 更新盒子里的图标的角标
   * @param  {[type]} $box [description]
   * @param  {[type]} opt  [description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  function updateIconInBoxSuperscript($box, opt, data) {
    if (!data) {
      data = getIconData($box, opt);
    }
    var $icons = $box.find('.iconbox-a');
    for (var i = 0; i < data.children.length; i++) {
      var dataIcon = data.children[i];
      updateIconSuperscript($icons.eq(i), opt, dataIcon);
    }
  }

  // 点击图标标题可编辑，写在这里主要用于阻止冒泡
  function bindTitleClick($dom, opt) {
    $dom.click(function (e) {
      if (opt.ableEditTitle) {
        e.stopPropagation();
        $(this).siblings('.iconbox-icontitleinput').show().focus().select();
      }
    });
  }

  // 点击图标标题文本框，写在这里主要用于阻止冒泡
  function bindTitleInputClick($dom, opt) {
    $dom.click(function (e) {
      if (opt.ableEditTitle) {
        e.stopPropagation();
      }
    });
  }

  /** 绑定图标的点击事件 **/
  function bindClick($dom, data, opt) {
    $dom.off().click(function (e) {
      // 当图标在盒子里时，需盒子打开时方可点击；图标不在盒子里时，可直接点击
      var $iconBox = $dom.parents('.iconbox');
      if ($iconBox.size()) {
        // 在盒子里时
        // 盒子打开时方可点击
        if ($iconBox.hasClass('iconbox__open')) {
          // 隐藏标题编辑输入框
          $dom.find('.iconbox-icontitleinput').focus().blur();
          opt.openBoxIconClick(data, e);
        }
      } else {
        // 不在盒子里时
        // 隐藏标题编辑输入框
        $dom.find('.iconbox-icontitleinput').focus().blur();
        // 避免拖动后自动打开图标
        var currentTime = new Date().getTime();
        if (currentTime - opt.moveIconObj.finishTime > opt.moveIconObj.openPeriod) {
          opt.openBoxIconClick(data, e);
        }
      }
    });
  }

  /**
   * 绑定多选按钮的点击事件
   * @param  {[type]} $checkbox [description]
   * @param  {[type]} data      [description]
   * @return {[type]}           [void]
   */
  function bindCheckboxClick($checkbox, data, parentData) {
    $checkbox.off().click(function (e) {
      e.stopPropagation();
      if ($(this).hasClass('iconbox-checkbox__checked')) {
        // 不选
        changeCheckboxFlagAndView($(this), 0);
        if (data.img) {
          // 是个图标
          data.checked = 0;
          if (parentData) {
            // 图标在盒子内，则循环判断图标所在盒子里的选中情况
            var checkboxSize = 0;
            for (var i = 0; i < parentData.children.length; i++) {
              var element = parentData.children[i];
              if (element.checked) {
                checkboxSize++;
                break;
              }
            }
            var $parentCheckbox = $checkbox.parents('.iconbox').find('.iconbox-checkbox__parent');
            if (checkboxSize == 0) {
              changeCheckboxFlagAndView($parentCheckbox, 0);
            } else {
              changeCheckboxFlagAndView($parentCheckbox, 1);
            }
          }
        } else {
          // 是个盒子
          // 循环修改数据
          for (var i = 0; i < data.children.length; i++) {
            var element = data.children[i];
            element.checked = 0;
          }
          // 循环修改checkbox
          $checkbox.parents('.iconbox').find('.iconbox-checkbox__children').each(function (index, element) {
            changeCheckboxFlagAndView($(this), 0);
          });
        }
      } else {
        // 选中
        changeCheckboxFlagAndView($(this), 2);
        data.checked = 2;
        if (data.img) {
          // 是个图标
          if (parentData) {
            // 图标在盒子内，则循环判断图标所在盒子里的选中情况
            var checkboxSize = 0;
            for (var i = 0; i < parentData.children.length; i++) {
              var element = parentData.children[i];
              if (element.checked) {
                checkboxSize++;
              }
            }
            var $parentCheckbox = $checkbox.parents('.iconbox').find('.iconbox-checkbox__parent');
            if (checkboxSize == parentData.children.length) {
              changeCheckboxFlagAndView($parentCheckbox, 2);
            } else {
              changeCheckboxFlagAndView($parentCheckbox, 1);
            }
          }
        } else {
          // 是个盒子
          // 循环修改数据
          for (var i = 0; i < data.children.length; i++) {
            var element = data.children[i];
            element.checked = 2;
          }
          // 循环修改checkbox
          $checkbox.parents('.iconbox').find('.iconbox-checkbox__children').each(function (index, element) {
            changeCheckboxFlagAndView($(this), 2);
          });
        }
      }
    });
  }

  /**
   * 绑定删除按钮的点击事件
   * @param  {[type]} $delBtn [description]
   * @param  {[type]} opt     [description]
   * @return {[type]}         [description]
   */
  function bindDelBtnClick($delBtn, opt) {
    $delBtn.click(function (e) {
      e.stopPropagation();
      var $icon = $delBtn.parent();
      delIconData($icon, opt);
      if (opt.desktopAutoFill && $icon.hasClass('icondesktopbox')) {
        refreshDesktop($icon.parents('.icondesktop'), opt)
      } else {
        $icon.remove();
      }
    });
  }
}));