export interface SUAObject {
  plugins: SUAPlugin[]
  initQueue: Function[]
  taskQueue: Function[]
  styleQueue: string[]
  menuQueue: SUAPluginMenu[]
  init(): Promise<void>
}

// pathname和route至少要有一个
export interface SUAPlugin {
  name: string
  displayName: string
  icon: string
  isNecessary: boolean
  brief: string
  pathname?:
    | string
    | string[]
    | boolean
    | (() => boolean)
    | { [key: string]: string }
  route?:
    | string
    | string[]
    | boolean
    | (() => boolean)
    | { [key: string]: string }
  style?: string
  menu?: SUAPluginMenu | SUAPluginMenu[]
  init?: () => Promise<void> | void
  task?: () => Promise<void> | void
}

export interface SUAPluginMenu {
  rootMenuId: string
  rootMenuName: string
  id: string
  name: string
  item: SUAPluginMenuItem | SUAPluginMenuItem[]
}

export interface SUAPluginMenuItem {
  name: string
  style?: string
  route: string
  breadcrumbs: string[]
  render: ((root: HTMLElement) => Promise<void>) | ((root: HTMLElement) => void)
}
