import * as G6 from '@antv/g6';

export default function(container: HTMLElement) {
  let ipHideTimer: any = undefined,
    dragDx: any = undefined,
    dragDy: any = undefined;

  const CANVAS_WIDTH = container.scrollWidth;
  const CANVAS_HEIGHT = container.scrollHeight;
  const LIMIT_OVERFLOW_WIDTH = CANVAS_WIDTH - 100;
  const LIMIT_OVERFLOW_HEIGHT = CANVAS_HEIGHT - 100;
  const ERROR_COLOR = '#F5222D';
  const SIMPLE_TREE_NODE = 'simple-tree-node';
  const TREE_NODE = 'tree-node';
  const SOFAROUTER_TEXT_CLASS = 'sofarouter-text-class';
  const SOFAROUTER_RECT_CLASS = 'sofarouter-rect-class';
  const COLLAPSE_ICON = function COLLAPSE_ICON(x: any, y: any, r: any) {
    return [
      ['M', x - r, y],
      ['a', r, r, 0, 1, 0, r * 2, 0],
      ['a', r, r, 0, 1, 0, -r * 2, 0],
      ['M', x - r + 4, y],
      ['L', x - r + 2 * r - 4, y],
    ];
  };
  const EXPAND_ICON = function EXPAND_ICON(x: any, y: any, r: any) {
    return [
      ['M', x - r, y],
      ['a', r, r, 0, 1, 0, r * 2, 0],
      ['a', r, r, 0, 1, 0, -r * 2, 0],
      ['M', x - r + 4, y],
      ['L', x - r + 2 * r - 4, y],
      ['M', x - r + r, y - r + 4],
      ['L', x, y + r - 4],
    ];
  };

  const getNodeConfig = function getNodeConfig(node: any) {
    if (node.nodeError) {
      return {
        basicColor: ERROR_COLOR,
        fontColor: '#FFF',
        borderColor: ERROR_COLOR,
        bgColor: '#E66A6C',
      };
    }
    let config = {
      basicColor: '#722ED1',
      fontColor: '#722ED1',
      borderColor: '#722ED1',
      bgColor: '#F6EDFC',
    };
    switch (node.type) {
      case 'app': {
        config = {
          basicColor: '#722ED1',
          fontColor: '#722ED1',
          borderColor: '#722ED1',
          bgColor: '#F6EDFC',
        };
        break;
      }
      case 'nlb':
        config = {
          basicColor: '#2F54EB',
          fontColor: '#2F54EB',
          borderColor: '#2F54EB',
          bgColor: '#F3F6FD',
        };
        break;
      case 'ingress':
        config = {
          basicColor: '#2F54EB',
          fontColor: '#2F54EB',
          borderColor: '#2F54EB',
          bgColor: '#F3F6FD',
        };
        break;
      case 'rule':
        config = {
          basicColor: '#52C41A',
          fontColor: '#52C41A',
          borderColor: '#52C41A',
          bgColor: '#F4FCEB',
        };
        break;
      case 'service':
        config = {
          basicColor: '#FA8C16',
          fontColor: '#FA8C16',
          borderColor: '#FA8C16',
          bgColor: '#FCF4E3',
        };
        break;
      default:
        break;
    }
    return config;
  };

  let selectedItem: any;
  const graph = new G6.Graph({
    container,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    fitView: true,
    fitViewPadding: [48, 24, 24, 24],
    modes: {
      default: [
        {
          type: 'collapse-expand',
          shouldUpdate: function shouldUpdate(e: any) {
            /* 点击 node 禁止展开收缩 */
            if (e.target.get('className') !== 'collapse-icon') {
              return false;
            }
            return true;
          },
          onChange: function onChange(item: any, collapsed: any) {
            selectedItem = item;
            const icon = item.get('group').findByClassName('collapse-icon');
            if (collapsed) {
              icon.attr('symbol', EXPAND_ICON);
            } else {
              icon.attr('symbol', COLLAPSE_ICON);
            }
          },
          animate: {
            callback: function callback() {
              graph.focusItem(selectedItem);
            },
          },
        },
        {
          type: 'tooltip',
          formatText: function formatText(data: any) {
            return '<div>' + data.name + '</div>';
          },
        },
        'drag-canvas',
        'zoom-canvas',
      ],
    },
    defaultNode: {
      shape: TREE_NODE,
      labelCfg: {
        style: {
          fill: '#595959',
          fontSize: 28,
        },
        offset: 30,
      },
      linkPoints: {
        top: false,
        bottom: false,
        left: true,
        right: true,
        size: 5,
        fill: '#fff',
      },
      anchorPoints: [
        [0, 0.5],
        [1, 0.5],
      ],
    },
    // defaultEdge: {
    //   shape: 'tree-edge',
    //   style: {
    //     stroke: '#A3B1BF',
    //   },
    // },
    layout: {
      type: 'dagre',
      rankdir: 'RL', // 可选，默认为图的中心
      align: 'DL', // 可选
      nodesep: -20, // 可选
      ranksep: 200,
      controlPoints: true, // 可选
    },
  });

  /* 精简节点和复杂节点共用的一些方法 */
  const nodeBasicMethod = {
    createNodeBox(
      group: any,
      config: any,
      width: any,
      height: any,
      isRoot: any
    ) {
      /* 最外面的大矩形 */
      const container = group.addShape('rect', {
        attrs: {
          x: 0,
          y: 0,
          width,
          height,
        },
      });
      if (!isRoot) {
        /* 左边的小圆点 */
        group.addShape('circle', {
          attrs: {
            x: 3,
            y: height / 2,
            r: 6,
            fill: config.basicColor,
          },
        });
      }
      /* 矩形 */
      group.addShape('rect', {
        attrs: {
          x: 3,
          y: 0,
          width,
          height,
          fill: config.bgColor,
          stroke: config.borderColor,
          radius: 2,
          cursor: 'pointer',
        },
      });

      /* 左边的粗线 */
      group.addShape('rect', {
        attrs: {
          x: 3,
          y: 0,
          width: 3,
          height,
          fill: config.basicColor,
          radius: 1.5,
        },
      });
      return container;
    },
    /* 生成树上的 marker */
    createNodeMarker(group: any, collapsed: any, x: any, y: any) {
      // group.addShape('circle', {
      //   attrs: {
      //     x,
      //     y,
      //     r: 13,
      //     fill: 'rgba(47, 84, 235, 0.05)',
      //     opacity: 0,
      //     zIndex: -2,
      //   },
      //   className: 'collapse-icon-bg',
      // });
      // group.addShape('marker', {
      //   attrs: {
      //     x,
      //     y,
      //     radius: 7,
      //     // symbol: collapsed ? EXPAND_ICON : COLLAPSE_ICON,
      //     stroke: 'rgba(0,0,0,0.25)',
      //     fill: 'rgba(0,0,0,0)',
      //     lineWidth: 1,
      //     cursor: 'pointer',
      //   },
      //   className: 'collapse-icon',
      // });
    },
    afterDraw(cfg: any, group: any) {
      /* 操作 marker 的背景色显示隐藏 */
      const icon = group.findByClassName('collapse-icon');
      if (icon) {
        const bg = group.findByClassName('collapse-icon-bg');
        icon.on('mouseenter', function() {
          bg.attr('opacity', 1);
          graph.get('canvas').draw();
        });
        icon.on('mouseleave', function() {
          bg.attr('opacity', 0);
          graph.get('canvas').draw();
        });
      }
      /* active 显示 */
      const ipBox = group.findByClassName('active-box');
      if (ipBox) {
        /* active 复制的几个元素 */
        const ipLine = group.findByClassName('active-cp-line');
        const ipBG = group.findByClassName('active-cp-bg');
        const ipIcon = group.findByClassName('active-cp-icon');
        const ipCPBox = group.findByClassName('active-cp-box');

        const onMouseEnter = function onMouseEnter() {
          ipHideTimer && clearTimeout(ipHideTimer);
          ipLine.attr('opacity', 1);
          ipBG.attr('opacity', 1);
          ipIcon.attr('opacity', 1);
          graph.get('canvas').draw();
        };
        const onMouseLeave = function onMouseLeave() {
          ipHideTimer = setTimeout(function() {
            ipLine.attr('opacity', 0);
            ipBG.attr('opacity', 0);
            ipIcon.attr('opacity', 0);
            graph.get('canvas').draw();
          }, 100);
        };
        ipBox.on('mouseenter', function() {
          onMouseEnter();
        });
        ipBox.on('mouseleave', function() {
          onMouseLeave();
        });
        ipCPBox.on('mouseenter', function() {
          onMouseEnter();
        });
        ipCPBox.on('mouseleave', function() {
          onMouseLeave();
        });
        ipCPBox.on('click', function() {});
      }
    },
    setState: function setState(name: any, value: any, item: any) {
      const hasOpacityClass = [
        'active-cp-line',
        'active-cp-bg',
        'active-cp-icon',
        'active-cp-box',
        'active-box',
        'collapse-icon-bg',
      ];
      const group = item.getContainer();
      const childrens = group.get('children');
      graph.setAutoPaint(false);
      if (name === 'emptiness') {
        if (value) {
          childrens.forEach(function(shape: any) {
            if (hasOpacityClass.indexOf(shape.get('className')) > -1) {
              return;
            }
            shape.attr('opacity', 0.4);
          });
        } else {
          childrens.forEach(function(shape: any) {
            if (hasOpacityClass.indexOf(shape.get('className')) > -1) {
              return;
            }
            shape.attr('opacity', 1);
          });
        }
      }
      graph.setAutoPaint(true);
    },
  };

  G6.registerNode(
    TREE_NODE,
    {
      drawShape: function drawShape(cfg: any, group: any) {
        const config = getNodeConfig(cfg);
        const isRoot = cfg.type === 'nlb' || cfg.type === 'ingress';
        const data = cfg;
        /* 最外面的大矩形 */
        const container = nodeBasicMethod.createNodeBox(
          group,
          config,
          cfg.type === 'rule' ? 160 : 243,
          cfg.type === 'rule' ? 40 : 64,
          isRoot
        );

        /* 上边的 type */
        group.addShape('text', {
          attrs: {
            text: data.typeinfo,
            x: 3,
            y: -10,
            fontSize: 12,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: 'rgba(0,0,0,0.65)',
          },
        });

        let activeWidth = 0;
        /* active start */
        if (cfg.type !== 'rule') {
          const activeRect = group.addShape('rect', {
            attrs: {
              fill: !data.active ? null : '#FFF',
              stroke: null,
              radius: 2,
              cursor: 'pointer',
            },
          });
          /* active */
          const activeText = group.addShape('text', {
            attrs: {
              text: data.status,
              x: 0,
              y: 19,
              fontSize: 12,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: !data.active
                ? 'rgba(255,255,255,0.85)'
                : 'rgba(0,0,0,0.65)',
              cursor: 'pointer',
            },
          });
          const activeBBox = activeText.getBBox();
          /* active 的文字总是距离右边 12px */
          activeText.attr({
            x: 224 - 12 - activeBBox.width,
          });
          activeRect.attr({
            x: 224 - 12 - activeBBox.width - 4,
            y: activeBBox.minY - 5,
            width: activeBBox.width + 8,
            height: activeBBox.height + 10,
          });
          const activeRectBBox = activeRect.getBBox();
          activeWidth = activeRectBBox.width;
        }
        /* active end */
        /* name */
        group.addShape('text', {
          attrs: {
            text: fittingString(data.name, 224 - activeWidth - 20, 12),
            x: 19,
            y: 19,
            fontSize: 14,
            fontWeight: 700,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: config.fontColor,
            cursor: 'pointer',
            tooltip: cfg.name,
          },
        });
        /* 下面的文字 */
        group.addShape('text', {
          attrs: {
            text: fittingString(data.info || '', 204, 12),
            x: 19,
            y: 45,
            fontSize: 14,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: config.fontColor,
            cursor: 'pointer',
            tooltip: cfg.info,
          },
        });
        return container;
      },
    },
    'single-shape'
  );
  /* 是否显示 sofarouter，通过透明度来控制 */
  G6.registerEdge(
    'tree-edge',
    {
      draw: function draw(cfg: any, group: any) {
        const targetNode = cfg.targetNode.getModel();
        const edgeError = !!targetNode.edgeError;

        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        const controlPoints = this.getControlPoints(cfg);
        let points = [startPoint]; // 添加起始点
        // 添加控制点
        if (controlPoints) {
          points = points.concat(controlPoints);
        }
        // 添加结束点
        points.push(endPoint);
        const path = this.getPath(points);

        group.addShape('path', {
          attrs: {
            path,
            lineWidth: 12,
            stroke: edgeError ? 'rgba(245,34,45,0.05)' : 'rgba(47,84,235,0.05)',
            opacity: 0,
            zIndex: 0,
          },
          className: 'line-bg',
        });
        const keyShape = group.addShape('path', {
          attrs: {
            path,
            lineWidth: 1,
            stroke: edgeError ? '#FF7875' : 'rgba(0,0,0,0.25)',
            zIndex: 1,
            lineAppendWidth: 12,
          },
          edgeError: !!edgeError,
        });

        /* 连接线的中间点 */
        const centerPoint = {
          x: startPoint.x + (endPoint.x - startPoint.x) / 2,
          y: startPoint.y + (endPoint.y - startPoint.y) / 2,
        };
        const textRect = group.addShape('rect', {
          attrs: {
            fill: '#FFF1F0',
            radius: 2,
            cursor: 'pointer',
            opacity: 1,
          },
          /* sofarouter 需要 class，以便控制 显示隐藏*/
          className: SOFAROUTER_RECT_CLASS,
        });
        const text = group.addShape('text', {
          attrs: {
            text: `${cfg.label}`,
            x: 0,
            y: 0,
            fontSize: 12,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: '#F5222D',
            opacity: 1,
          },
          /* sofarouter 需要 class，以便控制 显示隐藏*/
          className: SOFAROUTER_TEXT_CLASS,
        });

        const textBBox = text.getBBox();
        /* text 的位置 */
        text.attr({
          x: centerPoint.x - textBBox.width / 2,
          y: centerPoint.y,
        });
        /* text 的框框 */
        textRect.attr({
          x: centerPoint.x - textBBox.width / 2 - 4,
          y: centerPoint.y - textBBox.height / 2 - 5,
          width: textBBox.width + 8,
          height: textBBox.height + 10,
        });

        return keyShape;
      },

      /* 操作 线 的背景色显示隐藏 */
      afterDraw: function afterDraw(cfg: any, group: any) {
        /* 背景色 */
        const lineBG = group.get('children')[0]; // 顺序根据 draw 时确定
        /* 线条 */
        const line = group.get('children')[1];
        line.on('mouseenter', function() {
          lineBG.attr('opacity', '1');
          /* 线条如果在没有错误的情况下，在 hover 时候，是需要变成蓝色的 */
          if (!line.get('edgeError')) {
            line.attr('stroke', '#2F54EB');
          }
          graph.get('canvas').draw();
        });
        line.on('mouseleave', function() {
          lineBG.attr('opacity', '0');
          if (!line.get('edgeError')) {
            line.attr('stroke', 'rgba(0,0,0,0.25)');
          }
          graph.get('canvas').draw();
        });
      },
      setState: function setState(name: any, value: any, item: any) {
        const group = item.getContainer();
        const childrens = group.get('children');
        graph.setAutoPaint(true);
        if (name === 'emptiness') {
          if (value) {
            childrens.forEach(function(shape: any) {
              if (shape.get('className') === 'line-bg') {
                return;
              }
              shape.attr('opacity', 0.4);
            });
          } else {
            childrens.forEach(function(shape: any) {
              if (shape.get('className') === 'line-bg') {
                return;
              }
              shape.attr('opacity', 1);
            });
          }
        }
        graph.setAutoPaint(true);
      },
      update: null,
    },
    'cubic-horizontal'
  );

  function strLen(str: any = '') {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
        len++;
      } else {
        len += 2;
      }
    }
    return len;
  }

  function fittingString(str: any, maxWidth: any, fontSize: any) {
    const fontWidth = fontSize * 1.3; // 字号+边距
    maxWidth = maxWidth * 2; // 需要根据自己项目调整
    const width = strLen(str) * fontWidth;
    const ellipsis = '…';
    if (width > maxWidth) {
      const actualLen = Math.floor((maxWidth - 10) / fontWidth);
      const result = str.substring(0, actualLen) + ellipsis;
      return result;
    }
    return str;
  }

  function translate(x: any, y: any) {
    graph.translate(-x, -y);
    let moveX = x;
    let moveY = y;
    const containerWidth = graph.get('width');
    const containerHeight = graph.get('height');
    /* 获得当前偏移量*/
    const group = graph.get('group');
    const bbox = group.getBBox();
    const leftTopPoint = graph.getCanvasByPoint(bbox.minX, bbox.minY);
    const rightBottomPoint = graph.getCanvasByPoint(bbox.maxX, bbox.maxY);
    /* 如果 x 轴在区域内，不允许左右超过100 */
    if (x < 0 && leftTopPoint.x - x > LIMIT_OVERFLOW_WIDTH) {
      moveX = 0;
    }
    if (
      x > 0 &&
      rightBottomPoint.x - x < containerWidth - LIMIT_OVERFLOW_WIDTH
    ) {
      moveX = 0;
    }
    if (y < 0 && leftTopPoint.y - y > LIMIT_OVERFLOW_HEIGHT) {
      moveY = 0;
    }
    if (
      y > 0 &&
      rightBottomPoint.y - y < containerHeight - LIMIT_OVERFLOW_HEIGHT
    ) {
      moveY = 0;
    }
    graph.translate(-moveX, -moveY);
  }

  return graph;
}
