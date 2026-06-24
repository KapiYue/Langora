我目前想要开发一个类似的产品，用户可以选择对应的课程，然后开始通过打字的方式学习语言。但是目前我发你的这款产品是通过中文学习英文的，我想开发的一款产品是通过英文来学习中文的。 核心的学习界面的功能点如下： 1. 在输入界面隐藏拼音，默认显示英文，用户输入拼音后显示中文 + 拼音，用户可以点击提示，点击提示后回显中文和拼音。 2. 点击回车进行校验，如果输入拼音错误，字体标红表示错误，并出现错误提示词。如果正确显示中文和拼音，出现正确提示音。再次按回车进入下一题。 3. 完成所有题目后，需要弹出恭喜和鼓励的话语的弹框，确认后回到课程列表。 项目有首页的落地页，无需登陆即可访问。登陆后进入到后台页面，后台页面侧边栏只有3个： 1. 主页，显示最近学的课程，以及用户的订阅情况 2. 课程包商城：不同的课程，每一节课包含10个单词或者例句。并且有分类 3. 升级会员：价格面板，包含2个档位：月度订阅(10美金/月)、永久用户（99美金） 请你帮我从产品经理的角度编写一个项目的需求文档，不需要设计到前端开发和后端开发等技术设计，只需要详细描述产品的页面和对应页面的功能

《English‑to‑Chinese Typing Course》产品需求文档

（功能层面，未涉技术实现）
-------------------------------分割线
1. 产品定位

一款面向海外中文学习者的分级中文打字学习平台。

核心价值：用“打字测验+即时纠错+游戏化激励”的方式，帮助零基础或进阶学习者快速掌握拼音输入与高频词/句。
商业模式：内容付费 + 订阅会员。
2. 目标用户
类型	典型画像	需求痛点
初级学习者	在海外工作的英语母语者，刚开始接触汉语	想先学会基础打招呼、常用动词等，缺乏系统路径；希望“听说读写”里先把“打字/输入”练熟
留学生 / 考试党	赴华交换或准备 HSK 考试	需要大量词汇记忆，渴望高效刷题与自测
兴趣学习者	喜爱中华文化、想看原版弹幕/社交媒体	需要有趣、短平快的练习场景和可持续激励

3. 用户旅程概览
访客 → 访问落地页 → 浏览课程/价格 → 注册
免费用户 → 进入「主页」→ 试学免费课程 → 体验学习界面 → 订阅提示
付费会员 → 解锁全部课程 → 连续打卡学习 → 完成课程 → 获得勋章/激励 → 分享或续费
4. 信息架构
- Landing Page（公开）
- Auth
  - Sign‑up / Login / OAuth
- App Shell（登录后）
  - 侧边栏
    · 主页  Home
    · 课程包商城  Course Store
    · 升级会员  Membership
  - 顶部栏
    · 用户头像 / 语言切换 / 退出
- 课程详情页（内嵌弹窗或独立路由）
- 学习界面  Lesson Player
- 完成弹框  Congrat Dialog
5. 详细页面需求
5.1 Landing Page（落地页，无需登录）
| 模块     | 功能说明                                                                 |
| ------ | -------------------------------------------------------------------- |
| 顶部导航   | Logo、价格、登录按钮、语言切换                                                    |
| 英雄区    | 宣传标语： “Type ‑ Speak ‑ Master Chinese” <br> CTA：`Start Learning Free` |
| 核心卖点   | ① 打字式学习 ② 分级课程体系 ③ 游戏化打卡 ④ 多端同步                                      |
| 免费试看   | Carousel 展示 2‑3 个免费课程卡，点击直达课程详情（引导注册）                                |
| 价格横幅   | 月订阅 / 永久买断卡片（见 5.4）                                                  |
| Footer | 联系方式、社媒、隐私条款、版权                                                      |
5.2 Auth
注册：邮箱 + 密码 / Google / Apple
登录：同上
忘记密码：邮件重置
交互：表单实时校验；成功后重定向到上次意图页；支持国际键盘无阻断体验
5.3 App Shell
侧边栏
| 图标 | 菜单        | 功能要点                                                                               |
| -- | --------- | ---------------------------------------------------------------------------------- |
| 🏠 | **主页**    | - 最近学习进度（课程卡 + 进度条）<br>- 今日打卡状态<br>- 订阅状态徽章<br>- CTA：继续学习                          |
| 📚 | **课程包商城** | - Tab：全部 / 主题分类 / 搜索栏<br>- 课程卡：封面、标题、标签（免费/会员/已购买）、课时数、学习人数<br>- 支持筛选（等级、话题、免费/付费） |
| 💎 | **升级会员**  | - 价格面板（见 5.4）<br>- FAQ<br>- 支付入口（嵌入 Stripe/Coinbase 等）                             |
5.4 Membership（升级会员）
| 方案   | 价格      | 权益                 | CTA         |
| ---- | ------- | ------------------ | ----------- |
| 月度订阅 | $10 / 月 | 解锁全部课程、数据云同步、会员群   | `Subscribe` |
| 永久买断 | $99 一次性 | 包含月度订阅全部权益 + 未来新课程 | `Buy Now`   |
附加：退款政策说明、自动续费提示、币种切换。

5.5 Course Store - 课程卡结构
封面图（自动裁切 4:3）
角标：FREE / PRO / OWNED
课程名（英文）
子标题（中文）
统计：⏱ 课时 / 👤 学习人数
点击行为：弹出课程详情
简介、目标、课表（每节 10 词/句）
免费试学（如节 1）
购买/开始学习按钮
5.6 Lesson Player（学习界面
| 区域      | UI 元素                                                         | 功能细节                                                                                                                                                                                                                           |
| ------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 顶部      | 进度条 + 计时器 + 退出按钮                                              | - 计时可隐藏/显示<br>- ESC = 退出确认                                                                                                                                                                                                     |
| 主面板     | - **英文提示**（常显）<br>- **输入框**（拼音）<br>- **结果行**（中文+拼音，初始隐藏）      | **交互逻辑**<br>1. 默认仅显示英文。<br>2. 用户输入拼音：`onChange` 同步转为小写无空格验证。<br>3. **Enter** 校验：<br>  ✅ 正确 → 结果行淡入（中文+拼音绿色），播放正音+提示音；按钮文案变“Next”<br>  ❌ 错误 → 输入框字体标红，显示正确拼音提示，播放错误音；允许再次输入或点击“Show Answer”<br>4. 再次 **Enter/Next** ：进入下一题或完成弹框 |
| 底部快捷键提示 | Ctrl+␣ 播放发音 / Ctrl+M 复听 / Ctrl+N 下一题 / Enter 提交 / Ctrl+; 显示答案 | 可折叠                                                                                                                                                                                                                            |
| 题目结构    | `{"en":"I", "zh":"我", "py":"wo3"}`                            | 题库 JSON 支持多可接受写法；错误提示按最接近匹配建议                                                                                                                                                                                                  |
5.7 Completion Dialog（结课弹框）
动画：🎉 Confetti
文案：Great job! You’ve mastered 10 new words!
统计：正确率、用时、连胜天数
CTA：
Back to Course List
Share your progress（Twitter / 微信二维码）
6. 业务规则
| 主题     | 规则                                                              |
| ------ | --------------------------------------------------------------- |
| 课程结构   | 课程 → 多节课 (Lesson) → 10 题 (Word/Expression)                      |
| 题目接受答案 | 默认 4 种格式：<br>`nihao` `ni hao` `ni3hao3` `ni3 hao3`<br>大小写与空格不敏感 |
| 计分逻辑   | 正确 +1，错误 0（显示正确答案后不可再得分）                                        |
| 解锁策略   | 免费用户仅能完整学习「免费」课程，会员解锁全部                                         |
| 本地化    | UI 100% 英文；中文字符与拼音由课程内容提供                                       |
7. 数据指标 & 事件埋点（概览）
DAU / MAU / 付费转化率
每用户日均学习量 & 完课率
错题词频 & 难度热力图
订阅续费 / 取消原因

（埋点事件示例：lesson_start word_correct word_wrong show_answer_click checkout_success）

8. 后续迭代方向（Roadmap）
移动端 PWA：离线缓存课程，支持系统级中文输入法联动。
语音跟读：结合 TTS & STT 练发音，与打字组合。
社群竞技：排行榜、好友 PK、每日挑战。
教师端 CMS：允许老师自定义课程包并分发。
以上为功能与页面层级的完整需求说明，可直接交付给设计与研发团队作为原型参考。
-------------------------------分割线
有几个需要修改的点，我们本次只完成MVP的版本： 1. 注册只支持邮箱 + 密码登陆 2. CTA的分享先不完成 3. 不需要埋点
已根据您的 MVP 范围调整完成需求文档：

注册：仅邮箱 + 密码
完成弹框：移除分享 CTA
删除埋点与指标章节

如有更多细化或新增需求，随时告诉我！
-------------------------------分割线
在学习界面还有一个重要的功能点我没有说，就是刚进入的一个中文单词或者例句的时候，应该自动发音2遍，如果输入正确，也需要自动发音2遍。

已补充 “自动播放中文语音 ×2” 的逻辑，放入 Lesson Player 表格里：

题目加载时自动播放两遍
输入正确后再次播放两遍，并随正确提示音一起触发

如还有细节要调整，随时告诉我！
-------------------------------分割线
课程的JSON数据结构应该怎么设计才可以满足学习界面的需求呢？
下面给出一套面向 MVP 的课程 JSON 数据设计示例，并解释每个字段在学习界面里的作用。你可以直接把它存成静态 JSON 文件，或导入数据库（如 Supabase 的 JSONB）后按需查询。
1. 顶层结构
{
  "course_id": "basic_greetings",
  "title_en": "Basic Greetings",
  "title_zh": "基础问候",
  "cover": "https://cdn.xxx/cover_basic_greetings.jpg",
  "level": "Beginner",          // 用于筛选
  "category": "Daily Life",     // 用于分类
  "lessons": [ /* Lesson 数组 */ ]
}

| 字段                    | 作用             |
| --------------------- | -------------- |
| `course_id`           | 唯一主键，便于路由与购买记录 |
| `title_en / title_zh` | 课程卡 & 详情页展示    |
| `cover`               | 课程封面图 URL      |
| `level / category`    | 商城筛选与标签        |
| `lessons`             | lesson 列表（见下）  |
2. Lesson 结构
{
  "lesson_id": "greetings_l1",
  "order": 1,                         // 用于顺序排序
  "title_en": "Lesson 1",
  "title_zh": "第 1 课",
  "items": [ /* Word / Sentence 数组 */ ]
}
| 字段                    | 作用                           |
| --------------------- | ---------------------------- |
| `lesson_id`           | 路由 & 进度记录（如 `user_progress`） |
| `order`               | 控制显示顺序                       |
| `title_en / title_zh` | Lesson 入口卡片与顶部标题             |
| `items`               | 10 题数据，驱动学习界面                |
3. Item（题目）结构
{
  "item_id": "nihao",
  "type": "word",                    // "word" or "sentence"
  "en": "Hello",
  "zh": "你好",
  "py": "ni3hao3",
  "accepted": ["nihao", "ni hao", "ni3hao3", "ni3 hao3"],
  "audio": "https://cdn.xxx/audio/nihao.mp3"
}
| 字段         | 用于学习界面功能                                  |
| ---------- | ----------------------------------------- |
| `item_id`  | 唯一键，可用于错题本等拓展                             |
| `type`     | 区分单词 / 例句 → 可用于不同字体或行高                    |
| `en`       | **英文提示**（默认展示）                            |
| `zh`       | **中文显示**（提交正确后才显）                         |
| `py`       | **标准拼音**（提交正确后才显；错误提示时显示）                 |
| `accepted` | **校验拼音**：只要在数组内就判定正确；界面对大小写、空格忽略可以在前端做预处理 |
| `audio`    | **自动发音**：学习界面在题目加载 & 正确提交时各播放两遍           |

为什么既保留 py 又有 accepted？
py 用作「正确答案」展示；accepted 可列出多种等价写法，方便处理空格/声调数字位置等容错需求。
4. 最小示例（1 课程 → 1 Lesson → 3 Items）
{
  "course_id": "basic_greetings",
  "title_en": "Basic Greetings",
  "title_zh": "基础问候",
  "cover": "https://cdn.xxx/covers/basic_greetings.jpg",
  "level": "Beginner",
  "category": "Daily Life",
  "lessons": [
    {
      "lesson_id": "greetings_l1",
      "order": 1,
      "title_en": "Lesson 1",
      "title_zh": "第 1 课",
      "items": [
        {
          "item_id": "nihao",
          "type": "word",
          "en": "Hello",
          "zh": "你好",
          "py": "ni3hao3",
          "accepted": ["nihao", "ni hao", "ni3hao3", "ni3 hao3"],
          "audio": "https://cdn.xxx/audio/nihao.mp3"
        },
        {
          "item_id": "zaijian",
          "type": "word",
          "en": "Good‑bye",
          "zh": "再见",
          "py": "zai4jian4",
          "accepted": ["zaijian", "zai jian", "zai4jian4", "zai4 jian4"],
          "audio": "https://cdn.xxx/audio/zaijian.mp3"
        },
        {
          "item_id": "xiexie",
          "type": "word",
          "en": "Thank you",
          "zh": "谢谢",
          "py": "xie4xie4",
          "accepted": ["xiexie", "xie xie", "xie4xie4", "xie4 xie4"],
          "audio": "https://cdn.xxx/audio/xiexie.mp3"
        }
      ]
    }
  ]
}
5. 接口 / 加载思路（参考）
课程商城列表：只查询顶层字段（不拉取 items），提升加载速度。
进入 Lesson Player：一次性拉取该 lesson 全部 items，存于前端状态机；或者按 item 序号分页请求。
自动发音：new Audio(item.audio)→ play()；完播后再调用一次即满足“播放两遍”。

这样设计即可满足您之前列出的所有学习界面交互：

默认英文提示 → 输入框校验 → 正确/错误逻辑
自动双发音（靠 audio 字段）
正确后显示中文 + 拼音

如需再扩展（例如「示例图片」「语法点」「HSK 等级」等），可在 item 或 lesson 里追加字段，不会破坏现有前端逻辑。

-------------------------------分割线
我不需要2层结构，只需要Lesson这一层结构就好，只需要通过Tag来实现分类就好
下面给出 “单层 Lesson 方案” 的 JSON 设计——每条 Lesson 自带标签（tags）即可完成分类与付费属性，无须再套一层 Course。
1. Lesson 数据结构
{
  "lesson_id": "greetings_l1",       // 唯一主键，用于 URL & 进度保存
  "title_en": "Basic Greetings",     // 英文标题（商城卡片 & 顶部栏）
  "title_zh": "基础问候",              // 中文标题（可选）
  "cover": "https://cdn.xxx/greet.jpg", // 封面图
  "tags": ["Beginner", "DailyLife", "FREE"], // 任意枚举，用于筛选 & 付费控制
  "order": 1,                        // 同一 tag 下的显示顺序
  "items": [ /* Word / Sentence 数组，建议 10 条 */ ]
}
关键字段说明
字段	作用 & 用法
lesson_id	路由、用户进度、购买记录的主键
title_en / title_zh	UI 展示（侧边栏 / 顶部）
cover	Lesson 卡片缩略图
tags	分类 + 付费：
• 内容标签：Beginner / HSK1 / Travel …
• 付费标签：FREE / PRO（后端据此判断是否需订阅）
order	前端排序
items	真正驱动学习界面的题目数组（见下）
2. Item（题目）结构
{
  "item_id": "nihao",
  "type": "word",                          // "word" | "sentence"
  "en": "Hello",                           // 首屏展示
  "zh": "你好",                             // 正确后展示
  "py": "ni3hao3",                         // 标准拼音
  "accepted": ["nihao", "ni hao", "ni3hao3", "ni3 hao3"],
  "audio": "https://cdn.xxx/audio/nihao.mp3"
}
校验：前端将用户输入标准化（小写、去空格）后只需 accepted.includes(input)。
自动发音 ×2：audio 播放完成后重复一次即可。
3. 最小完整示例（JSON 数组）
[
  {
    "lesson_id": "greetings_l1",
    "title_en": "Basic Greetings",
    "title_zh": "基础问候",
    "cover": "https://cdn.xxx/covers/greet.jpg",
    "tags": ["Beginner", "DailyLife", "FREE"],
    "order": 1,
    "items": [
      {
        "item_id": "nihao",
        "type": "word",
        "en": "Hello",
        "zh": "你好",
        "py": "ni3hao3",
        "accepted": ["nihao", "ni hao", "ni3hao3", "ni3 hao3"],
        "audio": "https://cdn.xxx/audio/nihao.mp3"
      },
      {
        "item_id": "zaijian",
        "type": "word",
        "en": "Good‑bye",
        "zh": "再见",
        "py": "zai4jian4",
        "accepted": ["zaijian", "zai jian", "zai4jian4", "zai4 jian4"],
        "audio": "https://cdn.xxx/audio/zaijian.mp3"
      },
      {
        "item_id": "xiexie",
        "type": "word",
        "en": "Thank you",
        "zh": "谢谢",
        "py": "xie4xie4",
        "accepted": ["xiexie", "xie xie", "xie4xie4", "xie4 xie4"],
        "audio": "https://cdn.xxx/audio/xiexie.mp3"
      }
      /* 其余共 10 条 */
    ]
  },

  {
    "lesson_id": "travel_hotel_l1",
    "title_en": "Hotel Check‑in",
    "title_zh": "酒店入住",
    "cover": "https://cdn.xxx/covers/hotel.jpg",
    "tags": ["HSK2", "Travel", "PRO"],
    "order": 2,
    "items": [ /* 10 条 */ ]
  }

  /* 更多 Lesson … */
]
4. 前端加载建议
商城列表
只拉取除 items 之外的字段 ⇒ 轻量级渲染。
进入学习界面
通过 lesson_id 请求完整对象（含 items）。
存入 React/Zustand 状态机或 SWR cache；逐条渲染即可。
付费判断
后端接口根据 tags 是否含 PRO 决定是否返回/解锁。

这样就能用一张表（或一个集合）同时承担分类、排序、付费控制，结构足够简单，也方便后期 tag‑based 筛选和搜索。
-------------------------------分割线
移除掉tags，改用tag，只保留一个，例如Greeting、DailyLife、Dining

好的，字段调整如下：

Lesson JSON（单层，使用 tag 字段）
{
  "lesson_id": "greetings_l1",           // 唯一键
  "title_en": "Basic Greetings",         // 英文标题
  "title_zh": "基础问候",                  // 中文标题（可选）
  "cover": "https://cdn.xxx/greet.jpg",  // 封面 URL
  "tag": "Greeting",                     // **单值分类**：如 Greeting / DailyLife / Dining …
  "order": 1,                            // 显示顺序
  "items": [                             // 10 题示例
    {
      "item_id": "nihao",
      "type": "word",
      "en": "Hello",
      "zh": "你好",
      "py": "ni3hao3",
      "accepted": ["nihao", "ni hao", "ni3hao3", "ni3 hao3"],
      "audio": "https://cdn.xxx/audio/nihao.mp3"
    }
    /* …共 10 条 … */
  ]
}
字段对照
字段	作用
tag	唯一分类标签（字符串）。前端筛选、搜索、付费判断都靠它。例如：Greeting 
其他字段	同之前说明，不变。
最小示例（含两节课）
[
  {
    "lesson_id": "greetings_l1",
    "title_en": "Basic Greetings",
    "title_zh": "基础问候",
    "cover": "https://cdn.xxx/covers/greet.jpg",
    "tag": "Greeting",
    "order": 1,
    "items": [ /* 10 items */ ]
  },
  {
    "lesson_id": "dining_l1",
    "title_en": "Dining Out",
    "title_zh": "外出就餐",
    "cover": "https://cdn.xxx/covers/dining.jpg",
    "tag": "Dining",
    "order": 1,
    "items": [ /* 10 items */ ]
  }
]

前端筛选逻辑示例：select * from lessons where tag = 'Dining'
若需多层细分，可在未来增加 sub_tag 或 level 字段，不影响当前结构。
-------------------------------分割线
不对，item_id需要是uuid才行，不能使用拼音，因为中文中有很多重复的拼音。请你重新设计Lesson JSON

下面给出更新后的 Lesson JSON 设计——唯一变化是 item_id 改为 UUID v4；其余字段保持与上一版一致，仍采用单一 tag 进行分类。

1. Lesson 结构
{
  "lesson_id": "greetings_l1",           // lesson 主键（可自定义人类可读形式）
  "title_en": "Basic Greetings",
  "title_zh": "基础问候",
  "cover": "https://cdn.example.com/covers/greet.jpg",
  "tag": "Greeting",                     // 单值分类：Greeting / DailyLife / Dining…
  "order": 1,                            // 用于 UI 排序
  "items": [ /* 题目数组，见下 */ ]
}
2. Item 结构
{
  "item_id": "2c3a9f33-5b49-4b82-ab4a-9bc9466d887e",  // UUID v4
  "type": "word",                       // "word" | "sentence"
  "en": "Hello",                        // 首屏英文提示
  "zh": "你好",                          // 正确后显示
  "py": "ni3hao3",                      // 标准拼音
  "accepted": [
    "nihao",
    "ni hao",
    "ni3hao3",
    "ni3 hao3"
  ],
  "audio": "https://cdn.example.com/audio/nihao.mp3"
}
生成 & 使用说明
字段	说明
item_id	使用后端或构建脚本在导入时生成 UUID v4（避免重复拼音冲突，便于后期扩展错题本、分析等）。前端不依赖可读性，只要保持唯一即可。
其他字段	保持不变，满足学习界面的：
• 默认英文提示
• 自动双发音（依赖 audio）
• 拼音校验 (accepted)
3. 最小完整示例
[
  {
    "lesson_id": "greetings_l1",
    "title_en": "Basic Greetings",
    "title_zh": "基础问候",
    "cover": "https://cdn.example.com/covers/greet.jpg",
    "tag": "Greeting",
    "order": 1,
    "items": [
      {
        "item_id": "2c3a9f33-5b49-4b82-ab4a-9bc9466d887e",
        "type": "word",
        "en": "Hello",
        "zh": "你好",
        "py": "ni3hao3",
        "accepted": ["nihao", "ni hao", "ni3hao3", "ni3 hao3"],
        "audio": "https://cdn.example.com/audio/nihao.mp3"
      },
      {
        "item_id": "59ea1fa2-6ceb-4c97-890b-8a1e8d205b9f",
        "type": "word",
        "en": "Good‑bye",
        "zh": "再见",
        "py": "zai4jian4",
        "accepted": ["zaijian", "zai jian", "zai4jian4", "zai4 jian4"],
        "audio": "https://cdn.example.com/audio/zaijian.mp3"
      },
      {
        "item_id": "d7e27916-4e4b-44cf-9d1e-62f5c78b8507",
        "type": "word",
        "en": "Thank you",
        "zh": "谢谢",
        "py": "xie4xie4",
        "accepted": ["xiexie", "xie xie", "xie4xie4", "xie4 xie4"],
        "audio": "https://cdn.example.com/audio/xiexie.mp3"
      }
      /* …其余共 10 条 … */
    ]
  }
]

前端校验提示：在比较时先将用户输入转换为小写，并去除空格或多余字符，再与 accepted 数组对比；若匹配即判定正确。

使用该结构即可避免拼音重复冲突，同时仍满足您的 MVP 学习界面全部交互需求。
-------------------------------分割线
我希望在lesson课程中添加一个英文描述，能让用户知道你学习完成这个课程后学习到什么。请你重新给到我该json

下面是一份更新后的 Lesson JSON 示例，加入了 description_en 字段，用来告诉学习者完成本课后将掌握的内容。其余字段保持不变，item_id 继续使用 UUID v4。

[
  {
    "lesson_id": "greetings_l1",
    "title_en": "Basic Greetings",
    "title_zh": "基础问候",
    "description_en": "After finishing this lesson you will be able to greet people in Mandarin, say goodbye politely, and express thanks in everyday situations.",
    "cover": "https://cdn.example.com/covers/greet.jpg",
    "tag": "Greeting",
    "order": 1,
    "items": [
      {
        "item_id": "2c3a9f33-5b49-4b82-ab4a-9bc9466d887e",
        "type": "word",
        "en": "Hello",
        "zh": "你好",
        "py": "ni3hao3",
        "accepted": ["nihao", "ni hao", "ni3hao3", "ni3 hao3"],
        "audio": "https://cdn.example.com/audio/nihao.mp3"
      },
      {
        "item_id": "59ea1fa2-6ceb-4c97-890b-8a1e8d205b9f",
        "type": "word",
        "en": "Good‑bye",
        "zh": "再见",
        "py": "zai4jian4",
        "accepted": ["zaijian", "zai jian", "zai4jian4", "zai4 jian4"],
        "audio": "https://cdn.example.com/audio/zaijian.mp3"
      },
      {
        "item_id": "d7e27916-4e4b-44cf-9d1e-62f5c78b8507",
        "type": "word",
        "en": "Thank you",
        "zh": "谢谢",
        "py": "xie4xie4",
        "accepted": ["xiexie", "xie xie", "xie4xie4", "xie4 xie4"],
        "audio": "https://cdn.example.com/audio/xiexie.mp3"
      }
      /* 其余共 10 条 */
    ]
  }
]
description_en：出现在课程详情页，用来向用户说明完成该课能掌握哪些词汇/场景。
其他字段与之前一致，仍满足学习界面的所有需求。

-------------------------------分割线
根据我们字段，调整课程卡和学习界面要显示的数据。课程卡目前有tag，前端需要实现筛选。默认是全部课程卡。筛选用那种标签选择器实现，可以多选。也请你修改对应的需求文档中的描述

已将 课程卡结构 & 筛选 更新为「可多选 Tag Selector」，并补充了默认显示全部课程、并集过滤与交互细节。如需进一步调整，随时告诉我！

