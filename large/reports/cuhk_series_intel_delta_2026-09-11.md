# CUHK-X 情报 A 组增量 — 2026-09-11 12:29 CST

范围：只记录共享总报告完成后的新增一手材料和可在四天内证伪的方案。没有重复深读既有 Large 7/7、Small 11/11 notebooks 或 18/18 旧讨论。官方登记已由用户确认完成。

## 一手增量

- Small 新增官方澄清：INT8 等量化被允许且鼓励；限制落在最终推理包，推理时加载的全部权重必须装入一个磁盘大小 `<100 MB` 的 checkpoint。来源：<https://www.kaggle.com/competitions/cuhk-x-competition-small-model-track/discussion/740749>。
- 公开 notebook 数量没有增加：Large 仍为 7，Small 仍为 11；没有新的完整训练—权重 lineage。
- 2026-09-11 刷新的公开榜 Top-15 可见门槛约为 Large `0.90058`、Small `0.85572`。这些数字只衡量资格差距，不用于逐行反推、阈值选择或公榜调参。
- 官方 Stage 2 仍是私榜 Top 15 后提交代码、单 checkpoint 和 `inference.sh`，Zoom 新样本现场推理及主办方离线复现；复现准确率相对私榜差距超过 10% 会被淘汰。来源：<https://openaiotlab.github.io/CUHK-X-Challenge/>。

## 最多三个四日内可证伪方向

### 1. Small：availability-routed 双专家，解决缺失模态

**增量依据。** CMI 2025 传感器赛冠军公开了完整训练仓库：把 IMU-only 与全模态模型分开建模并按可用模态融合；其代码为 LGPL-2.1。来源：<https://www.kaggle.com/competitions/cmi-detect-behavior-with-sensor-data/writeups/cmi-1st-place-solution>、<https://github.com/statist-bhfz/kaggle_cmi_1st_place_solution>。

**对应错误族。** Thermal/mmWave/Depth 缺失时的系统性退化，以及完整模态模型把“缺失模式”误当类别证据。先用 manifest 确认 Skeleton+IMU 是否为最稳定基础组合；若不是，按真实完整率选择基础专家。

**最小实现。** 不复制冠军的大集成；只做一个基础模态专家和一个全模态专家，显式输入 availability mask，训练时做与实测缺失率一致的 modality dropout。完整模态样本融合 logits，缺失样本只走可用专家。全部参数合并到单 checkpoint；INT8 仅在 FP32 OOF 过门后做。

**数据/算力。** 仅官方训练数据和现有预处理特征；一张 GPU；先跑两个预注册受试者半区，过门后补全 18-fold LOSO。目标 checkpoint `<90 MB`，给序列化元数据留余量。

**反证/退出门。** 相对当前同骨干 ERM：缺失模态子集至少 `+3pp`、全体 OOF 至少 `+1pp`，两个固定主体半区均为正，最差主体不下降超过 `1pp`；两次离线推理逐字节一致。任一失败、INT8 后下降 `>0.5pp`、或单 checkpoint 超限即 REJECT。

**许可/复现风险。** LGPL-2.1 可商用但带弱 copyleft；若复用代码须保留许可和修改义务。更稳妥的是按公开方法独立实现小型双专家。不得引入 CMI 数据或其训练权重。

### 2. Small：subject-domain Deep CORAL，解决跨主体漂移

**增量依据。** 2026 HAROOD 基准把 cross-person 明确定义为 HAR 的 OOD 场景并统一测试 16 种方法；其仓库未显示明确许可证，因此不复制代码。实际损失实现采用 MIT 许可的 DomainBed Deep CORAL。来源：<https://github.com/AIFrontierLab/HAROOD>、<https://github.com/facebookresearch/DomainBed>。

**对应错误族。** 训练主体特有的动作幅度、速度、骨架比例和 IMU 量程被编码进表示，导致未见主体整体混淆，而不是单一类别欠拟合。

**最小实现。** 在现有 Skeleton+IMU 轻量专家的倒数第二层加入 subject-as-domain 的协方差对齐损失；骨干、增强和分类头保持不变。只用内层训练主体在两个预注册权重中选择一个，不读取测试或公榜。

**数据/算力。** 无外部数据/权重；现有 subject IDs；一张 GPU。先做固定两半 LOSO 快杀，再补完整 18-fold。

**反证/退出门。** 总体 LOSO OOF 至少 `+1pp`，两个主体半区均非负，最差主体不下降超过 `1pp`；同时受试者 ID 线性探针准确率需相对下降至少 10%，但动作准确率不能靠类别/主体失衡获得。若增益只出现在一个半区、subject probe 不降、或训练耗时超过 ERM 的 1.5 倍即 REJECT。

**许可/复现风险。** DomainBed 为 MIT，可独立抽取小型 CORAL loss；HAROOD 仅作为实验设计证据，不复制其无明确许可证代码。CORAL 可能把有用的主体相关动作幅度一并抹平，故最差主体门必须硬执行。

### 3. Large：时间类别路由的 timestamp evidence-seeking

**增量依据。** CVPR 2026 TimeLogic challenge solution report 用“问题类别路由 + 多粒度时间戳采样 + Think–Act–Observe”代替一次性均匀抽帧，在官方测试取得 77.13 AvgAcc。它把 `before/after/overlap/three-event chain` 显式映射到不同采样预算。来源：<https://arxiv.org/abs/2606.01631>。

**对应错误族。** HAU 多动作顺序、短暂动作边界和同场景下的先后关系；均匀抽帧看见静态物体却漏掉决定顺序的瞬间。

**最小实现。** 只扩展现有冻结路线 C：先把题目分为时序/非时序与 pair/chain；对时序题生成带绝对时间戳的 coarse timeline，再只在候选边界附近追加同预算密集帧。使用现有本地 Qwen3-VL，不采用论文中的 Gemini API。Qwen3-VL 代码为 Apache-2.0：<https://github.com/QwenLM/Qwen3-VL>。

**数据/算力。** 预注册 40–60 个从未用于旧 Fresh20 的 HAU QA/clip；同一模型、同一总帧数、同一视觉 token 和生成 token 上限。需要现有本地 VLM 推理资源，不训练新权重。

**反证/退出门。** 时序题相对均匀抽帧至少 `+10pp`，两个主体半区均为正，parent-disagreement 净值为正，invalid=0；时间打乱/视频打乱反事实必须显著破坏时序题表现，text-only 不得复制增益。若收益来自额外帧/token、只在一个半区成立、或复用旧 Fresh20，立即 REJECT。

**许可/复现风险。** TimeLogic 只发布论文、未找到官方代码；只能按论文独立实现，不能声称精确复现。Qwen3-VL 仓库为 Apache-2.0，但最终所用具体 checkpoint 仍需随包记录模型卡与权重许可证。论文原结果依赖 Gemini 3.1 Pro，迁移到本地模型的效果高度不确定，正是本次冻结实验要证伪的对象。

## 分发建议

- Small 先做方向 1；只有双专家基础 OOF 稳定后才加方向 2，避免同时改变融合和域泛化而失去归因。
- Large 只把方向 3 作为既有路线 C 的一次冻结增量实验；不得重新打开旧 Fresh20 或文本模板联合解码路线。
