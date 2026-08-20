# 保活（Supabase + GitHub 定时任务）

## 为什么需要

| 平台 | 规则 | 后果 |
| --- | --- | --- |
| Supabase 免费版 | 连续 **7 天**没有数据库活动 → 项目暂停 | 整站不可用；Creem webhook 被静默丢弃（用户付了钱开不了会员）。**暂停超过 90 天项目会被删除** |
| GitHub Actions | 仓库连续 **60 天**没有任何活动 → 自动禁用所有 `schedule` 工作流 | 保活任务自己先死，然后 Supabase 悄悄休眠 |

第二条是关键：只写一个 cron 工作流是不够的，它自己会过期。所以本仓库的方案是双重保活。

## 组成

- [`scripts/keepalive.ts`](../scripts/keepalive.ts) — 执行 `select now()`（唯一必须成功的一步），再顺手 ping 一次 Supabase REST（失败只告警）。
- [`.github/workflows/keepalive.yml`](../.github/workflows/keepalive.yml) — 每 2 天 UTC 03:17（北京时间 11:17）跑一次，分钟数刻意避开整点高峰；跑完往 `keepalive` 分支推一次心跳，重置 GitHub 的 60 天倒计时。

### 心跳分支

每次运行都推，不设静默天数阈值 —— 判断"多久没活动"本身就是一个会出错的环节，每次都推更简单也更可靠。

心跳用 git 底层命令直接造对象，不碰工作区：

```
blob（HEARTBEAT 文件）→ tree（单文件）→ commit（不带 -p，即孤儿提交）→ 强推到 refs/heads/keepalive
```

因为是孤儿提交 + 强推，`keepalive` 分支**永远只有一个提交、一个 `HEARTBEAT` 文件**，不会随时间膨胀，也完全不进 `main` 的历史。分支不需要提前创建，第一次推送时自动生成。

`HEARTBEAT` 内容是心跳时间、当时 `main` 的 SHA、那次 run 的链接，方便回查。

推心跳那一步带 `if: always()`：连数据库那步失败时它照样要跑 —— DB 挂了是一回事，定时任务被 GitHub 禁用（连重试机会都没有）是更糟的另一回事。

用 `GITHUB_TOKEN` 推送不会触发其他 workflow，所以不会递归。

## 启用步骤

1. 在 GitHub 仓库 **Settings → Secrets and variables → Actions** 添加：

   | Secret | 必需 | 说明 |
   | --- | --- | --- |
   | `DATABASE_URL` | 是 | 与 `.env.local` 同一个值，建议用 pooler 连接串 |
   | `NEXT_PUBLIC_SUPABASE_URL` | 否 | 缺失时脚本跳过 REST ping |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` | 否 | 同上 |

2. 推送本次改动后，到 **Actions → Keepalive → Run workflow** 手动跑一次，确认是绿的，并确认分支列表里出现了 `keepalive`。
3. 开启失败邮件通知 —— 保活任务红了必须有人知道。这是**账号级设置，仓库里没有开关**：
   - 打开 <https://github.com/settings/notifications>，找到 **Actions** 一节
   - 勾选 **Email**，并勾上 **Only notify for failed workflows**（否则每两天成功一次也发信，很快就会被划进垃圾箱）
   - 注意：schedule 触发的 run 失败时，邮件发给**最后修改该 workflow 文件的人**，不是仓库所有者。所以改 workflow 的 push 要用自己的账号。

本地验证：

```bash
npm run keepalive
```

## 注意事项

- **不要给 `keepalive` 分支加保护规则**，它每次都是强推覆盖，保护规则会直接让保活失效。也别对着它的"只有一个提交、没有历史"感到奇怪，那是设计如此。
- 定时任务在 GitHub 高负载时会延迟几分钟到几十分钟，属正常现象；2 天一次的频率完全不受影响。
- 判断 Supabase 项目是否还活着时，**别只凭本机 `nslookup` 解析不到就下结论**（见下）。以 Supabase 控制台为准。

## 历史记录

**2026-08-17** 曾记录"Supabase 项目 `wzqnbezmhkngwijqside` 已被删除"，依据是本机对 `db.<ref>.supabase.co` 和 `<ref>.supabase.co` 解析不到。

**2026-08-20 复核：该判断有误，项目仍在。** 当时的 NXDOMAIN 是本机／网络环境解析失败，不是域名不存在 —— 判据是同一次检查里连 `aws-1-ap-southeast-1.pooler.supabase.com` 这种与本项目无关的 Supabase 共享域名也解析不到，而它的存在与否跟你的项目毫无关系。单机 DNS 结果不能作为"项目被删"的证据。
