/**
 * 模拟手机桌面
 * @auther jzw
 * @version 1.6.2
 * @history
 *   1.0.0 2018-01-16 完成基本功能
 *   1.0.2 2018-01-18 加上盒子多选功能
 *   1.0.4 2018-01-25 修复盒子关闭时可以点击里面图标的问题
 *   1.0.6 2018-01-25 加上图标显示的最大字数的相关限制参数
 *   1.0.8 2018-01-25 让盒子和图标可以共存
 *   1.1.0 2018-01-25 让盒子和图标可以拖动，并且图标可以拖动到盒子里
 *   1.1.2 2018-01-25 点击图标的标题可编辑
 *   1.1.3 2018-01-25 重构代码
 *   1.1.4 2018-01-25 拖动盒子互换功能加上提示
 *   1.1.6 2018-01-25 桌面图标刷新（自动排列补齐）功能
 *   1.1.8 2018-01-25 加上桌面水平内边距与垂直内边距、图标水平间距与垂直间距四个配置选项
 *   1.1.10 2018-01-25 加上盒子删除功能，修改盒子多选功能配置
 *   1.1.11 2018-01-25 修复翻页的bug
 *   调整版本号规则
 *   1.2.0 2018-01-25 调整桌面图标刷新功能，方法名由refreshIcon改为refreshDesktop，使当前页有图标时，不再回到第一页，refreshIcon方法废弃
 *   1.3.0 2018-01-25 新增根据data新增图标功能
 *   1.3.1 2018-01-25 修改标题不可修改时盒子里的图标溢出的问题
 *   1.3.2 2018-01-25 修改重复加载事件重复绑定的问题
 *   1.4.0 2018-01-26 新增图标角标
 *   1.4.1 2018-01-26 修改1.3.2版本出现的图标不能拖拽等问题
 *   1.4.2 2018-01-26 修改拖动组合图标后角标未更新的问题
 *   1.4.3 2018-01-26 支持拖动功能可选配置，默认为可拖动
 *   1.4.4 2018-01-26 修改在盒子中新增图标带上0角标的问题
 *   1.4.5 2018-01-26 让角标在删除按钮之下,删除按钮在多选按钮之下
 *   1.5.0 2018-01-26 增加切换状态功能
 *   1.5.1 2018-01-26 修改在盒子中新增图标带上多选框的问题
 *   1.5.2 2018-01-26 修改带有角标的图标移入盒子后角标未隐藏的问题
 *   1.5.3 2018-01-27 修改getData()方法返回不是一个数组的问题，修改删除所有图标后页码出错的问题
 *   1.6.0 2018-01-27 新增根据图标的一个属性或多个属性数据来查询该图标的具体数据的方法
 *   1.6.1 2018-01-30 修改jquery1.8.3版本下打开盒子后隐藏图标未显示的问题
 *   1.6.2 2018-01-30 修改盒子交换后节点未进行移动导致数据错误的问题
 *   2.0.0 插件名称由iconbox改为icondesktop。划分桌面区域。增加桌面工具。桌面工具在桌面上放不下时将不会显示出来。
 *     调整一行或一列时的图标位置。桌面大小变化时调整图标位置。图标/盒子/工具皆可调换位置。移动时可在不同页移动。
 *     桌面右键菜单刷新。盒子中的图标可移动。
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
  $.fn.icondesktop = function (options) {
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
      closeBoxMargin: 30, // 盒子关闭时的外边距
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
      openBoxMarginTop: 80, // 盒子打开时里面容器的上方外边距
      openBoxMarginLeft: 40, // 盒子打开时里面容器的左方外边距
      openBoxMarginRight: 40, // 盒子打开时里面容器的右方外边距
      openBoxMarginBottom: 40, // 盒子打开时里面容器的下方外边距
      openBoxPadding: 30, // 盒子打开时里面容器的内边距
      openBoxIconMargin: 20, // 盒子打开时里面的图标的外边距
      maxChineseCharLength: 7, // 图标显示的最大字数
      ellipticalChars: '...', // 图标字数过长截取后添加的字符串
      ableEditTitle: false, // 标题是否可以修改
      ableChecked: false, // 图标是否可以多选
      ableDel: false, // 图标是否可以删除
      ableDrag: true, // 图标是否可以拖动
      openBoxIconClick: function (data) {}, // 盒子打开时里面的图标点击事件
      menus: [
        {
          title: '刷新',
          extraClass: '', // 多个样式以空格隔开
          doClick: function () {
            returnVal.refreshDesktop();
          }
        }
      ],
      data: [
        {
          title: '图标1',
          extraClass: '',
          size: '1x1',
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
          size: '1x1',
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
      var $root = $(this);

      // 初始化数据
      init($(this), opt);

      // 桌面大小改变重新初始化
      $(this).off('resize').on('resize', function () {
        refreshDesktop($root, opt);
      });

      $(this).off('click').on('click', function (argument) {
        hideMenu($root);
      });

      // 点击翻页
      $(this).off('click', '.icondesktop-pageitem').on('click', '.icondesktop-pageitem', function () {
        // index从0开始
        var pageIndex = $(this).index();
        turnPage($(this).parents('.icondesktop'), pageIndex, opt.width, opt.pages, opt);
      });

      // 滑动翻页
      var mousedownX;
      var isMouseDown = false;
      var minDistance = 100;
      $(this).off('mousedown').on('mousedown', function (e) {
        isMouseDown = true;
        mousedownX = e.pageX;
      });
      $(this).off('mousemove').on('mousemove', function (e) {
        if (ev) {
          ev.returnValue = false
        }
        e.preventDefault();
        e.stopPropagation();
        if (isMouseDown) {
          var currentX = e.pageX;
          if (currentX - mousedownX > minDistance) { // 有效右滑，上一页
            turnPage($(this), opt.currentPageIndex - 1, opt.width, opt.pages, opt);
            isMouseDown = false;
          } else if (currentX - mousedownX < - minDistance) { // 有效左滑，下一页
            turnPage($(this), opt.currentPageIndex + 1, opt.width, opt.pages, opt);
            isMouseDown = false;
          }
        } else if (opt.ableDrag && opt.moveObj) {
          // 移动盒子/图标
          // console.log(e.pageX - opt.moveIconObj.mouseDownIconPrevPoint.x)
          moveIcon(opt, e);
        }
      });
      $(this).off('mouseup').on('mouseup', function (e) {
        isMouseDown = false;
        e.preventDefault();
        e.stopPropagation();
        if (opt.ableDrag && opt.moveObj) {
          // 取消盒子/图标移动
          cancelIconMove(opt);
        }
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
          openIconBox($this, opt);
        } else {
          // ***************************** 以下为关闭盒子操作 ******************************
          closeIconBox($this, opt);
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
      $(this).off('mousedown', '.icondesktopbox,.iconinbox').on('mousedown', '.icondesktopbox,.iconinbox', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);
        opt.moveObj = $this;
        // 非打开状态按下，并且可以拖动
        if (!$this.hasClass('iconbox__open') && opt.ableDrag) {
          $this.attr({
            'isMouseDownIcon': true
          });
          opt.moveIconObj.mouseDownIconPrevPoint.x = Math.floor(e.pageX);
          opt.moveIconObj.mouseDownIconPrevPoint.y = Math.floor(e.pageY);

          opt.moveIconObj.timeout = setTimeout(function () {
            // 生成一个半透明的指示位置图标
            var $flagDom = $($this.clone());
            opt.moveIconObj.$flagDom = $flagDom;
            opt.flagObj = $flagDom;
            // ********************* 拖动状态下的盒子/图标变化 开始 ***********************
            // 盒子稍微放大
            var iconLeft = parseInt($this.css('left'));
            var iconTop = parseInt($this.css('top'));
            var iconWidth = parseInt($this.css('width'));
            var iconHeight = parseInt($this.css('height'));
            if ($this.hasClass('iconinbox')) {
              // 如果此时是在盒子里(上方条件)，则需要将盒子里的位置换算成桌面上的位置
              iconLeft += opt.currentPageIndex * opt.desktopWidth + opt.openBoxMarginLeft;
              iconTop += opt.openBoxMarginTop;
            }
            // 指示位置图标透明度
            $this.css({'opacity': 0.3, 'cursor': 'move'});
            // 拖动图标在指示位置图标之上
            $flagDom.css({
              'left': iconLeft + 'px',
              'top': iconTop + 'px',
              'zIndex': 10, 
              'cursor': 'move'
            });
            // 指示位置图标加入到dom中
            $this.parents('.icondesktop-slidebox').append($flagDom);
            // $this.removeClass('icondesktopbox');
            // TODO 此处可能有问题
            $this.attr({
              'isMouseDownMove': true
            });
            $flagDom.attr({
              'prevLeft': iconLeft + 'px',
              'prevTop': iconTop + 'px',
              'prevWidth': iconWidth + 'px',
              'prevHeight': iconHeight + 'px'
            });
            if ($this.hasClass('iconbox-a')) {
              // 如果是图标(上方条件)，则调整图标大小
              enlargeDom($flagDom, iconLeft, iconTop, iconWidth, iconHeight, opt);
            } else if ($this.hasClass('iconbox-tool')) {
              // 如果是工具(上方条件)，则调整工具大小
              enlargeDom($flagDom, iconLeft, iconTop, iconWidth, iconHeight, opt);
            } else {
              // 如果是盒子(上方条件)，则调整盒子的大小
              enlargeDom($flagDom, iconLeft, iconTop, iconWidth, iconHeight, opt, true);
            }
            // ********************* 拖动状态下的盒子/图标变化 结束 ***********************
          }, mouseDownIconDuration);
        }
      });
      // 鼠标离开桌面恢复
      $(this).off('mouseleave').on('mouseleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);
        if (opt.ableDrag && opt.moveObj) {
          // 取消盒子/图标移动
          cancelIconMove(opt);
        }
      });
      // 右键菜单
      this.oncontextmenu = function (e) {
        var e = e || window.event;
        // console.log(this)
        $root.find('.icondesktop-menu').css({
          'left': e.offsetX + 'px',
          'top': e.offsetY + 'px'
        }).show();
        return false;//取消右键点击的默认事件
      }
      // $(this).off('click', '.icondesktop-menuitem').on('click', '.icondesktop-menuitem', function (e) {
      //   var $this = $(this);
      //   if ($this.hasClass('icondesktop-menuitem__refresh')) {
      //     refreshDesktop($root, opt);
      //   }
      // });
    });
    var $root = $(this);
    var returnVal = {
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
        var allData = jQuery.extend(true, [], opt.data);
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
      },
      /**
       * 切换状态功能
       * @param  {[type]} option {ableEditTitle, ableChecked, ableDel, ableDrag}
       * @return {[type]}        [description]
       */
      switchState: function (stateName) {
        if (typeof opt[stateName] != 'undefined') {
          opt[stateName] = !opt[stateName];
        }
        if (stateName == 'ableEditTitle') {
          if (!opt[stateName]) {
            // 不可编辑时隐藏输入框
            $root.find('.iconbox-icontitleinput').hide();
          }
        } else if (stateName == 'ableChecked') {
          switchShowHide($root, opt[stateName], 'checkbox');
        } else if (stateName == 'ableDel') {
          switchShowHide($root, opt[stateName], 'delbtn');
        }
      },
      /**
       * 根据图标的一个属性或多个属性数据来查询该图标的具体数据
       * @param  {[type]} obj [description]
       * @return {[type]}     [description]
       */
      getIconData: function (obj) {
        var d = [];
        for (var i = 0; i < opt.data.length; i++) {
          var element = opt.data[i];
          if (element.children && element.children.length) {
            for (var j = 0; j < element.children.length; j++) {
              var ele = element.children[j];
              if (isMatched(ele, obj)) {
                d.push(ele);
              }
            }
          } else {
            if (isMatched(element, obj)) {
              d.push(element);
            }
          }
        }
        return d;
      }
    }
    return returnVal;
  };

  /**
   * 初始化数据
   * @param  {[type]} $root [description]
   * @param  {[type]} opt   [description]
   * @return {[type]}       [description]
   */
  function initData($root, opt) {
    opt.desktopWidth = $root.width();
    opt.desktopHeight = $root.height();

    opt.sourceData = opt.data;
    // 记录桌面上的占用位置
    opt.locationObj = {};
    // 记录盒子内的占用位置
    opt.locationBoxObj = {};
    // 盒子放大单边需要增加的宽度
    opt.closeBoxEnlargeWidth = opt.closeBoxWidth * opt.closeBoxEnlargeScale;
    // 盒子放大单边需要增加的高度u
    opt.closeBoxEnlargeHeight = opt.closeBoxHeight * opt.closeBoxEnlargeScale;
    // 图标组合时显示的盒子框
    opt.$closeBoxBackground = $('<img src="' + opt.closeBoxBackgroundImage + '" class="iconbox-bg" width="'
      + opt.closeBoxWidth + '" height="' + opt.closeBoxHeight + '" style="display: none;">');

    // 将桌面划分成若干个格子
    separateDesktopGrids($root, opt);
    // 将打开的盒子划分成若干个格子
    separateBoxGrids($root, opt);

    if (opt.pageSize == 0) {
      return;
    }
    opt.currentPageIndex = 0;

    // 计算盒子内小图标间距，固定为九宫格排列
    var horIconInCloseBoxMargin = (opt.closeBoxWidth - opt.closeBoxPadding * 2 - opt.thumbnailWidth * 3) / 2;
    var verIconInCloseBoxMargin = (opt.closeBoxHeight - opt.closeBoxPadding * 2 - opt.thumbnailHeight * 3) / 2;
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
    };
    moveIconObj.$prevIconBelow = moveIconObj.$empty;
    opt.moveIconObj = moveIconObj;

    // 设置盒子内最多显示9个图标，第一个为superscript, 第二个为delbtn, 第三个为checkbox，第四个为input，第五个为label，第六个为盒子背景
    var otherThingNumInBox = 6;
    opt.otherThingNumInBox = otherThingNumInBox;
    // var maxShowIconInBox = 8 + opt.otherThingNumInBox;
    var maxShowIconInBox = 8;
    opt.maxShowIconInBox = maxShowIconInBox;

    // 是否能够点击盒子，避免多次点击动画错乱
    opt.ableClickBox = true;

    opt.openBox = {};
    // 存储对应位置的dom节点
    opt.locationDom = {};
    // 移动后的位置数组，记录上一次的与上上次的位置，如果三次位置相同，则触发事件
    opt.moveLocations = [];
    opt.moveLocationMaxLength = 3;
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
      // 如果没有上级数据(上方条件)，则说明图标是在桌面上
      $icon.addClass('icondesktopbox');
      // 设置图标的位置
      setLocations($icon, dataIcon, opt, 'set');
    } else {
      // 如果有上级数据(上方条件)，则说明图标时在盒子里
      $icon.addClass('iconinbox');
      setLocations($icon, dataIcon, opt);
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

    // 角标
    var $superscript = $('<a class="iconbox-superscript iconbox-superscript__children"></a>');
    $icon.append($superscript);
    // 更新角标
    updateIconSuperscript($icon, opt, dataIcon);

    // 删除按钮
    var $delBtn = $('<a class="iconbox-delbtn iconbox-delbtn__children"></a>');
    $icon.append($delBtn);
    bindDelBtnClick($delBtn, opt);
    if (!opt.ableDel || dataBox) {
      // 如果图标不可删除，或者在盒子里，则隐藏删除按钮
      $delBtn.hide();
    }

    // 多选按钮
    var $checkboxChildren = $('<a class="iconbox-checkbox iconbox-checkbox__children"></a>');
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
    if (!opt.ableChecked || dataBox) {
      // 如果图标不可选，或者在盒子里，则隐藏多选按钮
      $checkboxChildren.hide();
    }

    bindClick($icon, dataIcon, opt);
    $icon.append($iconImg);
    $icon.append($iconTitle);

    // 编辑标题单行文本框
    var $iconTitleInput = $('<input type="text" class="iconbox-icontitleinput" value="' + dataIcon.title + '">');
    $icon.append($iconTitleInput);
    bindTitleClick($iconTitle, opt);
    bindTitleInputClick($iconTitleInput, opt);
    
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
    // 添加移入移出框范围
    var $boxArea = $('<div class="iconbox-area">'
      + '<div class="iconbox-area__part iconbox-area__topleft"></div><div class="iconbox-area__part iconbox-area__top"></div>'
      + '<div class="iconbox-area__part iconbox-area__topright"></div><div class="iconbox-area__part iconbox-area__left"></div>'
      + '<div class="iconbox-area__part iconbox-area__right"></div><div class="iconbox-area__part iconbox-area__bottomleft"></div>'
      + '<div class="iconbox-area__part iconbox-area__bottom"></div><div class="iconbox-area__part iconbox-area__bottomright"></div>'
      + '<div class="iconbox-scrollbar"></div>'
      + '</div>');
    $box.append($boxArea);
    var $boxContainer = $('<div class="iconbox-area__container"></div>');
    bindBoxScroll($boxContainer, opt);
    $boxArea.append($boxContainer);
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
      $boxContainer.append($icon);
    }
    
    // 多选按钮
    var $checkbox = $('<a class="iconbox-checkbox iconbox-checkbox__parent"></a>');
    $box.prepend($checkbox);
    bindCheckboxClick($checkbox, dataBox);
    // checkboxObj.size只会小于等于dataBox.children.length
    if (checkboxObj.size == dataBox.children.length) {
      changeCheckboxFlagAndView($checkbox, 2);
    } else if (checkboxObj.size > 0) {
      changeCheckboxFlagAndView($checkbox, 1);
    }
    if (!opt.ableChecked) {
      // 如果盒子不能选中，则隐藏多选按钮
      $checkbox.hide();
    }
    // 删除按钮
    var $delBtn = $('<a class="iconbox-delbtn iconbox-delbtn__parent"></a>');
    $box.prepend($delBtn);
    bindDelBtnClick($delBtn, opt);
    if (!opt.ableDel) {
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

    // 设置盒子的位置
    setLocations($box, dataBox, opt, 'set');

    return $box;
  }

  function constructTool(opt, dataTool) {
    if (!dataTool.location) {
      return $('');
    }
    var $tool = $(dataTool.content);
    var dimension = getToolDimension(opt, dataTool);
    $tool.addClass('icondesktopbox iconbox-tool');
    $tool.css({
      'position': 'absolute',
      'width': dimension.width + 'px',
      'height': dimension.height + 'px'
    });
    // 设置工具的位置
    setLocations($tool, dataTool, opt, 'set');

    return $tool;
  }

  /**
   * [getToolDimension 获得工具的大小]
   * @param  {[type]} opt      [description]
   * @param  {[type]} dataTool [description]
   * @return {[type]}          [description]
   */
  function getToolDimension(opt, dataTool) {
    var sizeInfo = parseSizeInfo(dataTool.size);
    var width = (opt.closeBoxWidth + opt.closeBoxRealHorizontalMargin) * sizeInfo.col - opt.closeBoxRealHorizontalMargin;
    var height = (opt.closeBoxHeight + opt.closeBoxTitleHeight + opt.closeBoxRealVerticalMargin) * sizeInfo.row - opt.closeBoxRealVerticalMargin;
    var borderWidth = dataTool.borderWidth;
    if (borderWidth) {
      width -= borderWidth * 2;
      height -= borderWidth * 2;
    }
    return {
      width: width,
      height: height
    }
  }

  /**
   * 初始化所有节点
   * @param  {[type]} $root       [description]
   * @param  {[type]} opt         [description]
   * @return {[type]}             [description]
   */
  function initDoms($root, opt) {
    // 清空节点
    $root.empty();
    if (opt.pageSize == 0) {
      return;
    }
    var $dl = $(document.createElement('div'));
    $dl.addClass('icondesktop-slidebox');
    var $pagePanel = $(document.createElement('div'));
    $pagePanel.addClass('icondesktop-pagination');
    var $pageBox = $(document.createElement('div'));
    $pageBox.addClass('icondesktop-pagebox');
    $pagePanel.append($pageBox);
    var pageIndex = -1;
    for (var i = 0; i < opt.data.length; i++) {
      var dataBox = opt.data[i];
      // 下一页
      var locationInfo = parseLocationInfo(dataBox.location);
      if (!locationInfo) {
        // 没有位置信息，即该工具在桌面上放不下(上方条件)，则忽略该工具
        continue;
      }
      // 如果是盒子，则创建盒子；如果是图标，则创建图标；如果是工具，则创建工具
      if (dataBox.type == 'tool') {
        // 是工具(上方条件)
        var $tool = constructTool(opt, dataBox);
        $dl.append($tool);
      } else if (dataBox.img) {
        // 是图标(上方条件)
        dataIcon = dataBox;
        // 创建图标
        var $icon = constructIcon(opt, null, dataIcon);
        $dl.append($icon);
      } else {
        // 是盒子(上方条件)，则创建盒子
        var $box = constructBox(opt, dataBox);
        $dl.append($box);
      }
    }
    // 创建页面图标
    for (var i = 0; i < opt.pages; i++) {
      var $pageNum = addPageNum($pageBox);
      if (i === 0) {
        $pageNum.addClass('icondesktop-pageitem__active');
      }
    }
    // 添加桌面
    $root.append($dl);
    // 添加分页栏
    $root.append($pagePanel);
    $root.find('.icondesktop-slidebox').append(opt.$closeBoxBackground);
    // 添加菜单
    var $menu = $('<div class="icondesktop-menu"></div>');
    var $menuList = $('<dl class="icondesktop-menulist"></dl>');
    for (var i = 0; i < opt.menus.length; i++) {
      var element = opt.menus[i];
      var extraClass = element.extraClass ? (' ' + element.extraClass) : '';
      var $menuItem = $('<dd class="icondesktop-menuitem' + extraClass + '">' + element.title + '</dd>');
      bindMenuClick($menuItem, element.doClick);
      $menuList.append($menuItem);
    }
    $menu.append($menuList);
    $menu.hide();
    $root.append($menu);
  }

  /**
   * 初始化所有样式
   * @param  {[type]} $root [description]
   * @param  {[type]} opt   [description]
   * @return {[type]}       [description]
   */
  function initStyles($root, opt) {
    // 设置各个桌面大小
    // $root.find('.icondesktop-slide').width(opt.width).height(opt.height);
    // 设置分页栏高度
    $root.find('.icondesktop-pagination').height(opt.pageHeight).css({
      'bottom': '0px'
    });
    // 设置桌面背景颜色，用于还原的时候可恢复
    $root.css({
      'backgroundColor': opt.closeBoxColor
    });
    // 设置盒子及相关样式
    setBoxStyle($root.find('.iconbox'), opt);
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
    // $root.find('.icondesktopbox').each(function (index, element) {
    //   // 此处index从0开始
    //   // 垂直序数，从0开始
    //   var topIndex = Math.floor(index % opt.pageSize / opt.horSize);
    //   // 水平序数，从0开始
    //   var leftIndex = index % opt.horSize;
    //   $(this).css({
    //     top: topIndex * (opt.closeBoxHeight + opt.closeBoxRealVerticalMargin + opt.closeBoxTitleHeight) + opt.desktopVerticalPadding + 'px', 
    //     left: leftIndex * (opt.closeBoxWidth + opt.closeBoxRealHorizontalMargin) + opt.desktopHorizontalPadding + 'px'
    //   });
    // });
  }

  function setBoxStyle($box, opt) {
    // 设置盒子样式
    if ($box.hasClass('iconbox__close')) {
      $box.css({
        'width': opt.closeBoxWidth + 'px',
        'height': opt.closeBoxHeight + 'px'
      });
      // 盒子内容器大小
      // $box.find('.iconbox-area__container').css({
      //   'width': opt.closeBoxWidth + 'px',
      //   'height': opt.closeBoxHeight + 'px'
      // });
      
      // 设置盒子内小图标大小、外边距
      // $box.find('.iconbox-a').css({
      //   'width': opt.thumbnailWidth + 'px', 
      //   'height': opt.thumbnailHeight + 'px'
      //   // 'margin': opt.verIconInCloseBoxMargin + 'px ' + opt.horIconInCloseBoxMargin + 'px'
      // }).each(function (index, element) {
      //   $(element).css({
      //     'left': Math.floor(index % 3) * (opt.thumbnailWidth + opt.horIconInCloseBoxMargin) + opt.closeBoxPadding + 'px',
      //     'top': Math.floor(index / 3) * (opt.thumbnailHeight + opt.verIconInCloseBoxMargin) + opt.closeBoxPadding + 'px'
      //   });
      // });
      $box.each(function (index, element) {
        var dataBox = getDataByLocation($(element).attr('location'), opt.data, opt.locationObj);
        recoverLocationInBox(dataBox, opt);
      });
      // $box.find('.iconbox-area__container').css({
      //   'padding': opt.closeBoxPadding
      // });
    } else if ($box.hasClass('.iconbox__open')) {

    }
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

  function recoverLocationInBox(dataBox, opt, isAnimate) {
    var $box = dataBox.$dom;
    var $icons = $box.find('.iconbox-a');
    if (isAnimate) {
      // 如果是动画(上方条件)
      $icons.each(function (index, element) {
        var point = getLocationInCloseBox(index, opt);
        $(element).animate({
          'left': point.left + 'px',
          'top': point.top + 'px',
          'width': opt.thumbnailWidth + 'px', 
          'height': opt.thumbnailHeight + 'px'
        });
      });
    } else {
      // 如果是直接定位(上方条件)
      $icons.each(function (index, element) {
        var point = getLocationInCloseBox(index, opt);
        $(element).css({
          'left': point.left + 'px',
          'top': point.top + 'px',
          'width': opt.thumbnailWidth + 'px', 
          'height': opt.thumbnailHeight + 'px'
        });
      });
    }
  }

  function getLocationInCloseBox(index, opt) {
    return {
      'left': Math.floor(index % 3) * (opt.thumbnailWidth + opt.horIconInCloseBoxMargin) + opt.closeBoxPadding,
      'top': Math.floor(index / 3) * (opt.thumbnailHeight + opt.verIconInCloseBoxMargin) + opt.closeBoxPadding
    }
  }

  /** 翻页 **/
  function turnPage($icondesktop, pageIndex, width, pages, opt) {
    // 对于不合法的序数，不进行翻页
    if (pageIndex < 0 || pageIndex >= pages) {
      return false;
    }
    opt.currentPageIndex = pageIndex;
    // 页码移动
    $icondesktop.find('.icondesktop-slidebox').animate({
      'marginLeft': - pageIndex * width + 'px'
    });
    // 修改页码样式
    $icondesktop.find('.icondesktop-pageitem').eq(pageIndex)
    .addClass('icondesktop-pageitem__active').siblings().removeClass('icondesktop-pageitem__active');
    return true;
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
   * @param  {[type]} opt   [description]
   * @param  {[type]} e     [description]
   * @return {[type]}       [description]
   */
  function moveIcon(opt, e) {
    var $this = opt.moveObj;
    var $flagDom = opt.flagObj;
    var moveIconObj = opt.moveIconObj;
    // 图标处于在移动状态
    if ($this.attr('isMouseDownMove')) {
      moveIconObj.mouseDownIconCurrentPoint.x = Math.floor(e.pageX);
      moveIconObj.mouseDownIconCurrentPoint.y = Math.floor(e.pageY);
      // 更新盒子/图标的移动位置
      $flagDom.css({
        'left': parseInt($flagDom.css('left')) + moveIconObj.mouseDownIconCurrentPoint.x - moveIconObj.mouseDownIconPrevPoint.x + 'px',
        'top': parseInt($flagDom.css('top')) + moveIconObj.mouseDownIconCurrentPoint.y - moveIconObj.mouseDownIconPrevPoint.y + 'px'
      });
      if (!moveIconObj.iconInterval) {
        // 如果没有开启检查盒子/图标所在位置区域的定时器，则开启，固定为500毫秒检测一次所在位置区域
        moveIconObj.iconInterval = setInterval(function () {
          var moveLocation;
          var desktopIconData;
          if ($flagDom.hasClass('icondesktopbox')) {
            // 在桌面上
            desktopIconData = getIconData($flagDom, opt);
            moveLocation = getMoveLocation($flagDom, desktopIconData.size, opt.currentPageIndex, opt.desktopWidth, opt.separationLine, opt.verSize, opt.horSize);
          } else {
            // 在盒子里
            moveLocation = getMoveLocation($flagDom, getIconData($this, opt).size, opt.currentPageIndex, opt.desktopWidth, opt.separationBoxLine, opt.verIconSize, opt.horIconSize);
          }
          if (!isMoveLocationActive(moveLocation, opt)) {
            // 如果移动位置不生效(上方条件)
            // 则不进行后续操作
            return;
          }
          if ($flagDom.hasClass('icondesktopbox')) {
            // 在桌面上
            moveToLocation($flagDom, desktopIconData, opt.data, opt);
          } else {
            // 在盒子里
            var index = getIconIndex($this.parents('.icondesktopbox'), opt);
            moveToLocationInBox($flagDom, getIconData($this, opt), opt.data[index], opt);
          }
        }, 500);
      }
    }
    moveIconObj.mouseDownIconPrevPoint.x = moveIconObj.mouseDownIconCurrentPoint.x;
    moveIconObj.mouseDownIconPrevPoint.y = moveIconObj.mouseDownIconCurrentPoint.y;
  }

  /**
   * 取消移动
   * @param  {[type]} opt         [description]
   * @return {[type]}             [description]
   */
  function cancelIconMove(opt) {
    var $this = opt.moveObj;
    var $flagDom = opt.flagObj;
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
        // if (moveIconObj.isSuspended && $iconBelow) {
        if (moveIconObj.$prevIconBelow === $iconBelow) {
          // 如果拖动盒子/图标与上一个状态均在同一个盒子/图标上(上方条件)
          // 则进行分组
          var dstData = groupData(opt.data, getIconIndex($this, opt), getIconIndex($iconBelow, opt), opt);
          // 此处$this与$iconBelow被删除重新创建，所以重新赋值
          $groupObj = groupDoms($this, $iconBelow, opt, dstData);
          opt.flagObj.remove();
          $this = $groupObj.$this;
          $iconBelow = $groupObj.$iconBelow;
          recoverIconBelow(opt);
          moveFlag = 2;

        } else {
          // 如果拖动盒子/图标与上一个状态不在同一个盒子/图标上(上方条件)，则还原
          var theLeft = parseInt($this.css('left'));
          var theTop = parseInt($this.css('top'));
          var theWidth = parseInt($this.css('width'));
          var theHeight = parseInt($this.css('height'));
          if ($this.hasClass('iconinbox')) {
            // 如果此时是在盒子里(上方条件)，则需要将盒子里的位置换算成桌面上的位置
            theLeft += opt.currentPageIndex * opt.desktopWidth + opt.openBoxMarginLeft;
            theTop += opt.openBoxMarginTop;
          }
          if ($this.hasClass('iconbox-a')) {
            // 如果是图标(上方条件)，则调整图标大小
            recoverDom($flagDom, $this, theLeft, theTop, theWidth, theHeight);
          } else if ($this.hasClass('iconbox__close')) {
            // 如果是盒子(上方条件)，则调整盒子的大小
            recoverDom($flagDom, $this, theLeft, theTop, theWidth, theHeight, true, opt.closeBoxPadding);
            clearDomPrevAttr($this);
          } else if ($this.hasClass('iconbox-tool')) {
            // 如果是工具(上方条件)，则调整工具大小
            recoverDom($flagDom, $this, theLeft, theTop, theWidth, theHeight);
          }
          recoverIconBelow(opt, true);
        }
        moveIconObj.finishTime = new Date().getTime();
        // 删除拖动物体的指示图标
        if (moveIconObj.$flagDom) {
          // moveIconObj.$flagDom.remove();
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
    opt.moveObj = null;
    opt.flagObj = null;
  }

  function removeFlagDomBelow(moveIconObj) {
    if (moveIconObj.$flagDomBelow) {
      moveIconObj.$flagDomBelow.remove();
      moveIconObj.$flagDomBelow = null;
    }
  }

  /**
   * 恢复下方盒子/图标的变大效果
   * @param  {[type]} opt        [description]
   * @param  {[type]} onlyEffect [description]
   * @return {[type]}            [description]
   */
  function recoverIconBelow(opt, onlyEffect) {
    // // 隐藏悬浮在图标上时出现的盒子背景
    cancelGroupIcons(opt);
    cancelJoinBox(opt);
    if (!onlyEffect) {
      var moveIconObj = opt.moveIconObj;
      moveIconObj.$prevIconBelow = moveIconObj.$empty;
    }
  }

  /**
   * 获得当前图标所在桌面的其他图标的位置数组
   * @param  {[type]} $icon [description]
   * @return {[type]}       [description]
   */
  function getOtherIconLocations($icon) {
    var $desktop = $icon.parents('.icondesktop-slidebox');
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
  function getIconIndex($icon, opt) {
    var location = $icon.attr('location');
    var iconIndex = getIndexByLocation(location, opt.data, opt);
    return iconIndex;
  }

  /**
   * 获得图标在盒子中的序数
   * @param  {[type]} $icon    [description]
   * @param  {[type]} location [description]
   * @param  {[type]} opt      [description]
   * @return {[type]}          [description]
   */
  function getIconChildIndex($icon, location, opt) {
    // // 目前是三个其他图标
    // return $icon.index() - opt.otherThingNumInBox;
    
    var locationIconObj = opt.locationBoxObj[location];
    var iconLocation = $icon.attr('location');
    // 占用位置数组
    var arrLocation = [];
    for (var key in locationIconObj) {
      arrLocation.push(createLocationRelativeInfo(key, '1x1'));
    }
    arrLocation.sort(sortByLocation);
    var i = 0;
    for (; i < arrLocation.length; i++) {
      var element = arrLocation[i];
      if (element.location === iconLocation) {
        break;
      }
    }
    // 没有匹配上
    if (i >= arrLocation.length) {
      return null;
    }
    return i;
  }

  /**
   * 获得图标对应的data
   * @param  {[type]} $icon [description]
   * @param  {[type]} opt   [description]
   * @return {[type]}       [description]
   */
  function getIconData($icon, opt) {
    var srcData = opt.data;
    var iconData;
    if ($icon.hasClass('icondesktopbox')) {
      // 如果是第一层盒子/图标
      iconData = srcData[getIconIndex($icon, opt)];
    } else {
      // 如果是盒子里面的图标
      // 第一层
      iconData = srcData[getIconIndex($icon.parents('.icondesktopbox'), opt)];
      var location = iconData.location;
      var index = getIconChildIndex($icon, location, opt);
      if (index === null) {
        return null;
      }
      // 第二层
      iconData = iconData.children[index];
    }
    return iconData;
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
      var index = getIconIndex($icon, opt);
      srcData.splice(index, 1);
    } else {
      // 如果是盒子里面的图标
      // 第一层
      var data = srcData[getIconIndex($icon.parents('.icondesktopbox'), opt)];
      // 第二层
      var index = getIconChildIndex($icon, data.location, opt);
      data.children.splice(index, 1);
    }
  }

  /**
   * 合并节点数据，仅限于$this是图标，$iconBelow是盒子/图标
   * @param  {[type]} data     [基本数据]
   * @param  {[type]} srcIndex [移动的图标的序数]
   * @param  {[type]} dstIndex [目标图标的序数]
   * @param  {[type]} opt      [opt]
   * @return {[type]}          [void]
   */
  function groupData(data, srcIndex, dstIndex, opt) {
    var srcData = data[srcIndex];
    var dstData = data[dstIndex];
    var newData;
    if (dstData.img) {
      // 目标是个图标
      newData = {
        title: '新分组',
        extraClass: dstData.extraClass,
        size: dstData.size,
        location: dstData.location,
        children: [dstData, srcData]
      };
      // 加上位置信息
      dstData.location = getFirstEmptyLocationInBox(newData.location, opt);
      srcData.location = getFirstEmptyLocationInBox(newData.location, opt);
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
      // 加上位置信息
      srcData.location = getFirstEmptyLocationInBox(newData.location, opt);
    }
    return newData;
  }

  /**
   * 合并节点，仅限于$this是图标，$iconBelow是盒子/图标
   * @param  {[type]} $this      [被拖动的图标]
   * @param  {[type]} $iconBelow [被遮挡的图标]
   * @param  {[type]} opt        [description]
   * @param  {[type]} newData    [description]
   * @return {[type]}            {$this, $iconBelow}
   */
  function groupDoms($this, $iconBelow, opt, newData) {
    if ($iconBelow.hasClass('iconbox-a')) {
      // 在一个图标上，并且拖动物体不是盒子(上方条件)，则两个组合成一个盒子
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
      $iconBelow = $newIconBox.find('.iconbox-a').eq(0);
      $temp.remove();
      $temp = $this;
      $this = $newIconBox.find('.iconbox-a').eq(1);
      $temp.remove();
      setLocations($iconBelow, newData.children[0], opt);
      setLocations($this, newData.children[1], opt);
    } else {
      // 在一个盒子上(上方条件)，则加入到盒子里
      // 改成小图标样式，并调整位置
      var dataIcon = newData.children[newData.children.length - 1];
      setLocations($this, dataIcon, opt);
      var point = getLocationInCloseBox(newData.children.length - 1, opt);
      $this.css({
        'left': point.left + 'px',
        'top': point.top + 'px',
        'width': opt.thumbnailWidth + 'px', 
        'height': opt.thumbnailHeight + 'px',
        'opacity': '',
        'cursor': '',
        'zIndex': ''
      }).removeClass('icondesktopbox').addClass('iconinbox').find('.iconbox-checkbox').hide();
      // 重新绑定多选框点击事件
      bindCheckboxClick($this.children('.iconbox-checkbox'), newData.children[newData.children.length - 1], newData);
      $this.appendTo($iconBelow.find('.iconbox-area__container'));
      // 判断是否已经超过9个图标
      if ($this.index() > 8) {
        $this.hide();
      } else {
        $this.show();
      }
      console.log($this.is(':hidden'))
      // 更新盒子的角标
      updateBoxSuperscript($iconBelow, opt);
      // 隐藏移入的图标的角标
      $this.find('.iconbox-superscript__children').hide();
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
    // dom节点位置变换
    var $thisNext = $this.next('.icondesktopbox');
    var $iconBelowNext = $iconBelow.next('.icondesktopbox');
    if ($thisNext.size()) {
      $iconBelow.insertBefore($thisNext);
    } else {
      $iconBelow.appendTo($iconBelow.parent());
    }
    if ($iconBelowNext.size()) {
      $this.insertBefore($iconBelowNext);
    } else {
      $this.appendTo($this.parent());
    }
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
    // 初始化一些事件
    initEvents($root, opt);
  }

  function initEvents($root, opt) {
    $root.find('.icondesktopbox').each(function (argument) {
      $(this).get(0).oncontextmenu = function (e) {
        if (e) {
          e.stopPropagation();
        } else {
          var event = window.event;
          event.cancelBubble = true;
        }
        $root.find('.icondesktop-menu').hide();
        return false;
      }
    });
  }

  /**
   * 刷新桌面
   * @param  {[type]} $root [description]
   * @param  {[type]} opt   [description]
   * @return {[type]}       [description]
   */
  function refreshDesktop($root, opt) {
    var currentPageIndex = opt.currentPageIndex;
    // 初始化
    init($root, opt);
    // 如果当前页数大于总页数，则当前页数置为最后一页
    if (currentPageIndex >= opt.pages) {
      opt.currentPageIndex = opt.pages - 1;
    } else {
      opt.currentPageIndex = currentPageIndex;
    }
    if (opt.currentPageIndex < 0) {
      // 当前页序号小于0，即总页数为0时，当前页为第一页
      opt.currentPageIndex = 0;
    }
    // 桌面页码切换
    $root.find('.icondesktop-slidebox').css({
      'marginLeft': - opt.currentPageIndex * opt.width + 'px'
    });
    // 修改页码样式
    $root.find('.icondesktop-pageitem').eq(opt.currentPageIndex)
    .addClass('icondesktop-pageitem__active').siblings().removeClass('icondesktop-pageitem__active');
  }

  function addPageNum($pageBox) {
    var $pageNum = $(document.createElement('a'));
    $pageNum.addClass('icondesktop-pageitem');
    $pageBox.append($pageNum);
    return $pageNum;
  }

  function delPageNum($pageBox) {
    var $pageNum = $pageBox.children(':last-child');
    var activeClass = 'icondesktop-pageitem__active';
    // 如果当前页被删掉，则切换选中状态
    if ($pageNum.hasClass(activeClass)) {
      $pageNum.prev().addClass(activeClass);
    }
    $pageNum.remove();
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
        // 添加位置信息
        data.location = getFirstEmptyLocationInBox(boxData.location, opt);
        // 插入数据
        insertData(boxData.children, data);
        // 插入节点
        insertIcons(opt.openBox.$box, opt, data, boxData);
        // 调整滚动条
        adjustScrollBar(opt.openBox.$box.find('.iconbox-area__container'));
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

    if (opt.ableChecked) {
      // 显示图标多选按钮
      $icon.find('.iconbox-checkbox__children').show();
    }
    if (opt.ableDel) {
      // 显示图标删除按钮
      $icon.find('.iconbox-delbtn__children').show();
    }
    // 更新角标
    updateIconSuperscript($icon, opt, dataIcon);
    // 显示盒子内图标标题
    $icon.find('.iconbox-icontitle').show();
    // 缩略图放大
    $icon.css({
      'width': opt.closeBoxWidth + 'px',
      'height': opt.closeBoxHeight + 'px'
      // 'margin': opt.openBoxIconMargin + 'px'
    });
    // 标题样式
    setTitleStyle($icon, opt);

    setLocations($icon, dataIcon, opt, 'set');
    $box.find('.iconbox-area__container').append($icon);
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

  function switchShowHide($root, beAble, name) {
    if (beAble) {
      // 关闭的盒子的xxx显示
      $root.find('.iconbox__close .iconbox-' + name + '__parent').show();
      // 打开的盒子里的图标的xxx显示
      $root.find('.iconbox__open .iconbox-' + name + '__children').show();
      // 最外层的图标的xxx显示
      $root.find('.iconbox-a.icondesktopbox .iconbox-' + name + '__children').show();
    } else {
      // 所有xxx隐藏
      $root.find('.iconbox-' + name).hide();
    }
  }

  /**
   * 判断obj中的所有属性值是否都与data中对应的属性值相同
   * @param  {object}  data [description]
   * @param  {object}  obj  [description]
   * @return {Boolean}      [description]
   */
  function isMatched(data, obj) {
    var val = true;
    for (var i in obj) {
      if (obj[i] != data[i]) {
        val = false;
        break;
      }
    }
    return val;
  }

  /**
   * [separateDesktopGrids 划分桌面成若干个格子]
   * @param  {[type]} $root [description]
   * @param  {[type]} opt   [description]
   * @return {[type]}       [description]
   */
  function separateDesktopGrids($root, opt) {
    var width = $root.width();
    var height = $root.height();
    opt.width = width;
    opt.height = height;

    // 桌面下方的间距，如果分页栏高就以分页栏高度为标准；如果桌面间距高，就以桌面间距为标准
    var desktopBottomPadding = opt.pageHeight > opt.desktopVerticalPadding ? opt.pageHeight : opt.desktopVerticalPadding;
    // 计算水平可以放几个盒子
    // (桌面宽度 - 桌面左右的内边距 + 图标之间的水平外边距) / (图标的宽度 + 图标的水平外边距)
    var horSize = Math.floor((width - opt.desktopHorizontalPadding * 2 + opt.closeBoxHorizontalMargin) / (opt.closeBoxWidth + opt.closeBoxHorizontalMargin));
    // 计算垂直方向可以放几个盒子
    // (桌面高度 - 桌面底部间距 - 上边桌面的内边距 + 图标之间的垂直外边距) / (图标高度 + 图标名称 + 图标垂直外边距)
    var verSize = Math.floor((height - desktopBottomPadding - opt.desktopVerticalPadding + opt.closeBoxVerticalMargin) / (opt.closeBoxHeight + opt.closeBoxTitleHeight + opt.closeBoxVerticalMargin));
    // 一页的盒子数量
    var pageSize = horSize * verSize;
    // 页数
    // var pages = Math.ceil(opt.data.length / pageSize);
    opt.horSize = horSize;
    opt.verSize = verSize;
    opt.pageSize = pageSize;
    // opt.pages = pages;

    // 实际盒子的水平间距
    var closeBoxRealHorizontalMargin = (width - opt.desktopHorizontalPadding * 2 - opt.closeBoxWidth * horSize) / (horSize - 1);
    // 实际盒子的垂直间距
    var closeBoxRealVerticalMargin = (height - desktopBottomPadding - opt.desktopVerticalPadding - opt.closeBoxHeight * verSize - opt.closeBoxTitleHeight * verSize) / (verSize - 1);
    if (closeBoxRealVerticalMargin > opt.closeBoxHeight) {
      // 当垂直间距大于了盒子的高度时，通常是只有两行盒子时会出现(上方条件)
      // 此时缩小间距，不然看起来太丑了
      closeBoxRealVerticalMargin = opt.closeBoxHeight;
    }
    opt.closeBoxRealHorizontalMargin = closeBoxRealHorizontalMargin;
    opt.closeBoxRealVerticalMargin = closeBoxRealVerticalMargin;

    // 填充数据的位置信息，以及总页数
    fillLocation(opt.data, opt);

    // 记录下所有的格子
    var grids = {};
    // 记录下所有的分割线
    var separationLine = {
      lineX: [],
      lineY: []
    }
    var halfBoxWidth = opt.closeBoxWidth / 2;
    var halfBoxHeight = opt.closeBoxHeight / 2;
    // 循环行
    for (var i = 0; i < verSize; i++) {
      // 循环列
      for (var j = 0; j < horSize; j++) {
        var locationPoint = getLocationPoint(0, i, j, opt);
        var top = locationPoint.y;
        var bottom = top + opt.closeBoxHeight;
        var left = locationPoint.x;
        var right = left + opt.closeBoxWidth
        grids['g_' + i + '_' + j] = {
          top: top,
          bottom: bottom,
          left: left,
          right: right
        };
        if (i == 0) {
          // 如果当前是第一行(上方条件)
          // 则记录下所有纵向分割线
          separationLine.lineX.push(left - halfBoxWidth);
          // separationLine.lineX.push(left);
          separationLine.lineX.push(left + halfBoxWidth);
          // separationLine.lineX.push(right);
        }
        if (j == 0) {
          // 如果当前是第一页的第一列(上方条件)
          // 则记录下所有的横向分割线
          separationLine.lineY.push(top - halfBoxHeight);
          // separationLine.lineY.push(top);
          separationLine.lineY.push(top + halfBoxHeight);
          // separationLine.lineY.push(bottom);
        }
      } // 循环列结束
    } // 循环行结束
    // 右边的分割线(右边线 - 桌面水平内边距 + 半个格子的宽度)
    separationLine.lineX.push(opt.desktopWidth - opt.desktopHorizontalPadding + halfBoxWidth);
    // 下边的分割线(下边线 - 桌面的分页栏高度)
    separationLine.lineY.push(opt.desktopHeight - opt.pageHeight);
    opt.grids = grids;
    opt.separationLine = separationLine;
  }

  function separateBoxGrids($root, opt) {
    opt.openBoxWidth = opt.width - opt.openBoxMarginLeft - opt.openBoxMarginRight;
    opt.openBoxHeight = opt.height - opt.openBoxMarginTop - opt.openBoxMarginBottom;

    // 计算盒子内水平可以放几个图标
    // (打开盒子时里面容器的宽度 - 打开盒子时里面容器的左右的内边距 + 图标之间的水平外边距) / (图标的宽度 + 图标的水平外边距)
    var horIconSize = Math.floor((opt.openBoxWidth - opt.openBoxPadding * 2 + opt.closeBoxHorizontalMargin) / (opt.closeBoxWidth + opt.closeBoxHorizontalMargin));
    // 计算盒子内垂直方向可以放几个图标
    // (打开盒子时里面容器的高度 - 打开盒子时里面容器上下的内边距 + 图标之间的垂直外边距) / (图标高度 + 图标名称 + 图标垂直外边距)
    var verIconSize = Math.floor((opt.openBoxHeight - opt.openBoxPadding * 2 + opt.closeBoxVerticalMargin) / (opt.closeBoxHeight + opt.closeBoxTitleHeight + opt.closeBoxVerticalMargin));
    opt.horIconSize = horIconSize;
    opt.verIconSize = verIconSize;

    // 打开盒子内图标的实际水平间距
    var openBoxRealHorizontalMargin = (opt.openBoxWidth - opt.openBoxPadding * 2 - opt.closeBoxWidth * horIconSize) / (horIconSize - 1);
    // 打开盒子内图标的实际垂直间距
    // var openBoxRealVerticalMargin = (opt.openBoxHeight - opt.openBoxPadding * 2 - opt.closeBoxHeight * verIconSize - opt.closeBoxTitleHeight * verIconSize) / (verIconSize - 1);
    // if (openBoxRealVerticalMargin > opt.closeBoxHeight) {
    //   // 当垂直间距大于了盒子的高度时，通常是只有两行盒子时会出现(上方条件)
    //   // 此时缩小间距，不然看起来太丑了
    //   openBoxRealVerticalMargin = opt.closeBoxHeight;
    // }
    var openBoxRealVerticalMargin = opt.closeBoxVerticalMargin;
    opt.openBoxRealHorizontalMargin = openBoxRealHorizontalMargin;
    opt.openBoxRealVerticalMargin = openBoxRealVerticalMargin;

    // 填充数据的位置信息
    for (var i = 0; i < opt.data.length; i++) {
      var element = opt.data[i];
      if (element.children && element.children.length) {
        fillLocationInBox(element.children, element.location, opt);
      }
    }

    // 记录下所有的格子
    var boxGrids = {};
    // 记录下所有的分割线
    var separationBoxLine = {
      lineX: [],
      lineY: []
    }
    var halfBoxWidth = opt.closeBoxWidth / 2;
    var halfBoxHeight = opt.closeBoxHeight / 2;
    // 循环行
    for (var i = 0; i < verIconSize; i++) {
      // 循环列
      for (var j = 0; j < horIconSize; j++) {
        var locationPoint = getLocationPointInBox(i, j, opt);
        var top = locationPoint.y + opt.openBoxMarginTop;
        var bottom = top + opt.closeBoxHeight;
        var left = locationPoint.x + opt.openBoxMarginLeft;
        var right = left + opt.closeBoxWidth
        boxGrids['g_' + i + '_' + j] = {
          top: top,
          bottom: bottom,
          left: left,
          right: right
        };
        if (i === 0) {
          // 如果当前是第一行(上方条件)，则记录下所有纵向分割线
          if (j === 0) {
            separationBoxLine.lineX.push(opt.openBoxMarginLeft);
          } else {
            separationBoxLine.lineX.push(left - halfBoxWidth);
          }
          separationBoxLine.lineX.push(left + halfBoxWidth);
        }
        if (j === 0) {
          // 如果当前是第一页的第一列(上方条件)，则记录下所有的横向分割线
          if (i === 0) {
            separationBoxLine.lineY.push(opt.openBoxMarginTop);
          } else {
            separationBoxLine.lineY.push(top - halfBoxHeight);
          }
          separationBoxLine.lineY.push(top + halfBoxHeight);
        }
      } // 循环列结束
    } // 循环行结束
    // 右边的分割线(右边线 - 打开的盒子的右方外边距)
    separationBoxLine.lineX.push(opt.desktopWidth - opt.openBoxMarginRight);
    // 下边的分割线(下边线 - 打开的盒子的下方外边距)
    separationBoxLine.lineY.push(opt.desktopHeight - opt.openBoxMarginBottom);
    opt.boxGrids = boxGrids;
    opt.separationBoxLine = separationBoxLine;
  }

  /**
   * [getLocationPoint 获得桌面上的位置点，相对于桌面]
   * @param  {[type]} page [description]
   * @param  {[type]} row  [description]
   * @param  {[type]} col  [description]
   * @param  {[type]} opt  [description]
   * @return {[type]}      [description]
   */
  function getLocationPoint(page, row, col, opt) {
    var top, left;
    if (opt.verSize == 1) {
      top = (opt.desktopHeight - opt.closeBoxHeight - opt.closeBoxTitleHeight) / 2;
    } else {
      top = row * (opt.closeBoxHeight + opt.closeBoxRealVerticalMargin + opt.closeBoxTitleHeight) + opt.desktopVerticalPadding;
    }
    if (opt.horSize == 1) {
      left = (opt.desktopWidth - opt.closeBoxWidth) / 2;
    } else {
      left = col * (opt.closeBoxWidth + opt.closeBoxRealHorizontalMargin) + opt.desktopHorizontalPadding;
    }
    left += page * opt.desktopWidth;
    return {
      x: Math.floor(left),
      y: Math.floor(top)
    }
  }

  /**
   * [getLocationPointInBox 获得盒子中的位置点，相对于盒子]
   * @param  {[type]} row [description]
   * @param  {[type]} col [description]
   * @param  {[type]} opt [description]
   * @return {[type]}     [description]
   */
  function getLocationPointInBox(row, col, opt) {
    var top, left;
    if (opt.verIconSize == 1) {
      // 居中排列
      top = (opt.desktopHeight + opt.openBoxMargin - opt.closeBoxHeight - opt.closeBoxTitleHeight) / 2;
    } else {
      // 行数 * (图标高度 + 打开盒子时里面图标的实际间距 + 图标标题高度) + 打开盒子时里面容器的上方内边距
      top = row * (opt.closeBoxHeight + opt.openBoxRealVerticalMargin + opt.closeBoxTitleHeight) + opt.openBoxPadding;
    }
    if (opt.horIconSize == 1) {
      // 居中排列
      left = (opt.desktopWidth - opt.closeBoxWidth) / 2;
    } else {
      // 列数 * (图标宽度 + 打开盒子时里面图标的实际间距) + 打开盒子时里面容器的左方内边距
      left = col * (opt.closeBoxWidth + opt.openBoxRealHorizontalMargin) + opt.openBoxPadding;
    }
    return {
      x: Math.floor(left),
      y: Math.floor(top)
    }
  }

  /**
   * [fillLocation 填充数据的位置信息]
   * @param  {[type]} data [description]
   * @param  {[type]} opt  [description]
   * @return {[type]}      [description]
   */
  function fillLocation(data, opt) {
    var locationObj = opt.locationObj;
    clearObj(locationObj);

    var pageIndex = 0;

    for (var i = 0; i < data.length; i++) {
      var element = data[i];
      var elementSize = element.size;
      // 补上位置信息
      element.location = getFirstEmptyLocation(elementSize, opt);
      // 如果数据关联了dom节点，则修改dom节点的位置信息记录
      if (element.$dom) {
        setLocationAttr(element.$dom, element.location);
      }

      // 总页数计算
      var locationInfo = parseLocationInfo(element.location);
      if (locationInfo && locationInfo.page > pageIndex) {
        pageIndex = locationInfo.page;
      }
    }

    // 总页数为页序数+1
    opt.pages = pageIndex + 1;
    // console.log(data);
  }

  /**
   * [fillOtherLocation 向data中填充剩余的location]
   * @param  {[type]} data [description]
   * @param  {[type]} opt  [description]
   * @return {[type]}      [description]
   */
  function fillOtherLocation(data, opt) {
    var locationObj = opt.locationObj;
    var pageIndex = 0;
    var filledLocations = [];

    // debugger
    for (var i = 0; i < data.length; i++) {
      var element = data[i];
      var elementSize = element.size;
      if (!element.location) {
        // 如果位置信息不存在时(上方条件)，则补上位置信息
        element.location = getFirstEmptyLocation(elementSize, opt);
        filledLocations.push(element.location);
        // 如果数据关联了dom节点，则修改dom节点的位置信息记录
        if (element.$dom) {
          setLocationAttr(element.$dom, element.location);
        }
      }
      // 总页数计算
      var locationInfo = parseLocationInfo(element.location);
      if (locationInfo && locationInfo.page > pageIndex) {
        pageIndex = locationInfo.page;
      }
    }
    // 调整data顺序
    data.sort(sortByLocation);

    // 总页数为页序数+1
    opt.pages = pageIndex + 1;

    return filledLocations;
  }

  function fillLocationInBox(children, location, opt) {
    // var locationBoxObj = opt.locationBoxObj;
    // clearObj(locationBoxObj);

    for (var i = 0; i < children.length; i++) {
      var element = children[i];
      // 补上位置信息
      element.location = getFirstEmptyLocationInBox(location, opt);
      // 如果数据关联了dom节点，则修改dom节点的位置信息记录
      if (element.$dom) {
        setLocationAttr(element.$dom, element.location);
      }
    }
  }

  /**
   * [isLocationsNotOnePage 是否有位置不在同一页]
   * @param  {[type]}  page      [description]
   * @param  {[type]}  locations [description]
   * @return {Boolean}           [description]
   */
  function isLocationsNotOnePage(page, locations) {
    for (var i = 0; i < locations.length; i++) {
      var element = locations[i];
      var locationInfo = parseLocationInfo(element);
      if (page !== locationInfo.page) {
        // 如果位置页数有不是同一页的(上方条件)，则返回true
        return true;
      }
    }
    return false;
  }

  /**
   * [parseLocationInfo 从location中获取位置信息]
   * @param  {[type]} location [l_x_x_x]
   * @return {[type]}          [description]
   */
  function parseLocationInfo(location) {
    if (!location) {
      // 如果没有location信息，即该tool在桌面上放不下(上方条件)
      return null;
    }
    var arr = location.split('_');
    var page = parseInt(arr[1])
    var row = parseInt(arr[2]);
    var col = parseInt(arr[3]);
    return {
      page: page,
      row: row,
      col: col
    }
  }

  /**
   * [parseSizeInfo 从size中获取size信息]
   * @param  {[type]} size [description]
   * @return {[type]}      [description]
   */
  function parseSizeInfo(size) {
    size = size.replace(/\s*/g, '');
    var arrSize = size.split('x');
    var row = arrSize[0];
    var col = arrSize[1];
    return {
      row: parseInt(row),
      col: parseInt(col)
    }
  }

  /**
   * [setLocations 设置桌面上节点的位置]
   * @param {[type]} $dom    [description]
   * @param {[type]} domData [description]
   * @param {[type]} opt     [description]
   * @param {[type]} action  [description]
   */
  function setLocations($dom, domData, opt, action) {
    var locationInfo = parseLocationInfo(domData.location);
    var point;
    if (locationInfo.page === -1) {
      // 位置页数是-1(上方条件)，则说明在盒子里
      point = getLocationPointInBox(locationInfo.row, locationInfo.col, opt);
    } else {
      // 位置页数不是-1(上方条件)，则说明在桌面上
      point = getLocationPoint(locationInfo.page, locationInfo.row, locationInfo.col, opt);
    }
    // 将dom与数据绑定
    domData.$dom = $dom;
    // 节点设置位置属性
    setLocationAttr($dom, createLocation(locationInfo.page, locationInfo.row, locationInfo.col));

    // var locationDom = opt.locationDom;
    // locationDom[domData.location] = $dom;
    if (action === 'set') {
      $dom.css({
        'left': point.x + 'px',
        'top': point.y + 'px'
      });
    } else if (action === 'animate') {
      $dom.animate({
        'left': point.x + 'px',
        'top': point.y + 'px',
        'width': opt.closeBoxWidth + 'px',
        'height': opt.closeBoxHeight + 'px'
      });
    }

  }

  /**
   * [getFirstEmptyLocation 获得第一个空位置，并向locationObj中加入占位标志；如果没有，则返回null]
   * @param  {[type]} size [description]
   * @param  {[type]} opt  [description]
   * @return {[type]}      [description]
   */
  function getFirstEmptyLocation(size, opt) {
    // debugger
    var locationObj = opt.locationObj;
    // 页数
    var pageIndex = 0;
    // 位置(lx_x_x)
    var location;
    var sizeInfo = parseSizeInfo(size);
    var row = sizeInfo.row;
    var col = sizeInfo.col;
    // 用于存储占用位置的数组
    var locations;
    // 最大循环次数，避免死循环，循环十次依然找不到则认为没有足够的空间可以放置内容
    var maxCycleTimes = 10;
    // 当前循环次数
    var curCycleTimes = 0;
    outer:
    while (curCycleTimes < maxCycleTimes) {
      locations = getLocationsByPage(pageIndex++, row, col, opt);
      if (locations.length) {
        break;
      } else {
        curCycleTimes++;
      }
    }
    if (curCycleTimes >= maxCycleTimes) {
      // 如果循环次数达到了最大循环次数，即找不到足够大小放置工具(上方条件)
      return null;
    }
    // 匹配到空位置之后，把需要占用的位置存入locationObj中
    for (var i = 0; i < locations.length; i++) {
      locationObj[locations[i]] = createLocationRelativeInfo(locations[0], size);
    }
    return locations[0];
  }

  function getFirstEmptyLocationInBox(location, opt) {
    var locationBoxObj = opt.locationBoxObj;
    var locationIconObj = locationBoxObj[location] || {};
    var row = 0;
    var col = 0;
    var curLocation;
    outer:
    while (true) {
      for (var i = 0; i < opt.horIconSize; i++) {
        curLocation = createLocation(-1, row, i);
        if (!locationIconObj[curLocation]) {
          break outer;
        }
      }
      row++;
    }
    // 匹配到空位置之后，把需要占用的位置存入locationBoxObj中
    locationIconObj[curLocation] = createLocationRelativeInfo(curLocation, '1x1');
    // 赋值
    opt.locationBoxObj[location] = locationIconObj;
    return curLocation;
  }

  /**
   * [getLocationsByPage 获得对应页数位置占用情况]
   * @param  {[type]} page    [description]
   * @param  {[type]} rowSpan [description]
   * @param  {[type]} colSpan [description]
   * @param  {[type]} opt     [description]
   * @return {[type]}         [description]
   */
  function getLocationsByPage(page, rowSpan, colSpan, opt) {
    var locationObj = opt.locationObj;
    var locations = [];
    var total = rowSpan * colSpan;
    breakPage:
    for (var i = 0; i < opt.verSize; i++) {
      breakRow:
      for (var j = 0; j < opt.horSize; j++) {
        // l页数_行数_列数
        var location = createLocation(page, i, j);
        if (!locationObj[location]) {
          // 第一个空位置(上方条件)
          locations.push(location);
          // 循环行尺寸，从0开始，即1x时会有一行循环
          breakCol:
          for (var ii = 0; ii < rowSpan; ii++) {
            var curRow = i + ii;
            if (curRow >= opt.verSize) {
              // 如果超出了最大行数(上方条件)
              // 则进入到下一页
              locations = [];
              break breakPage;
            }
            // 循环列尺寸，从0开始，即nx时会有n次循环
            for (var jj = 0; jj < colSpan; jj++) {
              // 第一个位置去掉判断，因为第一个位置为空时才能进来
              if (ii == 0 && jj == 0) {
                continue;
              }
              // 则首先判断该尺寸一行的大小是否合适
              var curCol = j + jj;
              var loc = createLocation(page, curRow, curCol);
              if (curCol >= opt.horSize) {
                // 如果超出了最大列数(上方条件)，则进入到下一行的判断
                locations = [];
                break breakRow;
              } else if (locationObj[loc]) {
                // 如果该位置有东西占用了(上方条件)，则进入到下一列的判断
                locations = [];
                break breakCol;
              } else {
                // 如果是空的(上方条件)
                // 则加入位置数组
                locations.push(loc);
              }
            }
          }
          if (locations.length === total) {
            // 如果占用位置与尺寸所需位置相同时(上方条件)，则说明找到合适的位置，结束循环
            break breakPage;
          }
        }
      }
    }
    return locations;
  }

  function createLocationRelativeInfo(location, size) {
    return {
      location: location,
      size: size,
      isOccupied: true
    }
  }

  function createLocation(page, row, col) {
    return 'l_' + page + '_' + row + '_' + col;
  }

  /**
   * [getMoveLocation 获得移动节点占用的所有格子]
   * @param  {[type]} $dom             [移动节点jquerydom]
   * @param  {[type]} size             [移动节点的大小]
   * @param  {[type]} currentPageIndex [当前页数]
   * @param  {[type]} desktopWidth     [桌面宽度]
   * @param  {[type]} separationLine   [分割线]
   * @param  {[type]} rowSize          [格子的行数]
   * @param  {[type]} colSize          [格子的列数]
   * @return {[type]}                  [description]
   */
  function getMoveLocation($dom, size, currentPageIndex, desktopWidth, separationLine, rowSize, colSize) {
    // 当前页数
    var currentPageIndex = currentPageIndex;
    // 换算到第一个桌面上需要减去的长度
    var minusWidth = currentPageIndex * desktopWidth;

    var left = parseInt($dom.css('left')) - minusWidth;
    var top = parseInt($dom.css('top'));
    var width = parseInt($dom.css('width'));
    var height = parseInt($dom.css('height'));
    var centerX = left + width / 2;
    var centerY = top + height / 2;
    var lineX = separationLine.lineX;
    var lineY = separationLine.lineY;

    if (centerX <= lineX[0]) {
      // 如果中点在第一条纵向分割线的左边(上方条件)
      // console.log('left')
      return {
        pos: 'left'
      }
    } else if (centerX >= lineX[lineX.length - 1]) {
      // 如果中点在最后一条纵向分割线的右边(上方条件)
      // console.log('right')
      return {
        pos: 'right'
      }
    } else if (centerY <= lineY[0]) {
      // 如果中点在第一条横向分割线的上边(上方条件)
      // console.log('top')
      return {
        pos: 'top'
      }
    } else if (centerY >= lineY[lineY.length - 1]) {
      // 如果中点在最后一条横向分割线的下边(上方条件)
      // console.log('bottom')
      return {
        pos: 'bottom'
      }
    }
    // 除了上面的其他位置，说明物体在中间的容器范围内
     
    // 格子的行列变量
    var row = null, col = null;
    // 是否在行列之中变量
    var isEnterRow, isEnterCol;

    for (var i = 0; i < lineX.length - 1; i++) {
      var x = lineX[i];
      if (left <= x) {
        // 如果当前位置在纵向分割线的左边(上方条件)，则确定列
        if (i == 0 && size !== '1x1') {
          // 如果左侧位置在第一条分割线的左边(上方条件)
          return {
            pos: 'over'
          }
        } else {
          col = Math.floor(i / 2);
          isEnterCol = (i % 2 !== 0);
        }
        break;
      }
    }

    for (var i = 0; i < lineY.length; i++) {
      var y = lineY[i];
      if (top <= y) {
        // 如果当前位置在横向分割线的上边(上方条件)，则确定行
        if (i == 0) {
          // debugger
          return {
            pos: 'over'
          }
        } else {
          row = Math.floor(i / 2);
          isEnterRow = (i % 2 !== 0);
        }
        break;
      }
    }

    var sizeInfo = parseSizeInfo(size);
    // 判断当前物体有没有超出当前容器
    if (row == null || col == null || row + sizeInfo.row > rowSize || col + sizeInfo.col > colSize) {
      // debugger
      // 如果容器超出当前容器
      return {
        pos: 'over'
      }
    }

    // 记录下物体占用的所有格子
    var locations = [];
    for (var i = 0; i < sizeInfo.row; i++) {
      for (var j = 0; j < sizeInfo.col; j++) {
        locations.push(createLocation(currentPageIndex, row + i, col + j));
      }
    }

    // 除了上面的条件，则物体完全在容器之中
    return {
      row: row,
      col: col,
      location: createLocation(currentPageIndex, row, col),
      pos: 'center',
      locations: locations,
      isEnter: isEnterRow && isEnterCol
    }
  }

  /**
   * [moveToLocation 在桌面上移动到指定位置]
   * @param  {[type]} $dom [description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  function moveToLocation($dom, domData, data, opt) {
    var moveLocation = getMoveLocation($dom, domData.size, opt.currentPageIndex, opt.desktopWidth, opt.separationLine, opt.verSize, opt.horSize);
    var pos = moveLocation.pos;
    if (pos !== 'center') {
      cancelGroupAndJoin(opt);
    }
    if (pos === 'left') {
      // 如果向左翻页(上方条件)
      var isTurned = turnPage($dom.parents('.icondesktop'), opt.currentPageIndex - 1, opt.width, opt.pages, opt);
      if (isTurned) {
        // 如果翻页了(上方条件)，则拖动物体移动到对应位置
        $dom.animate({
          'left': '-=' + opt.desktopWidth + 'px'
        });
      }
    } else if (pos === 'right') {
      // 如果向右翻页(上方条件)
      var isTurned = turnPage($dom.parents('.icondesktop'), opt.currentPageIndex + 1, opt.width, opt.pages, opt);
      if (isTurned) {
        // 如果翻页了(上方条件)，则拖动物体移动到对应位置
        $dom.animate({
          'left': '+=' + opt.desktopWidth + 'px'
        });
      }
    } else if (pos === 'top' || pos === 'bottom' || pos === 'over') {
      // 如果是在上方或是下方或是超过中央容器(上方条件)
      // 则不处理
    } else {
      // 如果物体完全在中央容器内(上方条件)
      // 则计算新的data
      // console.log(domData.location + '-' + moveLocation.location)
      if (domData.location === moveLocation.location) {
        // 还没有移出当前格子(上方条件)
        console.log('cancel')
        cancelGroupAndJoin(opt);
      } else if (domData.img) {
        // 如果移动的物体是一个图标(上方条件)
        if (moveLocation.isEnter) {
          // 如果是移入状态(上方条件)，则判断移入位置是图标、盒子、还是工具
          var theData = getDataByLocation(moveLocation.location, data, opt.locationObj);
          if (theData == null) {
            // 如果该位置为空(上方条件)，则直接移动过来
            moveTool(opt.flagObj, domData, data, moveLocation, opt.locationObj, opt);
          } else if (theData.img) {
            // 如果是图标(上方条件)，则显示放大的盒子背景
            // groupIcons(domData, data, moveLocation, opt);
            console.log('enlarge')
            cancelJoinBox(opt);
            showGroupBox(theData.$dom, opt);
          } else if (theData.type === 'tool') {
            // 如果是工具(上方条件)，则移动
            moveIconOrBox(opt.flagObj, domData, data, moveLocation, opt.locationObj, opt);
          } else {
            // 除了图标、工具，就剩下盒子(上方条件)，则盒子放大
            cancelGroupIcons(opt);
            if (theData.$dom !== opt.moveIconObj.$prevIconBelow) {
              cancelJoinBox(opt);
            }
            enlargeBox(theData.$dom, opt);
          }
        } else {
          // 如果是在前方的状态(上方条件)
          // 则判断移动物体与相关物体的前后关系
          moveIconOrBox(opt.flagObj, domData, data, moveLocation, opt.locationObj, opt);
        }
      } else if (domData.type === 'tool') {
        // 如果移动的物体是一个工具(上方条件)
        // 在前方的状态与在一起的状态处理相同
        // 则判断移动物体与相关物体的前后关系
        moveTool(opt.flagObj, domData, data, moveLocation, opt.locationObj, opt);
      } else {
        // 如果移动的物体是一个盒子(上方条件)
        // 在前方的状态与在一起的状态处理相同
        // 则判断移动物体与相关物体的前后关系
        moveIconOrBox(opt.flagObj, domData, data, moveLocation, opt.locationObj, opt);
      }
    }
  }

  /**
   * [moveToLocationInBox 在盒子中移动到指定位置]
   * @param  {[type]} $dom     [description]
   * @param  {[type]} domData  [description]
   * @param  {[type]} children [description]
   * @param  {[type]} opt      [description]
   * @return {[type]}          [description]
   */
  function moveToLocationInBox($dom, domData, children, opt) {
    var moveLocation = getMoveLocation($dom, domData.size, opt.currentPageIndex, opt.desktopWidth, opt.separationBoxLine, opt.verSize, opt.horSize);
    var pos = moveLocation.pos;
    debugger
    if (pos === 'left' || pos === 'right' || pos === 'top' || pos === 'bottom') {
      // 如果移出盒子(上方条件)
      console.log('移出盒子')
      closeIconBox(domData.$dom.parents('.icondesktopbox'), opt);
      $dom.removeClass('iconinbox').addClass('icondesktopbox');
    } else if (pos === 'over') {
      // 如果放不下(上方条件)，则不作任何处理
      
    } else {
      // 如果物体完全在中央容器内(上方条件)
      // 则计算新的data
      if (domData.location === moveLocation.location) {
        // 还没有移出当前格子(上方条件)，则不作处理
        
      } else if (domData.img) {
        // 如果移动的物体是一个图标(上方条件)
        if (moveLocation.isEnter) {
          // 如果是移入状态(上方条件)，则判断移入位置是图标、盒子、还是工具
          var theData = getDataByLocation(moveLocation.location, children, opt.locationObj);
          if (theData == null) {
            // 如果该位置为空(上方条件)，则直接移动过去
            moveTool(opt.flagObj, domData, children, moveLocation, opt.locationBoxObj[domData.location], opt);
          } else if (theData.img) {
            // 如果是图标(上方条件)，则移动过去
            console.log(domData.location)
            moveIconOrBox(opt.flagObj, domData, children, moveLocation, opt.locationBoxObj[domData.location], opt);
          } else if (theData.type === 'tool') {
            // 如果是工具(上方条件)，目前不可能
            
          } else {
            // 除了图标、工具，就剩下盒子(上方条件)，目前不可能
            
          }
        } else {
          // 如果是在前方的状态(上方条件)
          // 则判断移动物体与相关物体的前后关系
          moveIconOrBox(opt.flagObj, domData, children, moveLocation, opt.locationBoxObj[domData.location], opt);
        }
      } else if (domData.type === 'tool') {
        // 如果移动的物体是一个工具(上方条件)，目前不可能
        
      } else {
        // 如果移动的物体是一个盒子(上方条件)，目前不可能
        
      }
    }
  }

  /**
   * [cancelGroupIcons 取消图标组合]
   * @param  {[type]} opt [description]
   * @return {[type]}     [description]
   */
  function cancelGroupIcons(opt) {
    // 隐藏放大盒子背景
    opt.$closeBoxBackground.hide();
  }

  function cancelJoinBox(opt) {
    var moveIconObj = opt.moveIconObj;
    var $prevIconBelow = moveIconObj.$prevIconBelow;
    if ($prevIconBelow.hasClass('iconbox__close') && $prevIconBelow.attr('prevLeft')) {
      // 如果是盒子，并且记录有之前的位置信息(上方条件)，则恢复
      var theLeft = parseInt($prevIconBelow.attr('prevLeft'));
      var theTop = parseInt($prevIconBelow.attr('prevTop'));
      var theWidth = opt.closeBoxWidth;
      var theHeight = opt.closeBoxHeight;
      recoverDom($prevIconBelow, null, theLeft, theTop, theWidth, theHeight, true, opt.closeBoxPadding);
      // 恢复后清除位置记录
      clearDomPrevAttr($prevIconBelow);
    }
  }

  /**
   * [clearDomPrevAttr 清除节点之前记录的位置属性]
   * @param  {[type]} $dom [description]
   * @return {[type]}      [description]
   */
  function clearDomPrevAttr($dom) {
    $dom.attr({
      'prevLeft': '',
      'prevTop': ''
    });
  }

  // function showFlagDom(opt) {
  //   var moveIconObj = opt.moveIconObj;
  //   // 清空前一个被遮挡的节点，因为该值只有在移入可能发生组合的时候才会发生改变，避免移出后发生组合
  //   moveIconObj.$prevIconBelow = moveIconObj.$empty;
  //   // 显示移动指示物
  //   showFlagDom(opt);
  // }

  function cancelGroupAndJoin(opt) {
    cancelGroupIcons(opt);
    cancelJoinBox(opt);
    var moveIconObj = opt.moveIconObj;
    // 清空前一个被遮挡的节点，因为该值只有在移入可能发生组合的时候才会发生改变，避免移出后发生组合
    moveIconObj.$prevIconBelow = moveIconObj.$empty;
    showFlagDom(opt);
  }

  /**
   * [moveIconOrBox 移动图标或盒子的方法]
   * @param  {[type]} $flagDom     [移动的节点]
   * @param  {[type]} domData      [节点data]
   * @param  {[type]} data         [数组]
   * @param  {[type]} moveLocation [description]
   * @param  {[type]} opt          [description]
   * @return {[type]}              [description]
   */
  function moveIconOrBox($flagDom, domData, data, moveLocation, locationObj, opt) {
    cancelGroupAndJoin(opt);
    clearObj(locationObj);
    locationObj[moveLocation.location] = createLocationRelativeInfo(moveLocation.location, domData.size);
    clearDataLocation(data);
    domData.location = moveLocation.location;
    setLocationAttr($flagDom, domData.location);
    setLocationAttr(domData.$dom, domData.location);
    
    var pages = opt.pages;
    fillOtherLocation(data, opt);
    adjustPageBox(domData.$dom, pages, opt.pages);
    animateDoms(data, opt, getIndexByLocation(moveLocation.location, data, opt));
  }

  function getPageBox($icon) {
    return $icon.parents('.icondesktop-slidebox').next().children().eq(0);
  }

  /**
   * [moveTool 移动工具的方法]
   * @param  {[type]} $flagDom     [移动的节点]
   * @param  {[type]} domData      [description]
   * @param  {[type]} data         [description]
   * @param  {[type]} moveLocation [description]
   * @param  {[type]} opt          [description]
   * @return {[type]}              [description]
   */
  function moveTool($flagDom, domData, data, moveLocation, locationObj, opt) {
    cancelGroupAndJoin(opt);
    // 清除工具原来位置的占用信息
    var occupiedLocations = getOccupiedLocations(domData.location, domData.size);
    for (var i = 0; i < occupiedLocations.length; i++) {
      var element = occupiedLocations[i];
      delete locationObj[element];
    }

    // 清除掉移动工具需要占用的位置的位置信息
    for (var i = 0; i < moveLocation.locations.length; i++) {
      var element = moveLocation.locations[i];
      // 查询这些位置对应的data中的数据
      var dData = getDataByLocation(element, data, locationObj);
      if (dData) {
        // 删除这些data数据对应的location信息
        delete dData.location;
      }
      // 查询该位置所属物体占用的位置
      if (locationObj[element]) {
        var oLocations = getOccupiedLocations(locationObj[element].location, locationObj[element].size);
        // 去掉这些占用位置
        for (var j = 0; j < oLocations.length; j++) {
          var ele = oLocations[j];
          delete locationObj[ele];
        }
      }
      // 加上移动工具占用的位置
      locationObj[element] = createLocationRelativeInfo(moveLocation.location, domData.size);
    }

    // 移动工具原始位置信息
    var domLocationInfo = parseLocationInfo(domData.location);

    // 修改移动工具对应数据的位置信息
    domData.location = moveLocation.location;
    setLocationAttr($flagDom, domData.location);
    setLocationAttr(domData.$dom, domData.location);

    // debugger
    var pages = opt.pages;
    // 填充删除的位置信息与占用信息
    var filledLocations = fillOtherLocation(data, opt);
    if (isLocationsNotOnePage(domLocationInfo.page, filledLocations)) {
      // 如果有位置不在同一页(上方条件)，则暂时不作变化，后期修改
      adjustPageBox(domData.$dom, pages, opt.pages);
      animateDoms(data, opt, getIndexByLocation(moveLocation.location, data, opt));
    } else {
      // 如果位置都在同一页(上方条件)，则继续移动
      adjustPageBox(domData.$dom, pages, opt.pages);
      animateDoms(data, opt, getIndexByLocation(moveLocation.location, data, opt));
    }
  }

  function moveIconInBox(domData, data, moveLocation, opt) {
     // body...
   }

  /**
   * [showGroupBox 显示放大的盒子背景]
   * @param  {[type]} $iconBelow [description]
   * @param  {[type]} opt        [description]
   * @return {[type]}            [description]
   */
  function showGroupBox($iconBelow, opt) {
    var moveIconObj = opt.moveIconObj;
    var $closeBoxBackground = opt.$closeBoxBackground;
    // 隐藏指示位置图标
    hideFlagDom(opt);
    moveIconObj.$iconBelow = $iconBelow;
    if ($iconBelow !== moveIconObj.$prevIconBelow) {
      // 如果当前位置所在图标与上一个位置所在图标不同(上方条件)，则显示
      // 提高高度，使图标置于盒子框的上方
      $iconBelow.css({'zIndex': 2});
      $closeBoxBackground.css({
        'left': $iconBelow.css('left'),
        'top': $iconBelow.css('top'),
        'width': opt.closeBoxWidth + 'px',
        'height': opt.closeBoxHeight + 'px',
        'display': 'block'
      })
      var theLeft = parseInt($iconBelow.css('left'));
      var theTop = parseInt($iconBelow.css('top'));
      enlargeDom($closeBoxBackground, theLeft, theTop, opt.closeBoxWidth, opt.closeBoxHeight, opt);
    }
    moveIconObj.$prevIconBelow = $iconBelow;
  }

  /**
   * [enlargeDom 放大节点]
   * @param  {[type]}  $dom   [description]
   * @param  {[type]}  left   [description]
   * @param  {[type]}  top    [description]
   * @param  {[type]}  width  [description]
   * @param  {[type]}  height [description]
   * @param  {[type]}  opt    [description]
   * @param  {Boolean} isBox  [description]
   * @return {[type]}         [description]
   */
  function enlargeDom($dom, left, top, width, height, opt, isBox) {
    $dom.stop().animate({
      'left': left - opt.closeBoxEnlargeWidth + 'px',
      'top': top - opt.closeBoxEnlargeHeight + 'px',
      'width': width + opt.closeBoxEnlargeWidth * 2 + 'px',
      'height': height + opt.closeBoxEnlargeHeight * 2 + 'px'
    }, {
      'duration': 'fast',
      'easing': 'swing',
      'step': function () {
        $dom.css('overflow', 'visible');
      }
    });
    if (isBox) {
      // 如果是盒子(上方条件)，则调整盒子内容器的内边距
      $dom.find('.iconbox-area__container').animate({
        'margin': opt.closeBoxEnlargeWidth + 'px'
      }, 'fast', function () {
      });
    }
  }

  /**
   * [recoverDom 恢复放大的节点]
   * @param  {[type]}  $flagDom        [description]
   * @param  {[type]}  $this           [description]
   * @param  {[type]}  left            [description]
   * @param  {[type]}  top             [description]
   * @param  {[type]}  width           [description]
   * @param  {[type]}  height          [description]
   * @param  {Boolean} isBox           [description]
   * @param  {[type]}  closeBoxPadding [description]
   * @return {[type]}                  [description]
   */
  function recoverDom($flagDom, $this, left, top, width, height, isBox, closeBoxPadding) {
    $flagDom.animate({
      'left': left + 'px',
      'top': top + 'px',
      'width': width + 'px',
      'height': height + 'px'
    }, {
      'duration': 'fast',
      'easing': 'swing',
      'step': function () {
        $flagDom.css('overflow', 'visible');
      },
      'complete': function () {
        if ($this === null) {
          $flagDom.css({
            'cursor': 'pointer',
            'zIndex': 1
          });
        } else {
          $this.css({
            // 'left': left + 'px',
            // 'top': top + 'px',
            'cursor': 'pointer',
            'zIndex': 1,
            'opacity': 1
          });
          $flagDom.remove();
        }
      }
    });
    if (isBox) {
      // 如果是盒子(上方条件)，则调整盒子内容器的内边距
      $flagDom.find('.iconbox-area__container').animate({
        'margin': '0px'
      }, 'fast', function () {
        
      });
    }
  }

  /**
   * [enlargeBox 放大盒子]
   * @param  {[type]} $iconBelow [description]
   * @param  {[type]} opt        [description]
   * @return {[type]}            [description]
   */
  function enlargeBox($iconBelow, opt) {
    var iconLeft = parseInt($iconBelow.css('left'));
    var iconTop = parseInt($iconBelow.css('top'));
    var iconWidth = parseInt($iconBelow.css('width'));
    var iconHeight = parseInt($iconBelow.css('height'));
    var moveIconObj = opt.moveIconObj;
    // 隐藏指示位置图标
    hideFlagDom(opt);
    moveIconObj.$iconBelow = $iconBelow;
    if (!$iconBelow.attr('prevLeft')) {
      // 如果盒子没有放大，即没有原始位置记录(上方条件)
      // 则先记录盒子的当前状态，然后再变换，便于恢复
      $iconBelow.attr({
        'prevLeft': iconLeft + 'px',
        'prevTop': iconTop + 'px',
        'prevWidth': iconWidth + 'px',
        'prevHeight': iconHeight + 'px'
      })
      enlargeDom($iconBelow, iconLeft, iconTop, iconWidth, iconHeight, opt, true);
    }
    moveIconObj.$prevIconBelow = $iconBelow;
  }

  function showFlagDom(opt) {
    if (opt.moveObj) {
      opt.moveObj.show();
    }
  }

  function hideFlagDom(opt) {
    if (opt.moveObj) {
      opt.moveObj.hide();
    }
  }

  // function groupIcons(domData, data, moveLocation, opt) {
  //   var $dom = domData.$dom;
  //   var moveIndex = getIndexByLocation(moveLocation.location, data, opt);
  //   var $dstDom = data[moveIndex].$dom;
  //   var dstData = groupData(data, getIconIndex($dom, opt), moveIndex, opt);
  //   var $groupObj = groupDoms($dom, $dstDom, opt, dstData);
  //   $this = $groupObj.$this;
  //   $iconBelow = $groupObj.$iconBelow;
  //   recoverIconBelow(opt);
  // }

  /**
   * [adjustPageBox 调整分页栏图标数量]
   * @param  {[type]} $icon     [description]
   * @param  {[type]} prevPages [description]
   * @param  {[type]} curPages  [description]
   * @return {[type]}           [description]
   */
  function adjustPageBox($icon, prevPages, curPages) {
    var $pageBox = getPageBox($icon);
    if (curPages > prevPages) {
      // 如果当前页数增加了(上方条件)
      for (var i = 0; i < curPages - prevPages; i++) {
        addPageNum($pageBox);
      }
    } else {
      // 如果当前页数没有增加(上方条件)
      for (var i = 0; i < prevPages - curPages; i++) {
        delPageNum($pageBox);
      }
    }
  }

  /**
   * [clearDataLocation 清空data中所有的location]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  function clearDataLocation(data) {
    for (var i = 0; i < data.length; i++) {
      var element = data[i];
      if (element.location) {
        delete element.location;
      }
    }
  }

  function getMoveIndexAndRelativeIndex(domData, data, moveLocation, opt) {
    var locationObj = opt.locationObj;
    // 移动物体关联的数据在data中的序数
    var moveIndex = getIndexByLocation(domData.location, data, opt);
    // 移动到的位置所在的物体关联的数据在data中的序数
    var relativeIndex;
    // debugger
    if (!locationObj[moveLocation.location]
      || moveLocation.location !== locationObj[moveLocation.location].location) {
      // 该位置不是一个左上角位置(上方条件)
      // 如果移动到的位置没有物体左上角所在(上方条件)，则取该位置后最近的一个左上角位置
      var sizeInfo = parseSizeInfo(domData.size);
      var nextLocation = getNearestNextLocation(moveLocation.location, opt, sizeInfo.row, sizeInfo.col);
      if (nextLocation == null) {
        relativeIndex = -1;
      } else {
        relativeIndex = getIndexByLocation(nextLocation, data, opt);
      }
    } else {
      relativeIndex = getIndexByLocation(moveLocation.location, data, opt);
    }
    return {
      moveIndex: moveIndex,
      relativeIndex: relativeIndex
    }
  }

  /**
   * [setLocationAttr 设置节点的location属性]
   * @param {[type]} $dom     [description]
   * @param {[type]} location [description]
   */
  function setLocationAttr($dom, location) {
    $dom.attr('location', location);
  }

  /**
   * [isFirstDomBefore 是否第一个节点在前面]
   * @param  {[type]}  location1 [description]
   * @param  {[type]}  location2 [description]
   * @return {Boolean}           [description]
   */
  function isFirstDomBefore(location1, location2) {
    var locationInfo1 = parseLocationInfo(location1);
    var locationInfo2 = parseLocationInfo(location2);
    if (locationInfo1.row < location2.row) {
      return true;
    } else if (locationInfo1.row > location2.row) {
      return false;
    } else if (locationInfo1.col < location2.col) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * [animateDoms 动画移动所有节点]
   * @param  {[type]} data [description]
   * @param  {[type]} opt  [description]
   * @return {[type]}      [description]
   */
  function animateDoms(data, opt, excludeIndex) {
    for (var i = 0; i < data.length; i++) {
      var element = data[i];
      var $dom = element.$dom;
      var location = element.location;
      if (i === excludeIndex) {
        showToLocation(opt.moveObj, location, opt);
      } else {
        animateToLocation($dom, location, opt);
      }
    }
  }

  /**
   * [animateToLocation 动画移动到指定位置]
   * @param  {[type]} $dom     [description]
   * @param  {[type]} location [description]
   * @param  {[type]} opt      [description]
   * @return {[type]}          [description]
   */
  function animateToLocation($dom, location, opt) {
    var locationInfo = parseLocationInfo(location);
    if (locationInfo.page === -1) {
      // 如果页数是-1(上方条件)，则说明在盒子中
      var locationPoint = getLocationPointInBox(locationInfo.row, locationInfo.col, opt);
      $dom.animate({
        'left': locationPoint.x + 'px',
        'top': locationPoint.y + 'px'
      });
    } else {
      // 如果页数不是-1(上方条件)，则说明在桌面上
      var locationPoint = getLocationPoint(locationInfo.page, locationInfo.row, locationInfo.col, opt);
      $dom.animate({
        'left': locationPoint.x + 'px',
        'top': locationPoint.y + 'px'
      });
    }
  }

  /**
   * [showToLocation 直接移动到指定位置]
   * @param  {[type]} $dom     [description]
   * @param  {[type]} location [description]
   * @param  {[type]} opt      [description]
   * @return {[type]}          [description]
   */
  function showToLocation($dom, location, opt) {
    var locationInfo = parseLocationInfo(location);
    if (locationInfo.page === -1) {
      // 如果页数是-1(上方条件)，则说明在盒子中
      var locationPoint = getLocationPointInBox(locationInfo.row, locationInfo.col, opt);
      $dom.css({
        'left': locationPoint.x + 'px',
        'top': locationPoint.y + 'px'
      });
    } else {
      // 如果页数不是-1(上方条件)，则说明在桌面上
      var locationPoint = getLocationPoint(locationInfo.page, locationInfo.row, locationInfo.col, opt);
      $dom.css({
        'left': locationPoint.x + 'px',
        'top': locationPoint.y + 'px'
      });
    }
  }

  /**
   * [getIndexByLocation 根据位置信息查询在data中的序数]
   * @param  {[type]} location [description]
   * @param  {[type]} data     [description]
   * @param  {[type]} opt      [description]
   * @return {[type]}          [description]
   */
  function getIndexByLocation(location, data, opt) {
    var locationObj = opt.locationObj;
    var locationRelativeInfo = locationObj[location];
    if (!locationRelativeInfo) {
      return null;
    }
    var loc = locationRelativeInfo.location;
    for (var i = 0; i < data.length; i++) {
      var element = data[i];
      if (element.location === loc) {
        return i;
      }
    }
    return null;
  }

  /**
   * [getDataByLocation 根据位置信息查询对应数据]
   * @param  {[type]} location    [description]
   * @param  {[type]} data        [description]
   * @param  {[type]} locationObj [description]
   * @return {[type]}             [description]
   */
  function getDataByLocation(location, data, locationObj) {
    var locationRelativeInfo = locationObj[location];
    if (!locationRelativeInfo) {
      return null;
    }
    var loc = locationRelativeInfo.location;
    for (var i = 0; i < data.length; i++) {
      var element = data[i];
      if (element.location === loc) {
        return element;
      }
    }
    return null;
  }

  /**
   * [getNearestPrevLocation 获得对应位置最近的前一个左上角位置]
   * @param  {[type]} location [description]
   * @param  {[type]} opt      [description]
   * @return {[type]}          [description]
   */
  function getNearestPrevLocation(location, opt) {
    // 每页的行列
    var row = opt.verSize;
    var col = opt.horSize;
    // 位置的页序数行列
    var locationInfo = parseLocationInfo(location);
    var page = locationInfo.page;
    var r = locationInfo.row;
    var c = locationInfo.col;
    var locationObj = opt.locationObj;
    for (var i = r; i >= 0; i--) {
      // 开始行从c - 1列开始，其他行从最后开始
      var j = (i === r) ? c - 1 : col - 1;
      for (; j >= 0; j--) {
        var loc = createLocation(page, i, j);
        var locationRelativeInfo = locationObj[loc];
        if (locationRelativeInfo.location === loc) {
          return loc;
        }
      }
    }
    return null;
  }

  /**
   * [getNearestNextLocation 获得对应位置最近的后一个左上角位置]
   * @param  {[type]} location [description]
   * @param  {[type]} opt      [description]
   * @return {[type]}          [description]
   */
  function getNearestNextLocation(location, opt, rowSpan, colSpan) {
    // 每页的行列
    var row = opt.verSize;
    var col = opt.horSize;
    // 位置的页序数行列
    var locationInfo = parseLocationInfo(location);
    var page = locationInfo.page;
    var r = locationInfo.row;
    var c = locationInfo.col;
    var locationObj = opt.locationObj;
    var loc, locationRelativeInfo;
    for (var i = r; i < row; i++) {
      // 开始行从c + colSpan开始，其他行从0开始
      var j = (i === r) ? c + colSpan : 0;
      for (; j < col; j++) {
        loc = createLocation(page, i, j);
        locationRelativeInfo = locationObj[loc];
        if (locationRelativeInfo && locationRelativeInfo.location === loc) {
          return loc;
        }
      }
    }
    // 当前页没找到，则找下一页
    for (var i = 0; i < row; i++) {
      for (var j = 0; j < col; j++) {
        loc = createLocation(page + 1, i, j);
        locationRelativeInfo = locationObj[loc];
        if (locationRelativeInfo && locationRelativeInfo.location === loc) {
          return loc;
        }
      }
    }
    // 如果下一页都还没有，则说明后面没有数据了
    return null;
  }

  /**
   * [addMoveLocation 添加一条移动位置记录]
   * @param {[type]} moveLocation [description]
   * @param {[type]} opt          [description]
   */
  function addMoveLocation(moveLocation, opt) {
    var moveLocations = opt.moveLocations;
    if (moveLocations.length >= opt.moveLocationMaxLength) {
      // 如果移动位置记录不小于2(上方条件)
      // 则先去掉最早的记录
      moveLocations.shift();
    }
    // 添加新记录
    moveLocations.push(moveLocations);
  }

  /**
   * [clearMoveLocation 清空移动位置记录]
   * @param  {[type]} opt [description]
   * @return {[type]}     [description]
   */
  function clearMoveLocation(opt) {
    var moveLocations = opt.moveLocations;
    moveLocations.length = 0;
  }

  /**
   * [isMoveLocationActive 当前移动位置是否生效。如果生效，则清空移动位置记录]
   * @param  {[type]}  moveLocation [description]
   * @param  {[type]}  opt          [description]
   * @return {Boolean}              [description]
   */
  function isMoveLocationActive(moveLocation, opt) {
    addMoveLocation(moveLocation, opt);
    var isAllSame = isAllMoveLocationsSame(opt.moveLocations, opt);
    // 移动位置相同时，将会清空移动位置记录，用于之后重新比较
    if (isAllSame) {
      clearMoveLocation(opt);
    }
    return isAllSame;
  }

  /**
   * [isAllMoveLocationsSame 判断是否所有的移动位置都相同。移动位置记录不足moveLocationMaxLength时，算不相同]
   * @param  {[type]}  moveLocations [description]
   * @param  {[type]}  opt           [description]
   * @return {Boolean}               [description]
   */
  function isAllMoveLocationsSame(moveLocations, opt) {
    // 移动位置记录不够moveLocationMaxLength时都算不相同
    if (moveLocations.length < opt.moveLocationMaxLength) {
      return false;
    }
    var temp;
    var isAllSame = true;
    for (var i = 0; i < moveLocations.length; i++) {
      var element = moveLocations[i];
      if (i === 0) {
        temp = element;
      } else {
        if (!isMoveLocationsSame(temp, element)) {
          isAllSame = false;
          break;
        }
      }
    }
    return isAllSame;
  }

  /**
   * [isMoveLocationsSame 判断两个移动位置(移动物体的左上方点所在位置)是否相同]
   * @param  {[type]}  moveLocation1 [description]
   * @param  {[type]}  moveLocation2 [description]
   * @return {Boolean}               [description]
   */
  function isMoveLocationsSame(moveLocation1, moveLocation2) {
    if (moveLocation1.pos !== moveLocation2.pos) {
      return false;
    }
    // 经过上方条件，此时两个pos相同
    if (moveLocation1.pos !== 'center') {
      return true;
    }
    // 经过上方条件，此时pos为center
    if (moveLocation1.row === moveLocation2.row && moveLocation1.col === moveLocation2.col
      && moveLocation1.isEnter === moveLocation2.isEnter) {
      return true;
    }
    return false;
  }

  /**
   * [getOccupiedLocations 根据位置与大小获取占用的位置]
   * @param  {[type]} location [description]
   * @param  {[type]} size     [description]
   * @return {[type]}          [description]
   */
  function getOccupiedLocations(location, size) {
    var locationInfo = parseLocationInfo(location);
    var sizeInfo = parseSizeInfo(size);
    var occupiedLocations = [];
    for (var i = 0; i < sizeInfo.row; i++) {
      for (var j = 0; j < sizeInfo.col; j++) {
        occupiedLocations.push(createLocation(locationInfo.page, locationInfo.row + i, locationInfo.col + j));
      }
    }
    return occupiedLocations;
  }

  /**
   * [sortByLocation 数组根据location排序]
   * @param  {[type]} a [description]
   * @param  {[type]} b [description]
   * @return {[type]}   [description]
   */
  function sortByLocation(a, b) {
    var locationInfoA = parseLocationInfo(a.location);
    var locationInfoB = parseLocationInfo(b.location);
    if (locationInfoA == null || locationInfoB == null) {
      debugger
    }
    if (locationInfoA.page < locationInfoB.page) {
      return -1;
    } else if (locationInfoA.page > locationInfoB.page) {
      return 1;
    } else if (locationInfoA.row < locationInfoB.row) {
      return -1;
    } else if (locationInfoA.row > locationInfoB.row) {
      return 1;
    } else if (locationInfoA.col < locationInfoB.col) {
      return -1;
    } else {
      return 1;
    }
  }

  function hideMenu($root) {
    $root.find('.icondesktop-menu').hide();
  }

  function openIconBox($this, opt) {
    $this.removeClass('iconbox__close').addClass('iconbox__open');
    opt.openBox.top = $this.css('top');
    opt.openBox.left = $this.css('left');
    opt.openBox.$box = $this;
    $this.css('zIndex', 5);
    if (opt.ableChecked) {
      // 隐藏盒子多选按钮
      $this.find('.iconbox-checkbox__parent').hide();
    }
    if (opt.ableDel) {
      // 隐藏盒子删除按钮
      $this.find('.iconbox-delbtn__parent').hide();
    }
    // 隐藏盒子角标
    $this.find('.iconbox-superscript__parent').hide();
    // 隐藏盒子背景图片
    $this.find('.iconbox-bg').hide();
    if (opt.ableEditTitle) {
      // 触发更新标题事件
      $this.find('.iconbox-icontitleinput:visible').focus().blur();
      // 隐藏标题编辑输入框
      $this.find('.iconbox-icontitleinput').hide();
    }
    // 盒子标题超长时不省略
    var $boxTitle = $this.find('.iconbox-title');
    var boxTitle = $boxTitle.attr('title');
    if (boxTitle) {
      $boxTitle.text(boxTitle);
    }
    // 盒子放大
    $this.animate({
      'backgroundColor': opt.openBoxColor,
      'width': opt.width + 'px',
      'height': opt.height + 'px',
      'left': opt.currentPageIndex * opt.width + 'px',
      'top': '0'
      // 'padding': opt.openBoxPadding
    }, function () {
      opt.ableClickBox = true;
      if (opt.ableChecked) {
        // 显示图标多选按钮
        $this.find('.iconbox-checkbox__children').show();
      }
      if (opt.ableDel) {
        // 显示图标删除按钮
        $this.find('.iconbox-delbtn__children').show();
      }
      // 更新图标角标
      updateIconInBoxSuperscript($this, opt);
      // 显示盒子内图标标题
      $this.find('.iconbox-icontitle').show();
      // 盒子内容器如果溢出可滚动
      var $areaContainer = $this.find('.iconbox-area__container');
      $areaContainer.css({
        'width': opt.openBoxWidth + 20 + 'px',
        'height': opt.openBoxHeight + 'px',
        'overflow': 'auto'
      });
      // 可能图标还没有移动到位，高度就还没确定下来，所以延迟一下
      setTimeout(function () {
        adjustScrollBar($areaContainer);
      }, 200);
    });
    // 盒子里的容器放大
    $this.find('.iconbox-area').css({
      'left': '0px',
      'right': '0px',
      'top': '0px',
      'bottom': '0px'
    }).animate({
      'left': opt.openBoxMarginLeft + 'px',
      'right': opt.openBoxMarginRight + 'px',
      'top': opt.openBoxMarginTop + 'px',
      'bottom': opt.openBoxMarginBottom + 'px'
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
    $this.find('.iconbox-a').show();
    var dataBox = getDataByLocation($this.attr('location'), opt.data, opt.locationObj);
    if (dataBox && dataBox.children && dataBox.children.length) {
      for (var i = 0; i < dataBox.children.length; i++) {
        var dataIcon = dataBox.children[i];
        setLocations(dataIcon.$dom, dataIcon, opt, 'animate');
      }
    }
  }

  function closeIconBox($this, opt) {
    opt.openBox.$box = null;
    $this.removeClass('iconbox__open').addClass('iconbox__close');
    if (opt.ableChecked) {
      // 隐藏图标多选按钮
      $this.find('.iconbox-checkbox__children').hide();
    }
    if (opt.ableDel) {
      // 隐藏图标删除按钮
      $this.find('.iconbox-delbtn__children').hide();
    }
    // 隐藏图标角标
    $this.find('.iconbox-superscript__children').hide();
    if (opt.ableEditTitle) {
      // 隐藏盒子内标题编辑框
      $this.find('.iconbox-icontitleinput:visible').focus().blur();
    }
    // 隐藏盒子内图标标题
    $this.find('.iconbox-icontitle').hide();
    // 盒子内容器溢出隐藏
    $this.find('.iconbox-area__container').css({
      'width': '',
      'height': '',
      'overflow': 'hidden'
    });
    $this.find('.iconbox-scrollbar').fadeOut();
    // 盒子缩小
    $this.animate({
      'backgroundColor': opt.closeBoxColor,
      'width': opt.closeBoxWidth + 'px',
      'height': opt.closeBoxHeight + 'px',
      'left': opt.openBox.left,
      'top': opt.openBox.top,
      'padding': '0px'
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
      // 盒子里超过9个图标后隐藏
      $this.find('.iconbox-a').each(function () {
        if ($(this).index() > opt.maxShowIconInBox) {
          $(this).hide();
        }
      });
      opt.ableClickBox = true;
    });
    // 盒子内容器缩小
    $this.find('.iconbox-area').css({
      'left': opt.openBoxMarginLeft + 'px',
      'right': opt.openBoxMarginRight + 'px',
      'top': opt.openBoxMarginTop + 'px',
      'bottom': opt.openBoxMarginBottom + 'px'
    }).animate({
      'left': '0px',
      'right': '0px',
      'top': '0px',
      'bottom': '0px'
    });

    var dataBox = getDataByLocation($this.attr('location'), opt.data, opt.locationObj);
    recoverLocationInBox(dataBox, opt, true);
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
      'height': opt.thumbnailHeight + 'px'
      // 'margin': opt.verIconInCloseBoxMargin + 'px ' + opt.horIconInCloseBoxMargin + 'px'
    });
  }

  /**
   * [hasScrollBar 是否有滚动条]
   * @param  {[type]}  $dom [description]
   * @return {Boolean}      [description]
   */
  function hasScrollBar($dom) {
    // $dom.scrollTop(1);
    // var existScrollBar = ($dom.scrollTop() > 0);
    // $dom.scrollTop(0);
    
    // console.log($dom.outerHeight() + '-' + $dom.get(0).scrollHeight)
    // return existScrollBar;
    return $dom.outerHeight() !== $dom.get(0).scrollHeight;
  }

  /**
   * [adjustScrollBar 调整滚动条块高度并显示]
   * @param  {[type]} $areaContainer [description]
   * @return {[type]}                [description]
   */
  function adjustScrollBar($areaContainer) {
    if (hasScrollBar($areaContainer)) {
      // 如果有滚动条(上方条件)，则显示滚动条
      var scrollTop = $areaContainer.scrollTop();
      var wholeHeight = $areaContainer.get(0).scrollHeight;
      var showHeight = $areaContainer.outerHeight();
      // console.log(showHeight + '--' + wholeHeight)
      var borderRadius = 20;
      var scrollMoveHeight = showHeight - borderRadius * 2;
      // 滚动条中滑块的高度 = 滚动条可以滚动的高度 / 总高度(加上滚动区域的高度) * 容器的高度
      var scrollBarHeight = Math.floor(scrollMoveHeight / wholeHeight * showHeight);
      var scrollBarInfo = getScrollBarInfo(scrollTop, showHeight, wholeHeight);
      var $scrollBar = $areaContainer.siblings('.iconbox-scrollbar');
      $scrollBar.css({
        'top': scrollBarInfo.top + 'px',
        'height': scrollBarInfo.height + 'px'
      }).fadeIn();
    }
  }

  /**
   * [clearObj 清空对象的属性]
   * @param  {[type]} obj [description]
   * @return {[type]}     [description]
   */
  function clearObj(obj) {
    for (var i in obj) {
      delete obj[i];
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

  /**
   * [bindBoxScroll 绑定滚动条事件]
   * @param  {[type]} $boxContainer [description]
   * @param  {[type]} opt           [description]
   * @return {[type]}               [description]
   */
  function bindBoxScroll($boxContainer, opt) {
    $boxContainer.scroll(function () {
      var scrollTop = $boxContainer.scrollTop();
      var showHeight = $boxContainer.outerHeight();
      var wholeHeight = $boxContainer.get(0).scrollHeight;
      var scrollBarTop = getScrollBarInfo(scrollTop, showHeight, wholeHeight).top;
      // console.log(scrollTop + '-------------' + wholeHeight)
      // console.log(scrollMoveHeight / wholeHeight);
      $boxContainer.siblings('.iconbox-scrollbar').css({
        'top': scrollBarTop + 'px'
      });
    });
  }

  /**
   * [getScrollBarInfo 获得滚动条块上部的位置高度]
   * @param  {[type]} scrollTop   [description]
   * @param  {[type]} showHeight  [description]
   * @param  {[type]} wholeHeight [description]
   * @return {[type]}             [description]
   */
  function getScrollBarInfo(scrollTop, showHeight, wholeHeight) {
    // 滚动条上下的间距，与圆角大小相同
    var borderRadius = 20;
    // 滚动条可以移动的高度
    var scrollMoveHeight = showHeight - borderRadius * 2;
    var moveTop = Math.floor(scrollMoveHeight / wholeHeight * scrollTop);
    var scrollBarHeight = Math.floor(scrollMoveHeight / wholeHeight * showHeight);
    return {
      top: borderRadius + moveTop,
      height: scrollBarHeight
    }
  }

  /**
   * [bindMenuClick 绑定菜单点击事件]
   * @param  {[type]} $dom [description]
   * @param  {[type]} func [description]
   * @return {[type]}      [description]
   */
  function bindMenuClick($dom, func) {
    $dom.click(function (e) {
      func(e);
    });
  }
}));