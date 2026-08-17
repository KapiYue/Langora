# 保活（Supabase + GitHub 定时任务）

## 为什么需要

| 平台 | 规则 | 后果 |
| --- | --- | --- |
| Supabase 免费版 | 连续 **7 天**没有数据库活动 → 项目暂停 | 整站不可用；Creem webhook 被静默丢弃（用户付了钱开不了会员）。**暂停超过 90 天项目会被删除** |
| GitHub Actions | 仓库连续 **60 天**没有任何活动 → 自动禁用所有 `schedule` 工作流 | 保活任务自己先死，然后 Supabase 悄悄休眠 |

第二条是关键：只写一个 cron 工作流是不够的，它自己会过期。所以本仓库的方案是双重保活。

## 组成

- [`scripts/keepalive.ts`](../scripts/keepalive.ts) — 执行 `select now()`（唯一必须成功的一步），再顺手 ping 一次 Supabase REST（失败只告警）。
- [`.github/workflows/keepalive.yml`](../.github/workflows/keepalive.yml) — 每 2 天 UTC 03:00（北京时间 11:00）跑一次；跑完检查仓库静默天数，超过 45 天就推一个空提交，重置 GitHub 的 60 天倒计时。

45 天阈值给 60 天上限留了 15 天缓冲，够连续失败好几次。用 `GITHUB_TOKEN` 推送不会触发其他 workflow，所以不会递归。

## 启用步骤

1. 在 GitHub 仓库 **Settings → Secrets and variables → Actions** 添加：

   | Secret | 必需 | 说明 |
   | --- | --- | --- |
   | `DATABASE_URL` | 是 | 与 `.env.local` 同一个值，建议用 pooler 连接串 |
   | `NEXT_PUBLIC_SUPABASE_URL` | 否 | 缺失时脚本跳过 REST ping |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` | 否 | 同上 |

2. 推送本次改动后，到 **Actions → Keepalive → Run workflow** 手动跑一次，确认是绿的。
3. 打开 **Settings → Notifications**，勾选 Actions 失败邮件通知 —— 保活任务红了必须有人知道。

本地验证：

```bash
npm run keepalive
```

## 注意事项

- **main 分支有保护规则时**，空提交会被拒绝。两个选项：给 `github-actions[bot]` 加 bypass，或改用 [`gautamkrishnar/keepalive-workflow`](https://github.com/gautamkrishnar/keepalive-workflow) 走 API 提交。
- 定时任务在 GitHub 高负载时会延迟几分钟到几十分钟，属正常现象；2 天一次的频率完全不受影响。
- 想要不依赖 GitHub 的兜底，可以加一个外部监控（UptimeRobot / cron-job.org）定时打一个会查库的接口。当前项目没有健康检查路由，需要先加一个 `app/api/ping/route.ts`。

## 已知问题（2026-08-17）

`.env.local` 里的 `DATABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL` 指向 Supabase 项目 `wzqnbezmhkngwijqside`，该项目的域名已经 NXDOMAIN（DB 和 API 主机都解析不到），说明**项目已被删除**（仅暂停的项目 DNS 仍可解析）。所以保活脚本本地跑会报 `tenant/user postgres.wzqnbezmhkngwijqside not found`。

需要先在 Supabase 建新项目、更新 `.env.local` 和 GitHub Secrets，保活才有意义。另外 `.env.local` 第 5、6 行有两个 `DATABASE_URL`，dotenv 取后者（pooler 那条）—— 建议只保留一条以免混淆。
