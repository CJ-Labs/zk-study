
crs往往是一组椭圆曲线点，一般由 MPC 网络生成
# CRS 核心技术组成

## 1. 密码学基础
### 1.1. 双线性配对
   - e: `G1 × G2 → GT`
   - 用于KZG承诺
   - 验证多项式关系

### 1.2. 离散对数假设
   - 基础安全性假设
   - 保证CRS不可逆
   - 防止提取陷门信息
## 2. 多项式承诺
## 3. 同态加密特性
1. 加法同态
2. 乘法同态

# 核心应用
## 1.  在Groth16中
1. 电路专用SRS
   - 针对特定电路
   - 一次设置多次使用
   - 不支持电路更新

2. 验证机制
   - 配对验证
   - 多项式约束
   - 零知识性

## 2. 在PLONK中
1. 通用SRS
   - 支持不同电路
   - 一次设置通用使用
   - 允许电路更新

2. 验证特点
   - 灵活的约束系统
   - 可更新的证明
   - 通用性强

# CRS CODE DEMO

[code](./crscode/crs.go)

只是假单的展示，实际的CRS系统需要：
- 完整的双线性配对实现
- 多方参与的可信设置（MPC网络）
