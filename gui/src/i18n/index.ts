import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// 引入需要实现国际化的简体、英文两种数据的json文件
import zhTranslation from './locales/zh.json'
import enTranslation from './locales/en.json'

i18n
  .use(initReactI18next) // 将 i18n 向下传递给 react-i18next
  // 初始化 i18next
  // 配置参数的文档: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
      'en': { translation: enTranslation },
      'zh-CN': { translation: zhTranslation },
    },
    lng: 'zh-CN',
    fallbackLng: 'en', // 默认当前环境的语言
    // 需要链式调用messages.welcome
    // keySeparator: false, // we do not use keys in form messages.welcome
    debug: true,
    interpolation: { escapeValue: false },
  })

export default i18n