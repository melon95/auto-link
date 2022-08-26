# auto-link

直接从源头解决各种安全中心，干净快速。

目前支持：
- 知乎
- 掘金
- 简书
- CSDN
- 思否

配置说明：
```JS
{
  // host: 网站的主机名，可以在控制台通过location.host查看
  'host': {
    {
      key: 'a标签中href的查询参数',
      hrefPrefix: 'a标签中href的开头'
    }
  }
}
```

