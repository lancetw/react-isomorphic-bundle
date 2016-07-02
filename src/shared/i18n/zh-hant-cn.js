/* eslint-disable max-len */
module.exports = {
  http: {
    'error': {
      '401': {
        'title': '身份验证已逾期',
        'text': '請重新登入一次，謝謝'
      }
    }
  },
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
    nearby: '附近',
    ogpage: '机构专页',
    twblogin: '透过 TaiwanBible 登入'
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
    nearby: '附近',
    twblogin: '透过 TaiwanBible 登入'
  },
  search_input: {
    placeholder: '搜寻...',
    tooltip: '随意输入 :)'
  },
  home: {
    browse: '浏览活动讯息布告 ...'
  },
  login: {
    email: '电子邮件地址',
    password: '密码',
    facebook: '透过 Facebook 登入',
    google: '透过 Google+ 登入',
    twbible: '透过 TaiwanBible 登入',
    signup: '注册新帐号',
    or: '或',
    need: {
      title: '请先登入您的帐号及密码 :)'
    }
  },
  register: {
    hello: '欢迎注册',
    msg: '请详阅注册说明',
    submit: '注册',
    link: '阅读服务条款'
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
        enroll: '报名',
        map: '位置',
        advanced: '进阶'
      },
      msg: {
        upload: '您可以上传图片Word、Word 档或是 PDF（请拖拉至此或是点击选择档案）：',
        limit: '每个档案大小上限 3 MB',
        urltips: '网址必须以 http:// 开头'
      }
    },
    map: {
      'search': '搜寻',
      'update': '更新',
      'lat': '纬度',
      'lng': '经度',
      'my': '我的位置',
      'geo': '寻找我的位置',
      'tips': '为您的地点取个名称'
    },
    advanced: {
      'ocname': {
        'text': '代为发文请填入原始单位组织编号或名称（非必填）'
      }
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
      here: '我在这里',
      basic: {
        km: '%(dist)s 公里',
        m: '%(dist)s 公尺',
        here: '非常近'
      }
    },
    button: {
      go: '详细布告',
      close: '关闭'
    }
  },
  form: {
    post: {
      error: '日期区间有误',
      startDate: {
        label: '开始日期'
      },
      endDate: {
        label: '结束日期'
      },
      title: {
        placeholder: '布告标题'
      },
      content: {
        placeholder: '内容'
      },
      type: {
        news: '公告',
        event: '活动'
      },
      prop: {
        announcement: '公布事项',
        ceremony: '礼仪圣事',
        mission: '宣教差传',
        gospel: '福音布道',
        arts: '艺文展演',
        ministry: '教牧同工',
        fellowship: '信徒聚会',
        society: '社会关注',
        community: '社区活动',
        family: '家庭生活',
        bibleStudy: '研经学习'
      }
    },
    reg: {
      error: '日期区间有误',
      openDate: {
        label: '报名开放日期'
      },
      closeDate: {
        label: '报名截止日期'
      },
      url: {
        error: '无效的格式',
        placeholder: '报名网址'
      }
    },
    manage: {
      ocname: {
        error: '请修正后再送出',
        placeholder: '教会名录的建档 ID 或是组织名称'
      },
      email: {
        error: '电子邮件信箱不合规定',
        placeholder: '组织电子邮件信箱'
      },
      contact: {
        placeholder: '组织联络人'
      },
      url: {
        placeholder: '网站网址'
      },
      zipcode: {
        placeholder: '邮递区号'
      },
      country: {
        placeholder: '国家'
      },
      city: {
        placeholder: '县市'
      },
      address: {
        placeholder: '地址'
      },
      tel: {
        placeholder: '联络电话'
      },
      fax: {
        placeholder: '传真'
      }
    },
    changePassword: {
      password: {
        error: '至少要 6 个字元',
        placeholder: '密码'
      },
      passwordCheck: {
        error: '不一致',
        help: '请再输入一次密码',
        placeholder: '重新输入密码'
      }
    },
    login: {
      email: {
        placeholder: '电子邮件帐号'
      },
      password: {
        placeholder: '密码'
      }
    },
    twblogin: {
      email: {
        placeholder: '电子邮件帐号'
      },
      password: {
        placeholder: '密码'
      }
    },
    signup: {
      email: {
        error: '电子邮件信箱不合规定',
        placeholder: '电子邮件信箱'
      },
      password: {
        error: '至少要 6 个字元',
        placeholder: '密码'
      },
      passwordCheck: {
        error: '不一致',
        placeholder: '重新输入密码',
        help: '请再输入一次密码'
      },
      tos: {
        label: '我同意服务条款'
      }
    }
  },
  message: {
    email: {
      unique: '此电子邮件信箱已经注册了'
    }
  }
}
