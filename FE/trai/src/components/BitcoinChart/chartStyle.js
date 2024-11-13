const blue = '#4FD1C5'; // 원하는 색상 코드로 설정
const getAlphaBlue = (alpha) => {
  return `rgba(79, 209, 197, ${alpha})`; // alpha 값에 따라 변경
};

// 반응형 폰트 크기 함수
const getResponsiveFontSize = () => {
  const width = window.innerWidth;
  // 기본 크기를 기준으로 뷰포트 너비에 따라 비율을 계산
  if (width > 1400) return 12; // 큰 화면에서는 기본 크기 유지
  if (width > 800) return 10;   // 중간 화면에서는 약간 작은 크기
  return 8;                     // 작은 화면에서는 더 작은 크기
};

export const chartStyle = {
    grid: {
      show: true,
      horizontal: {
        show: true,
        size: 1,
        color: '#EDEDED',
        style: 'dashed',
        dashedValue: [2, 2]
      },
      vertical: {
        show: true,
        size: 1,
        color: '#EDEDED',
        style: 'dashed',
        dashedValue: [2, 2]
      }
    },
    candle: {
      // 'candle_solid'|'candle_stroke'|'candle_up_stroke'|'candle_down_stroke'|'ohlc'|'area'
      type: 'candle_solid',
      bar: {
        upColor: '#EB5757',
        downColor: '#2D9CDB',
        noChangeColor: '#888888',
        upBorderColor: '#EB5757',
        downBorderColor: '#2D9CDB',
        noChangeBorderColor: '#888888',
        upWickColor: '#EB5757',
        downWickColor: '#2D9CDB',
        noChangeWickColor: '#888888'
      },
      area: {
        lineSize: 2,
        lineColor: '#2196F3',
        smooth: false,
        value: 'close',
        backgroundColor: [{
          offset: 0,
          color: 'rgba(33, 150, 243, 0.01)'
        }, {
          offset: 1,
          color: 'rgba(33, 150, 243, 0.2)'
        }],
        point: {
          show: true,
          color: blue,
          radius: 4,
          rippleColor: getAlphaBlue(0.3),
          rippleRadius: 8,
          animation: true,
          animationDuration: 1000
        }
      },
      priceMark: {
        show: true,
        high: {
          show: true,
          color: '#D9D9D9',
          textMargin: 5,
          textSize: 10,
          textFamily: 'Helvetica Neue',
          textWeight: 'normal'
        },
        low: {
          show: true,
          color: '#D9D9D9',
          textMargin: 5,
          textSize: 10,
          textFamily: 'Helvetica Neue',
          textWeight: 'normal',
        },
        last: {
          show: true,
          upColor: '#EB5757',
          downColor: '#2D9CDB',
          noChangeColor: '#888888',
          line: {
            show: true,
            // 'solid' | 'dashed'
            style: 'dashed',
            dashedValue: [4, 4],
            size: 1
          },
          text: {
            show: true,
            // 'fill' | 'stroke' | 'stroke_fill'
            style: 'fill',
            size: getResponsiveFontSize(),  // 반응형으로 설정
            paddingLeft: 4,
            paddingTop: 4,
            paddingRight: 4,
            paddingBottom: 4,
            // 'solid' | 'dashed'
            borderStyle: 'solid',
            borderSize: 0,
            borderColor: 'transparent',
            borderDashedValue: [2, 2],
            color: '#FFFFFF',
            family: 'Helvetica Neue',
            weight: 'normal',
            borderRadius: 2
          }
        }
      },
      tooltip: {
        offsetLeft: 4,
        offsetTop: 6,
        offsetRight: 4,
        offsetBottom: 6,
        // 'always' | 'follow_cross' | 'none'
        showRule: 'always',
        // 'standard' | 'rect'
        showType: 'standard',
        labels: ['시간', '시가', '종가', '고가', '저가', '거래량'],
        // Custom display, it can be a callback method or an array, when it is a method, it needs to return an array
        // The child item type of the array is { title, value }
        // title and value can be strings or objects, and the object type is { text, color }
        // title or title.text can be an internationalized key,
        // value or value.text supports string templates
        // For example: want to display time, opening and closing, configure [{ title: 'time', value: '{time}' }, { title: 'open', value: '{open}' }, { title: ' close', value: '{close}' }]
        custom: [
          { title: 'time', value: '{timestamp}' },
          { title: 'open', value: '{open}' },
          { title: 'high', value: '{high}' },
          { title: 'low', value: '{low}' },
          { title: 'close', value: '{price}' },
          { title: 'volume', value: '{tradeVolume}' }
        ],
        defaultValue: 'n/a',
        rect: {
         // 'fixed' | 'pointer'
          position: 'fixed',
          paddingLeft: 4,
          paddingRight: 4,
          paddingTop: 4,
          paddingBottom: 4,
          offsetLeft: 4,
          offsetTop: 4,
          offsetRight: 4,
          offsetBottom: 4,
          borderRadius: 4,
          borderSize: 1,
          borderColor: '#f2f3f5',
          color: '#FEFEFE'
        },
        text: {
          size: getResponsiveFontSize(),  // 반응형으로 설정
          family: 'Helvetica Neue',
          weight: 'normal',
          color: '#D9D9D9',
          marginLeft: 8,
          marginTop: 4,
          marginRight: 8,
          marginBottom: 4
        },
        // sample:
        // [{
        //   id: 'icon_id',
        //   position: 'left', // types include 'left', 'middle', 'right'
        //   marginLeft: 8,
        //   marginTop: 6,
        //   marginRight: 0,
        //   marginBottom: 0,
        //   paddingLeft: 1,
        //   paddingTop: 1,
        //   paddingRight: 1,
        //   paddingBottom: 1,
        //   icon: '\ue900',
        //   fontFamily: 'iconfont',
        //   size: 12,
        //   color: '#76808F',
        //   backgroundColor: 'rgba(33, 150, 243, 0.2)',
        //   activeBackgroundColor: 'rgba(33, 150, 243, 0.4)'
        // }]
        icons: []
      }
    },
    indicator: {
      ohlc: {
        upColor: 'rgba(45, 192, 142, .7)',
        downColor: 'rgba(249, 40, 85, .7)',
        noChangeColor: '#888888'
      },
      bars: [{
        // 'fill' | 'stroke' | 'stroke_fill'
        style: 'fill',
        // 'solid' | 'dashed'
        borderStyle: 'solid',
        borderSize: 1,
        borderDashedValue: [2, 2],
        upColor: 'rgba(45, 192, 142, .7)',
        downColor: 'rgba(249, 40, 85, .7)',
        noChangeColor: '#888888'
      }],
      lines: [
        {
          // 'solid' | 'dashed'
          style: 'solid',
          smooth: false,
          size: 1,
          dashedValue: [2, 2],
          color: '#FF9600'
        }, {
          style: 'solid',
          smooth: false,
          size: 1,
          dashedValue: [2, 2],
          color: '#935EBD'
        }, {
          style: 'solid',
          smooth: false,
          size: 1,
          dashedValue: [2, 2],
          color: '#2196F3'
        }, {
          style: 'solid',
          smooth: false,
          size: 1,
          dashedValue: [2, 2],
          color: '#E11D74'
        }, {
          style: 'solid',
          smooth: false,
          size: 1,
          dashedValue: [2, 2],
          color: '#01C5C4'
        }
      ],
      circles: [{
        // 'fill' | 'stroke' | 'stroke_fill'
        style: 'fill',
        // 'solid' | 'dashed'
        borderStyle: 'solid',
        borderSize: 1,
        borderDashedValue: [2, 2],
        upColor: 'rgba(45, 192, 142, .7)',
        downColor: 'rgba(249, 40, 85, .7)',
        noChangeColor: '#888888'
      }],
      lastValueMark: {
        show: false,
        text: {
          show: false,
          // 'fill' | 'stroke' | 'stroke_fill'
          style: 'fill',
          color: '#FFFFFF',
          size: getResponsiveFontSize(),  // 반응형으로 설정
          family: 'Helvetica Neue',
          weight: 'normal',
          // 'solid' | 'dashed'
          borderStyle: 'solid',
          borderSize: 1,
          borderDashedValue: [2, 2],
          paddingLeft: 4,
          paddingTop: 4,
          paddingRight: 4,
          paddingBottom: 4,
          borderRadius: 2
        }
      },
      tooltip: {
        offsetLeft: 4,
        offsetTop: 6,
        offsetRight: 4,
        offsetBottom: 6,
        // 'always' | 'follow_cross' | 'none'
        showRule: 'always',
        // 'standard' | 'rect'
        showType: 'standard',
        showName: true,
        showParams: true,
        defaultValue: 'n/a',
        text: {
          size: getResponsiveFontSize(),  // 반응형으로 설정
          family: 'Helvetica Neue',
          weight: 'normal',
          color: '#D9D9D9',
          marginTop: 4,
          marginRight: 8,
          marginBottom: 4,
          marginLeft: 8
        },
        // sample:
        // [{
        //   id: 'icon_id',
        //   position: 'left', // types include 'left', 'middle', 'right'
        //   marginLeft: 8,
        //   marginTop: 6,
        //   marginRight: 0,
        //   marginBottom: 0,
        //   paddingLeft: 1,
        //   paddingTop: 1,
        //   paddingRight: 1,
        //   paddingBottom: 1,
        //   icon: '\ue900',
        //   fontFamily: 'iconfont',
        //   size: 12,
        //   color: '#76808F',
        //   backgroundColor: 'rgba(33, 150, 243, 0.2)',
        //   activeBackgroundColor: 'rgba(33, 150, 243, 0.4)'
        // }]
        icons: []
      }
    },
    xAxis: {
      show: true,
      size: 'auto',
      axisLine: {
        show: true,
        color: '#888888',
        size: 1
      },
      tickText: {
        show: true,
        color: '#D9D9D9',
        family: 'Helvetica Neue',
        weight: 'normal',
        size: 12,
        marginStart: 4,
        marginEnd: 4
      },
      tickLine: {
        show: true,
        size: 1,
        length: 3,
        color: '#888888'
      }
    },
    yAxis: {
      show: true,
      size: 'auto',
      // 'left' | 'right'
      position: 'right',
      // 'normal' | 'percentage' | 'log'
      type: 'normal',
      inside: false,
      reverse: false,
      axisLine: {
        show: true,
        color: '#888888',
        size: 1
      },
      tickText: {
        show: true,
        color: '#D9D9D9',
        family: 'Helvetica Neue',
        weight: 'normal',
        size: 12,
        marginStart: 4,
        marginEnd: 4
      },
      tickLine: {
        show: true,
        size: 1,
        length: 3,
        color: '#888888'
      }
    },
    separator: {
      size: 1,
      color: '#888888',
      fill: true,
      activeBackgroundColor: 'rgba(230, 230, 230, .15)'
    },
    crosshair: {
      show: true,
      horizontal: {
        show: true,
        line: {
          show: true,
          // 'solid'|'dashed'
          style: 'dashed',
          dashedValue: [4, 2],
          size: 1,
          color: '#888888'
        },
        text: {
          show: true,
          // 'fill' | 'stroke' | 'stroke_fill'
          style: 'fill',
          color: '#FFFFFF',
          size: getResponsiveFontSize(),  // 반응형으로 설정
          family: 'Helvetica Neue',
          weight: 'normal',
          // 'solid' | 'dashed'
          borderStyle: 'solid',
          borderDashedValue: [2, 2],
          borderSize: 1,
          borderColor: '#686D76',
          borderRadius: 2,
          paddingLeft: 4,
          paddingRight: 4,
          paddingTop: 4,
          paddingBottom: 4,
          backgroundColor: '#686D76'
        }
      },
      vertical: {
        show: true,
        line: {
          show: true,
          // 'solid'|'dashed'
          style: 'dashed',
          dashedValue: [4, 2],
          size: 1,
          color: '#888888'
        },
        text: {
          show: true,
          // 'fill' | 'stroke' | 'stroke_fill'
          style: 'fill',
          color: '#FFFFFF',
          size: getResponsiveFontSize(),  // 반응형으로 설정
          family: 'Helvetica Neue',
          weight: 'normal',
          // 'solid' | 'dashed'
          borderStyle: 'solid',
          borderDashedValue: [2, 2],
          borderSize: 1,
          borderColor: '#686D76',
          borderRadius: 2,
          paddingLeft: 4,
          paddingRight: 4,
          paddingTop: 4,
          paddingBottom: 4,
          backgroundColor: '#686D76'
        }
      }
    },
    overlay: {
      point: {
        color: '#1677FF',
        borderColor: 'rgba(22, 119, 255, 0.35)',
        borderSize: 1,
        radius: 5,
        activeColor: '#1677FF',
        activeBorderColor: 'rgba(22, 119, 255, 0.35)',
        activeBorderSize: 3,
        activeRadius: 5
      },
      line: {
        // 'solid' | 'dashed'
        style: 'solid',
        smooth: false,
        color: '#1677FF',
        size: 1,
        dashedValue: [2, 2]
      },
      rect: {
        // 'fill' | 'stroke' | 'stroke_fill'
        style: 'fill',
        color: 'rgba(22, 119, 255, 0.25)',
        borderColor: '#1677FF',
        borderSize: 1,
        borderRadius: 0,
        // 'solid' | 'dashed'
        borderStyle: 'solid',
        borderDashedValue: [2, 2]
      },
      polygon: {
        // 'fill' | 'stroke' | 'stroke_fill'
        style: 'fill',
        color: '#1677FF',
        borderColor: '#1677FF',
        borderSize: 1,
        // 'solid' | 'dashed'
        borderStyle: 'solid',
        borderDashedValue: [2, 2]
      },
      circle: {
        // 'fill' | 'stroke' | 'stroke_fill'
        style: 'fill',
        color: 'rgba(22, 119, 255, 0.25)',
        borderColor: '#1677FF',
        borderSize: 1,
        // 'solid' | 'dashed'
        borderStyle: 'solid',
        borderDashedValue: [2, 2]
      },
      arc: {
        // 'solid' | 'dashed'
        style: 'solid',
        color: '#1677FF',
        size: 1,
        dashedValue: [2, 2]
      },
      text: {
        // 'fill' | 'stroke' | 'stroke_fill'
        style: 'fill',
        color: '#FFFFFF',
        size: getResponsiveFontSize(),  // 반응형으로 설정
        family: 'Helvetica Neue',
        weight: 'normal',
        // 'solid' | 'dashed'
        borderStyle: 'solid',
        borderDashedValue: [2, 2],
        borderSize: 0,
        borderRadius: 2,
        borderColor: '#1677FF',
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: 'transparent'
      },
      rectText: {
        // 'fill' | 'stroke' | 'stroke_fill'
        style: 'fill',
        color: '#FFFFFF',
        size: getResponsiveFontSize(),  // 반응형으로 설정
        family: 'Helvetica Neue',
        weight: 'normal',
        // 'solid' | 'dashed'
        borderStyle: 'solid',
        borderDashedValue: [2, 2],
        borderSize: 1,
        borderRadius: 2,
        borderColor: '#1677FF',
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: '#1677FF'
      }
    }
  }