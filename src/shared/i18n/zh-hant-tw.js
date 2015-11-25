/* eslint-disable max-len */
export default {
  title: {
    site: '活動訊息佈告 OursEvents',
    home: '首頁',
    login: '登入',
    logout: '登出',
    signup: '註冊',
    manage: '管理',
    wall: '所有佈告',
    wall_cprop: '佈告',
    post: '張貼新佈告',
    post_detail: '佈告詳細資料',
    password: '修改密碼',
    redirect: '重新導向中...',
    cal: '月曆瀏覽',
    cprop: '類別瀏覽',
    search: '搜尋',
    nearby: '附近',
    ogpage: '機構專頁'
  },
  header: {
    home: '首頁',
    manage: '管理',
    wall: '佈告',
    overview: '總覽',
    cal: '月曆',
    cprop: '類別',
    post: '發表',
    login: '登入',
    logout: '登出',
    password: '密碼',
    search: '搜尋⋯',
    nearby: '附近'
  },
  search_input: {
    placeholder: '搜尋...',
    tooltip: '隨意輸入 :)'
  },
  home: {
    browse: '瀏覽活動訊息佈告 ...'
  },
  login: {
    email: '電子郵件地址',
    password: '密碼',
    facebook: '透過 Facebook 登入',
    google: '透過 Google 登入',
    signup: '註冊新帳號',
    or: '或',
    need: {
      title: '請先登入您的帳號及密碼 :)'
    }
  },
  register: {
    hello: '歡迎註冊',
    msg: '請詳閱註冊說明',
    submit: '註冊'
  },
  redirect: {
    msg: '重新導向中請稍等⋯',
    click: '點此繼續⋯'
  },
  logout: {
    msg: '您已經登出。',
    msg2: '您若想登出，',
    click: '請點擊此。'
  },
  password: {
    modified: {
      title: '您的密碼成功變更',
      content: '下次請使用新的密碼登入'
    },
    submit: '變更'
  },
  userinfo: {
    modified: {
      title: '您的資料成功變更',
      content: '下次發表佈告時將會帶入資料'
    }
  },
  post: {
    created: {
      title: '佈告已登錄！',
      content: '現在自動轉頁⋯'
    },
    tips: {
      title: '～ 溫馨小提示 ～',
      content: '修改完畢後請切換回基本頁面張貼佈告'
    },
    upload: {
      error: '選擇要上傳的檔案太大了 :('
    },
    tabs: {
      title: {
        basic: '基本',
        upload: '上傳',
        advanced: '報名',
        map: '位置'
      },
      msg: {
        upload: '您可以上傳圖片或是 PDF（請拖拉至此或是點擊選擇檔案）：',
        limit: '每個檔案大小上限 3 MB',
        urltips: '網址必須以 http:// 開頭'
      }
    },
    map: {
      'search': '搜尋',
      'update': '更新位置',
      'lat': '緯度',
      'lng': '經度',
      'my': '我的位置',
      'geo': '尋找我的位置',
      'tips': '為您的地點取個名稱'
    },
    detail: {
      'open': '開放報名中',
      'close': '報名已截止',
      'noexist': '本佈告已刪除。',
      'nomap': '未提供位置資訊',
      'attachments': '提供附件下載',
      'edit': '編輯',
      'delete': {
        title: '您確定嗎？',
        text: '將永久移除這則佈告',
        confirm: '刪除',
        cancel: '取消',
        ok: {
          title: '佈告已刪除！',
          text: '佈告成功刪除',
          confirm: '確定'
        },
        err: {
          title: '錯誤',
          text: '無法刪除這則佈告',
          confirm: '確定'
        }
      },
      'start': ' 開始',
      'end': '將結束於 ',
      'this_year': '今年'
    },
    submit: '張貼佈告',
    nodata: '查無資料'
  },
  manage: {
    header: '%(user)s 所發表的佈告',
    org_title: '維護單位組織資料'
  },
  wall: {
    loading: '載入中...',
    header: '所有活動'
  },
  search: {
    loading: '載入中...',
    nodata: '查無資料',
    title: '「%(keyword)s」的搜尋結果：'
  },
  news: {
    header: '最新公告',
    unnamed: '未提供單位名稱'
  },
  geoloc: {
    nosupported: '您的瀏覽器不支援定址功能',
    denied: '您已經拒絕提供個人位置資訊',
    unavailable: '您的裝置無法提供位置資訊',
    timeout: '要求逾時',
    unknown: '發生未知的錯誤',
    loading: '正在努力找尋您附近的活動...',
    range: {
      text: '範圍',
      'lv1': '3 公里',
      'lv2': '5 公里',
      'lv3': '10 公里',
      'lv4': '20 公里',
      'lv5': '50 公里'
    },
    distance: {
      km: '距離我約為 %(dist)s 公里',
      m: '距離我約為 %(dist)s 公尺',
      here: '我在這裡',
      basic: {
        km: '%(dist)s 公里',
        m: '%(dist)s 公尺',
        here: '非常近'
      }
    },
    button: {
      go: '詳細佈告',
      close: '關閉'
    }
  },
  form: {
    post: {
      error: '日期區間有誤',
      startDate: {
        label: '開始日期'
      },
      endDate: {
        label: '結束日期'
      },
      title: {
        placeholder: '佈告標題'
      },
      content: {
        placeholder: '內容'
      },
      type: {
        news: '公告',
        event: '活動'
      },
      prop: {
        others: '其他',
        general: '一般',
        music: '音樂',
        communication: '交流',
        groupCommunity: '社群',
        specialGroups: '特殊群體',
        missions: '宣教',
        evangelism: '福音',
        sermon: '佈道',
        training: '培訓',
        welfare: '社福',
        healthCare: '醫療',
        counseling: '諮商'
      }
    },
    reg: {
      error: '日期區間有誤',
      openDate: {
        label: '報名開放日期'
      },
      closeDate: {
        label: '報名截止日期'
      },
      url: {
        error: '無效的格式',
        placeholder: '報名網址'
      }
    },
    manage: {
      ocname: {
        error: '請修正後再送出',
        placeholder: '組織名稱'
      },
      email: {
        error: '電子郵件信箱不合規定',
        placeholder: '組織電子郵件信箱'
      },
      contact: {
        placeholder: '組織聯絡人'
      },
      url: {
        placeholder: '網站網址'
      },
      zipcode: {
        placeholder: '郵遞區號'
      },
      country: {
        placeholder: '國家'
      },
      city: {
        placeholder: '縣市'
      },
      address: {
        placeholder: '地址'
      },
      tel: {
        placeholder: '聯絡電話'
      },
      fax: {
        placeholder: '傳真'
      }
    },
    changePassword: {
      password: {
        error: '至少要 6 個字元',
        placeholder: '密碼'
      },
      passwordCheck: {
        error: '不一致',
        help: '請再輸入一次密碼',
        placeholder: '重新輸入密碼'
      }
    },
    login: {
      email: {
        placeholder: '電子郵件帳號'
      },
      password: {
        placeholder: '密碼'
      }
    },
    signup: {
      email: {
        error: '電子郵件信箱不合規定',
        placeholder: '電子郵件信箱'
      },
      password: {
        error: '至少要 6 個字元',
        placeholder: '密碼'
      },
      passwordCheck: {
        error: '不一致',
        placeholder: '重新輸入密碼',
        help: '請再輸入一次密碼'
      },
      tos: {
        label: '我同意服務條款'
      }
    }
  }
}
