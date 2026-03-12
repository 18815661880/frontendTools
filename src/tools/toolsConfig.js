import JsonTool from './JsonTool.vue'
import ColorTool from './ColorTool.vue'
import DateTool from './DateTool.vue'
import ImageCompressTool from './ImageCompressTool.vue'

export const tools = [
  {
    name: 'JSON 格式化',
    slug: 'json',
    description: '格式化、压缩与校验 JSON 文本',
    component: JsonTool,
  },
  {
    name: '颜色选择器',
    slug: 'color',
    description: '选择颜色并查看 HEX / RGB',
    component: ColorTool,
  },
  {
    name: '日期转换器',
    slug: 'date',
    description: '时间戳与日期时间互转',
    component: DateTool,
  },
  {
    name: '图片压缩',
    slug: 'image',
    description: '本地压缩图片并下载，无需上传服务器',
    component: ImageCompressTool,
  },
]

export function findToolBySlug(slug) {
  return tools.find((item) => item.slug === slug)
}
