/* eslint-disable max-len */
module.exports = {
  title: {
    site: 'OursEvents',
    home: 'Home',
    login: 'Log In',
    logout: 'Log Out',
    signup: 'Sign Up',
    manage: 'Manage',
    wall: 'All Events',
    wall_cprop: '',
    post: 'Post It!',
    post_detail: 'Detail',
    password: 'Change My Password',
    redirect: 'Redirecting...',
    cal: 'Calendar View',
    cprop: 'Property View',
    search: 'Search',
    nearby: 'Nearby',
    ogpage: 'Organization Pages',
    twblogin: 'Sign with TaiwanBible'
  },
  header: {
    home: 'Home',
    manage: 'Manage',
    wall: 'Wall',
    overview: 'Overview',
    cal: 'Calendar',
    cprop: 'Property',
    post: 'Post',
    login: 'Log In',
    logout: 'Log Out',
    password: 'Password',
    search: 'Search...',
    nearby: 'Nearby',
    twblogin: 'Sign in with TaiwanBible'
  },
  search_input: {
    placeholder: 'Search...',
    tooltip: 'Enter a search term'
  },
  home: {
    browse: 'Browse OursEvents...'
  },
  login: {
    email: 'Email',
    password: 'Password',
    facebook: 'Sign In with Facebook',
    google: 'Sign In with Google+',
    twbible: 'Sign In with TaiwanBible',
    signup: 'Sign Up',
    or: 'or',
    need: {
      title: 'Please log in first'
    }
  },
  register: {
    hello: 'Welcome folks!',
    msg: 'Please read the instructions',
    submit: 'Register',
    link: 'Terms of Service'
  },
  redirect: {
    msg: 'Redirecting...',
    click: 'Click here to continue...'
  },
  logout: {
    msg: 'You are now logged out.',
    msg2: 'If You want to log out,',
    click: 'click here.'
  },
  password: {
    modified: {
      title: 'Your password change request was successful.',
      content: 'Please use new password to login next time.'
    },
    submit: 'Change'
  },
  userinfo: {
    modified: {
      title: 'Your infomation change request was successful.',
      content: 'Next time your post will use them.'
    }
  },
  post: {
    created: {
      title: 'Post created!',
      content: 'Now will redirect to wall page.'
    },
    tips: {
      title: '~ Tips ~',
      content: 'You could submit this post by switch to basic tab'
    },
    upload: {
      error: 'File too large :('
    },
    tabs: {
      title: {
        basic: 'Basic',
        upload: 'Upload',
        enroll: 'Enroll',
        map: 'Location',
        advanced: 'Advanced'
      },
      msg: {
        upload: 'Dropping images, word or pdf files here, or click to select:',
        limit: 'Per file size limit：3 MB',
        urltips: 'URL should be start with http://'
      }
    },
    map: {
      'search': 'Search',
      'update': 'Update',
      'lat': 'Lat',
      'lng': 'Lng',
      'my': 'My Place',
      'geo': 'find my place',
      'tips': 'Named  your place please'
    },
    advanced: {
      'ocname': {
        'text': 'Organization Name（Optional）'
      }
    },
    detail: {
      'open': 'Enroll Now',
      'close': 'Enrollment Closed',
      'noexist': 'This post is not exist.',
      'nomap': 'No map infomation',
      'attachments': 'Attachments',
      'edit': 'Edit',
      'delete': {
        title: 'Are you sure?',
        text: 'This post will be remove forever.',
        confirm: 'Delete',
        cancel: 'Cancel',
        ok: {
          title: 'This post was deleted!',
          text: 'The post is deleted successfully.',
          confirm: 'Done'
        },
        err: {
          title: 'Error',
          text: 'An error occurred',
          confirm: 'Close'
        }
      },
      'start': ' started',
      'end': 'End in ',
      'this_year': 'this year'
    },
    submit: 'Post it',
    nodata: 'No data'
  },
  manage: {
    header: 'Posts by %(user)s',
    org_title: 'Manage Organization Infomation'
  },
  wall: {
    loading: 'Loading...',
    header: 'All events'
  },
  search: {
    loading: 'Loading...',
    nodata: 'No data',
    title: 'The result of "%(keyword)s" :'
  },
  news: {
    header: 'News',
    unnamed: 'Unknown'
  },
  geoloc: {
    nosupported: 'Geolocation is not supported in your browser',
    denied: 'User denied the request for Geolocation.',
    unavailable: 'Location information is unavailable.',
    timeout: 'The request to get user location timed out.',
    unknown: 'An unknown error occurred.',
    loading: 'We are trying to find some events near you ...',
    range: {
      text: 'range',
      'lv1': '3 km',
      'lv2': '5 km',
      'lv3': '10 km',
      'lv4': '20 km',
      'lv5': '50 km'
    },
    distance: {
      km: '%(dist)s km from you',
      m: '%(dist)s m from you',
      here: 'I am here',
      basic: {
        km: '%(dist)s km',
        m: '%(dist)s m',
        here: 'very close'
      }
    },
    button: {
      go: 'more...',
      close: 'close'
    }
  },
  form: {
    post: {
      error: 'Date range is invalid.',
      startDate: {
        label: 'Start date'
      },
      endDate: {
        label: 'End date'
      },
      title: {
        placeholder: 'Title'
      },
      content: {
        placeholder: 'Content'
      },
      type: {
        news: 'News',
        event: 'Event'
      },
      prop: {
        announcement: 'Announcement',
        ceremony: 'Ceremony',
        mission: 'Mission',
        gospel: 'Gospel',
        arts: 'Arts',
        ministry: 'Ministry',
        fellowship: 'Fellowship',
        society: 'Society',
        community: 'Community',
        family: 'Family',
        bibleStudy: 'Bible Study'
      }
    },
    reg: {
      error: 'Date range is invalid.',
      openDate: {
        label: 'Open date'
      },
      closeDate: {
        label: 'Close date'
      },
      url: {
        error: 'invalid format',
        placeholder: 'Enrollment Link'
      }
    },
    manage: {
      ocname: {
        error: 'Please correct and submit again.',
        placeholder: 'ID or Organization Name'
      },
      email: {
        error: 'email should be an email',
        placeholder: 'Organization Email'
      },
      contact: {
        placeholder: 'Contact Name'
      },
      url: {
        placeholder: 'Website Link'
      },
      zipcode: {
        placeholder: 'Zip Code'
      },
      country: {
        placeholder: 'Country'
      },
      city: {
        placeholder: 'City'
      },
      address: {
        placeholder: 'Address'
      },
      tel: {
        placeholder: 'Tel'
      },
      fax: {
        placeholder: 'Fax'
      }
    },
    changePassword: {
      password: {
        error: 'At least 6 characters',
        placeholder: 'Password'
      },
      passwordCheck: {
        error: 'do not match',
        help: 'Please enter password again',
        placeholder: 'password again'
      }
    },
    login: {
      email: {
        placeholder: 'Email'
      },
      password: {
        placeholder: 'Password'
      }
    },
    twblogin: {
      email: {
        placeholder: 'Email'
      },
      password: {
        placeholder: 'Password'
      }
    },
    signup: {
      email: {
        error: 'email should be an email',
        placeholder: 'Email'
      },
      password: {
        error: 'At least 6 characters',
        placeholder: 'Password'
      },
      passwordCheck: {
        error: 'do not match',
        placeholder: 'password again',
        help: 'Please enter password again'
      },
      tos: {
        label: 'I agree to the Terms and Conditions.'
      }
    }
  },
  message: {
    email: {
      unique: 'email must be unique'
    }
  }
}
