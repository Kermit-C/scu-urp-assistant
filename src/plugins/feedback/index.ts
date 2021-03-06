import Vue, { VNode } from 'vue'
import App from './Feedback.vue'
import { emitDataAnalysisEvent } from '../data-analysis'
import { getPluginIcon } from '@/utils'
import { SUAPlugin } from '@/types'

function render(root: HTMLElement): void {
  $(root).append(`<div class="sua-container-feedback"></div>`)
  new Vue({
    render: (h): VNode => h(App)
  }).$mount('.sua-container-feedback')
  emitDataAnalysisEvent('咨询与反馈', '显示成功')
}

export default {
  name: 'feedback',
  displayName: '反馈',
  icon: getPluginIcon('feedback'),
  isNecessary: true,
  brief: '反馈页面，是助手界面的一部分，不可关闭。',
  route: 'help/feedback',
  menu: {
    rootMenuId: 'sua-menu-list',
    rootMenuName: 'SCU URP 助手',
    id: 'menu-help',
    name: '帮助',
    item: {
      name: '咨询与反馈',
      route: 'help/feedback',
      breadcrumbs: ['SCU URP 助手', '帮助', '咨询与反馈'],
      render
    }
  }
} as SUAPlugin
