import JsonTool from './JsonTool.vue'
import ColorTool from './ColorTool.vue'
import DateTool from './DateTool.vue'
import ImageCompressTool from './ImageCompressTool.vue'
import VariableNameTool from './VariableNameTool.vue'
import Base64Tool from './Base64Tool.vue'
import UrlTool from './UrlTool.vue'
import HtmlEscapeTool from './HtmlEscapeTool.vue'
import RegexTool from './RegexTool.vue'
import UuidTool from './UuidTool.vue'
import CodePreviewTool from './CodePreviewTool.vue'
import RemPxTool from './RemPxTool.vue'
import PlaceholderTool from './PlaceholderTool.vue'
import HashTool from './HashTool.vue'
import JwtTool from './JwtTool.vue'
import NumberBaseTool from './NumberBaseTool.vue'

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
  {
    name: '变量名生成',
    slug: 'variable',
    description: '根据短语生成 camelCase、kebab-case、snake_case 等命名',
    component: VariableNameTool,
  },
  {
    name: 'Base64 编解码',
    slug: 'base64',
    description: '文本 Base64 编码与解码',
    component: Base64Tool,
  },
  {
    name: 'URL 编解码',
    slug: 'url',
    description: 'URL 编码 / 解码（encodeURIComponent）',
    component: UrlTool,
  },
  {
    name: 'HTML 转义',
    slug: 'html-escape',
    description: 'HTML 特殊字符转义与反转义',
    component: HtmlEscapeTool,
  },
  {
    name: '正则测试',
    slug: 'regex',
    description: '输入正则与测试文本，查看匹配结果',
    component: RegexTool,
  },
  {
    name: 'UUID 生成',
    slug: 'uuid',
    description: '生成 UUID v4，支持批量与复制',
    component: UuidTool,
  },
  {
    name: '代码预览',
    slug: 'code-preview',
    description: '输入 HTML 代码，右侧实时预览渲染效果',
    component: CodePreviewTool,
  },
  {
    name: 'PX / REM 换算',
    slug: 'rem-px',
    description: '根据基准字号在 px 与 rem 之间互相换算',
    component: RemPxTool,
  },
  {
    name: '占位文本生成',
    slug: 'placeholder',
    description: '生成 Lorem 或中文占位段落，用于排版预览',
    component: PlaceholderTool,
  },
  {
    name: '哈希计算',
    slug: 'hash',
    description: 'SHA-256 / SHA-384 / SHA-512 哈希（Hex 输出）',
    component: HashTool,
  },
  {
    name: 'JWT 解析',
    slug: 'jwt',
    description: '解析 JWT 查看 Header 与 Payload，不校验签名',
    component: JwtTool,
  },
  {
    name: '进制转换',
    slug: 'number-base',
    description: '二 / 八 / 十 / 十六进制互转',
    component: NumberBaseTool,
  },
]

export function findToolBySlug(slug) {
  return tools.find((item) => item.slug === slug)
}
