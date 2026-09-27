# CUHK-X 系列科研与冲刺计划（2026-09-11）

## 决策摘要

- CUHK-X 目前只有两个正式在赛奖项赛道：Large Model Track 与 Small Model Track；两个 Kaggle 赛道均已加入，队名均为 `[participant]`。
- 两个赛道共同截止于 `2026-09-15 15:55 UTC`，即北京时间 `2026-09-15 23:55`。内部硬停设为北京时间 `2026-09-15 18:00`。
- 主攻 Large，但 Small 不再暂停：主办方已澄清 AI coding assistant 可写/调试代码；Small 的最终推理模型必须是非 LLM，全部推理权重装入单一 `<100 MB` checkpoint。
- 两个赛道的主办方外部登记已于 2026-09-11 由用户确认完成；registration blocker 已解除，不再重复索取登记字段。
- 公开榜只用于整机制 sanity check，不用于逐行探测或超参数选择。Large 现有 `0.78070` 是资格 hedge，不是可复现研究终点；Small 早期公开榜受已确认的文件名泄漏污染。

## 1. 问题定义

CUHK-X 是非 RGB、多模态、跨受试者的人类活动理解基准。训练主体为 users 1–9、16–24；测试主体为 users 10、11、25、26，核心不是记住场景或人物，而是对未见主体泛化。

- Large：对隐私保护视频做选择题。HAU 包含单动作、多动作、动作组合、时序顺序、情绪；HARn 包含单动作与物体交互。多选与时序均为全有或全无 exact match。
- Small：把每段活动样本分为 40 类；可用 Depth、IR、Thermal、IMU、mmWave、Skeleton，模型与工程必须满足边缘部署约束。

主办方论文报告了很明显的“感知强、推理弱”断层：视觉模态可把 HAR 做到较高水平，但 HAU/HARn 的组合、顺序、情绪与物体关系仍显著更难。因此只把视频丢给一个更大的通用模型，或只继续调答案规则，都容易陷入局部最优。原始依据：[CUHK-X 论文](https://arxiv.org/abs/2512.07136)、[官方挑战页](https://openaiotlab.github.io/CUHK-X-Challenge/)、[Large 任务与评价](https://www.kaggle.com/competitions/cuhk-x-competition-large-model-track/overview/abstract)、[Small 任务](https://www.kaggle.com/competitions/cuhk-x-competition-small-model-track)。

## 2. 文献形成的方向判断

### 2.1 Large：主线不是“更大模型”，而是“独立感知 + 显式结构 + 受控语言推理”

1. **先把传感器映射为动作语义。** ImageBind 与 IMU2CLIP 证明深度、热成像、IMU 和文本可以进入共同语义空间；SensorLLM 与 LanHAR 进一步说明时间序列可以和动作语言对齐。比赛落地时只借鉴训练目标与 hard-negative 思路，不直接采用 ImageBind/IMU2CLIP 的 CC-BY-NC 权重，以免与获奖交付的许可条件冲突。参考：[ImageBind](https://github.com/facebookresearch/ImageBind)、[IMU2CLIP](https://github.com/facebookresearch/imu2clip)、[SensorLLM](https://arxiv.org/abs/2410.10624)、[LanHAR](https://arxiv.org/abs/2410.00003)。
2. **时序题先定位，再推理。** 统一抽帧会把短动作与先后顺序平均掉；问题驱动的粗定位→密集帧，比无条件加帧更可解释，也更易控制预算。Qwen3-VL 原生支持视频时间戳对齐，但必须在全新预注册样本上与同帧数均匀采样比较，不能重复挖已经失败的 Fresh20。参考：[Temporal Grounding Survey](https://arxiv.org/abs/2201.08071)、[Qwen3-VL 官方仓库](https://github.com/QwenLM/Qwen3-VL)。
3. **同一视频的题要联合但不能偷看文字模板。** 动作集合、顺序、物体和情绪应共享一个视频级潜变量图；然而任何联合规则都必须通过“去掉视觉/传感器后不能复现增益”的反事实门。ViLPAct 的分析也表明语言/意图可能压过视觉，必须专门做视觉消融。参考：[ViLPAct](https://arxiv.org/abs/2210.05556)。
4. **缺失模态不是异常，而是训练条件。** Small 官方数据说明部分 clip 会缺 Thermal/Radar；Large 的可用模态也不完全对齐。ActionMAE 的 modality dropout、重建和质量加权可以转化为比赛内的鲁棒性验证。参考：[ActionMAE 论文](https://arxiv.org/abs/2211.13916)、[官方实现](https://github.com/sangminwoo/ActionMAE)。

### 2.2 Small：可争名次，但必须把公榜当污染信号

- 公开的 `YOLO person crop + R(2+1)D` 是目前最可复现的工程锚点，公榜约 `0.71144`，远比 sample smoke 有效；优先做离线、无 token、单 checkpoint 合并和 subject split 复现，而不是照抄其公榜参数。
- 第二条正交线是 Thermal-only 小模型：8–16 帧、112/128 平方、小型 CNN + temporal pooling/轻量 Transformer。它既贴合原论文中的强模态，也容易压到 100MB 内。
- 第三条只在前两条 OOF 真正互补时启用：Skeleton+IMU 小专家，最后用 fold-aligned OOF 做 late fusion。禁止根据 405 个测试样本的类别频率调 prior。
- 缺模态鲁棒性、单 checkpoint、从原始 `data_dir` 离线执行、连续两次逐字节一致，是和准确率同级的晋级条件。

## 3. 公开竞赛材料覆盖与结论

本轮不是抽样，而是完整盘点：Large 公共 notebook `7/7`、Small `11/11`、两个赛道讨论主题 `18/18`，并深读主办方对泄漏、模型限制、权重大小、预处理、外部数据、伪标签和 Stage 2 的回复。再加挑战页、论文、官方仓库与 6 个相邻研究方向，覆盖约 45 个材料单元。

关键结论：

- Large 最有榜分价值的 Fususu handoff 给出 `0.77777` 的 682 行预测，但作者明确说明它不是公开 compact decoder 生成，也未给完整训练、权重与 OOF。现有两个 final selections 都继承该向量，只能作为 private-LB hedge，不能作为 Stage 2 新数据复现方案。
- Large 其余公开路线主要是通用 VLM prompt、API 或文本/类别众数骨架，尚无一个同时满足独立模型、subject-disjoint OOF、完整权重和 fresh-data 复现。
- Small 的 `YOLO + R(2+1)D` 最值得工程复现；但当前公开包把检测器和分类器拆成两个权重，还依赖联网/HF token 或 cache，不满足主办方 9 月 11 日最新的单一 checkpoint 要求。
- Small 早期 test filename/timestamp 可映射到 labeled split，主办方修复后没有重置公开榜；因此 `0.98+` 不能当可信技术目标。

## 4. 已经执行的反局部最优验证

### 4.1 Large clip-level joint decoder v1

严格 18-fold LOSO、同 clip 不跨折、规则仅用外层训练主体选择：

- OOF `2316 → 2335`，净增 `+19/4087`（`+0.4649pp`）；19 次改写为 `19 wins / 0 losses`，单侧 exact p=`1.91e-6`。
- HAU-single `0.89122 → 0.91471`；两个固定主体半区分别 `+9/+10`；最差主体不下降。
- sibling 冲突 `30/620 → 11/620`，下降 `63.3%`；选项置换 `4087/4087` 完全等变。
- 但 text-only sibling 反事实在不看视频/传感器时得到 `+22/4087`，超过主方法。

因此最终结论为 `REJECT_NO_TEST_CANDIDATE`：不生成测试候选，不占 Kaggle 提交。这个拒绝证明旧解附近的“结构改进”主要利用题目生成模板，不能可信迁移到私榜或现场新数据。

### 4.2 HAU Depth 数据恢复

- 官方完整大小 `3,674,779,437` bytes，期望 SHA-256 `616b527d193f5cd0b64de1ed7b2cbb0c5875d5db27da9f90af7413f49ba8b20c`。
- 现有安全断点 `100,663,296` bytes；前缀 SHA-256 与旧 receipt 一致。
- Google Drive 当前返回 quota exceeded HTML；范围下载器在写盘前 fail-closed，文件未被污染。
- 官方 Hugging Face 镜像需要登录并向数据集方共享联系信息，尚未擅自授权。后续优先等待 Drive 配额恢复后续传。

### 4.3 Large 时序视觉 preregistered-50

- 在任何新推理前冻结 50 道题、50 个唯一 clip；五个 HAU 题型各 10 道，两个固定受试者半区各 25 道。
- 与全部历史 VLM 记录重叠为 QA `0`、clip `0`；协议、selection、runner、freezer 均有哈希锁。
- 公平对照 runner 固定均匀采样与粗定位采样的帧数/令牌预算，并在缺任一冻结视频时 fail-closed。
- 当前 50 个冻结视频可用量为 `0/50`，因此状态是 `BLOCKED_ASSET`；未下载新模型、未启动推理、未生成 candidate CSV、未提交。

### 4.4 Small 受试者隔离最小闭环

- 已对主办方发布的 2,768 条 IMU 索引建立三个固定 subject-disjoint / clip-disjoint 折；18 个训练主体、40 类。
- 三个验证折为 960、835、973 条，subject overlap 与 clip overlap 全部为 0；其中第二折缺 class 25，后续 macro 统计必须明确处理。
- 常数多数类基线准确率为 `12.50% / 8.86% / 12.13%`，macro recall 为 `2.50% / 2.56% / 2.50%`。
- 当前训练 payload 可用量为 `0/2768`，所以没有伪造参数量、checkpoint、逐类/逐环境模型精度或 modality-drop 结果；状态为 `BLOCKED_RESOURCE / RESEARCH_ONLY / REJECT_NO_TEST_CANDIDATE`。

## 5. 三条 Large 路线与晋级门

### A. 结构优先整解（推荐）

补齐 HAU Depth；训练独立动作/情绪/对象/时序证据；同一 clip 通过潜变量动作图联合解码。晋级条件：总体至少 `+1–2pp`，两个主体半区与两个环境均非负，选项置换等变，text-only 反事实不能复制增益，invalid=0。

### B. 传感器—语义整解

用 IMU、雷达、骨架直接对选项语义打分，不把未知 0.77777 向量当父模型。晋级条件：与 parent 至少 30 个分歧；候选分歧准确率 `≥60%`、parent `≤40%`；两个主体半区均正；emotion 或 HARn/object 至少一个题型稳定提升。

### C. 时序视觉审计

在第一次推理前冻结 40–60 个全新 HAU QA/clip；同一模型、同一帧数、同一 token budget 下比较均匀采样与粗定位→密集帧。时序题需至少 `+10pp`，两个主体半区均正，parent-disagreement 为正；任何 invalid、额外帧/额外 token 解释全部增益，或复用旧 Fresh20，均直接停止。

路线图：`cuhk_large_sprint_routes.svg`（位于本任务 visualization 目录）。

## 6. 9月11日至15日冲刺日历

| 时间（北京时间） | Large | Small | 可提交条件 |
|---|---|---|---|
| 9/11 | 锁规则、哈希、完整公开材料；联合图 v1 已严格拒绝；恢复 HAU 下载 | 修正规则；审计 11 份 notebook 与泄漏；打包 S0 复现计划 | 不提交 |
| 9/12 | 完成传感器—语义 OOF；若 HAU 到位，启动 Depth 独立感知 | 复现 YOLO+R(2+1)D，合并单 checkpoint、去联网依赖 | 仅完整离线 gate 通过者，每赛道最多 1 次 |
| 9/13 | 完成 HAU 结构优先候选；全新时序 cohort 只跑一次冻结协议 | Thermal-only 或 Skeleton+IMU 二选一，禁止并行堆未经验证分支 | 必须是整机制提交，不做行级探榜 |
| 9/14 | 选择两个结构不同候选，原始目录 dry-run 两次 | 量化、单 checkpoint、缺模态测试、两次重跑 | 20:00 后冻结模型与配置 |
| 9/15 00:00–18:00 | 复现清单、技术报告、final selection 复核 | 同左；必要时保留 smoke 作为参与证明 | 18:00 内部硬停；23:55 官方截止 |

## 7. 自动监督与停止机制

- Large 任务改为每 2 小时推进；Small 改为每 4 小时合规冲刺。
- 调研 A 组改为每 6 小时只追踪 CUHK-X 一手增量，官方截止后自动停止本次专项刷新。
- 状态不变时保持安静；仅在候选过门、需要本人字段/法律确认、数据下载恢复、规则/截止变化、Kaggle 状态异常或复现失败时通知。
- 任何路线连续两轮只有 public-LB/文本模板收益而没有 subject-disjoint 证据，立即停线，把算力转给正交路线。
- 任何候选若不能从原始目录在新 ID/new clip 上生成，不得替换最终候选；任何第三方权重若许可不能支持获奖交付，不进入最终包。

## 8. 外部登记状态（已解决）

用户已确认 Large 与 Small 两个赛道的主办方正式登记完成，团队名与 Kaggle 一致。后续任务不得继续把外部登记列为 blocker；只有主办方回信指出资料不匹配或登记失效时才重新打开该门。

登记入口留作状态核对：[CUHK-X Challenge Registration](https://openaiotlab.github.io/CUHK-X-Challenge/#registration)。
