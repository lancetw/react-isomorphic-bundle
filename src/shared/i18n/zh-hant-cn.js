/* eslint-disable max-len */
export default {
  title: {
    site: '活动讯息布告 OursEvents',
    home: '首页',
    login: '登入',
    logout: '登出',
    signup: '注册',
    manage: '管理',
    wall: '所有布告',
    wall_cprop: '布告',
    post: '张贴新布告',
    post_detail: '布告详细资料',
    password: '修改密码',
    redirect: '重新导向中...',
    cal: '月历浏览',
    cprop: '类别浏览',
    search: '搜寻',
    nearby: '附近'
  },
  header: {
    home: '首页',
    manage: '管理',
    wall: '布告',
    overview: '总览',
    cal: '月历',
    cprop: '类别',
    post: '发表',
    login: '登入',
    logout: '登出',
    password: '密码',
    search: '搜寻⋯',
    nearby: '附近'
  },
  search_input: {
    placeholder: '搜寻...',
    tooltip: '随意输入 :)'
  },
  home_token: {
    placeholder: '验证码...'
  },
  home: {
    jwt_header: '您的 JWT 验证码',
    key: '金钥'
  },
  login: {
    email: '电子邮件地址',
    password: '密码',
    facebook: '透过 Facebook 登入',
    signup: '注册新帐号',
    or: '或',
    need: {
      title: '请先登入您的帐号及密码 :)'
    }
  },
  register: {
    hello: '欢迎注册',
    msg: '请详阅注册说明',
    submit: '注册'
  },
  redirect: {
    msg: '重新导向中请稍等⋯',
    click: '点此继续⋯'
  },
  logout: {
    msg: '您已经登出。',
    msg2: '您若想登出，',
    click: '请点击此。'
  },
  password: {
    modified: {
      title: '您的密码成功变更',
      content: '下次请使用新的密码登入'
    },
    submit: '变更'
  },
  userinfo: {
    modified: {
      title: '您的资料成功变更',
      content: '下次发表布告时将会带入资料'
    }
  },
  post: {
    created: {
      title: '布告已登录！',
      content: '现在自动转页⋯'
    },
    tips: {
      title: '～ 温馨小提示 ～',
      content: '修改完毕后请切换回基本页面张贴布告'
    },
    upload: {
      error: '选择要上传的档案太大了 :('
    },
    tabs: {
      title: {
        basic: '基本',
        upload: '上传',
        advanced: '报名',
        map: '位置'
      },
      msg: {
        upload: '您可以上传图片或是 PDF（请拖拉至此或是点击选择档案）：',
        limit: '每个档案大小上限 3 MB',
        urltips: '网址必须以 http:// 开头'
      }
    },
    map: {
      'search': '搜寻',
      'update': '更新位置',
      'lat': '纬度',
      'lng': '经度',
      'my': '我的位置',
      'geo': '寻找我的位置',
      'tips': '为您的地点取个名称'
    },
    detail: {
      'open': '开放报名中',
      'close': '报名已截止',
      'noexist': '本布告已删除。',
      'nomap': '未提供位置资讯',
      'attachments': '提供附件下载',
      'edit': '编辑',
      'delete': {
        title: '您确定吗？',
        text: '将永久移除这则布告',
        confirm: '删除',
        cancel: '取消',
        ok: {
          title: '布告已删除！',
          text: '布告成功删除',
          confirm: '确定'
        },
        err: {
          title: '错误',
          text: '无法删除这则布告',
          confirm: '确定'
        }
      },
      'start': ' 开始',
      'end': '将结束于 ',
      'this_year': '今年'
    },
    submit: '张贴布告',
    nodata: '查无资料'
  },
  manage: {
    header: '%(user)s 所发表的布告',
    org_title: '维护单位组织资料'
  },
  wall: {
    loading: '载入中...',
    header: '所有活动'
  },
  search: {
    loading: '载入中...',
    nodata: '查无资料',
    title: '“%(keyword)s”的搜寻结果：'
  },
  news: {
    header: '最新公告',
    unnamed: '未提供单位名称'
  },
  geoloc: {
    nosupported: '您的浏览器不支援定址功能',
    denied: '您已经拒绝提供个人位置资讯',
    unavailable: '您的装置无法提供位置资讯',
    timeout: '要求逾时',
    unknown: '发生未知的错误',
    loading: '正在努力找寻您附近的活动...',
    range: {
      text: '范围',
      'lv1': '3 公里',
      'lv2': '5 公里',
      'lv3': '10 公里',
      'lv4': '20 公里',
      'lv5': '50 公里'
    },
    distance: {
      km: '距离我约为 %(dist)s 公里',
      m: '距离我约为 %(dist)s 公尺',
      here: '我在这里'
    },
    button: {
      go: '详细布告',
      close: '关闭'
    }
  }
}
