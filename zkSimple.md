# 1. 基本流程
```go
// 完整流程：Setup -> Prove -> Verify
// 1. Setup: 生成证明密钥和验证密钥
pk, vk, err := groth16.Setup(circuit)

// 2. Prove: 使用证明密钥生成证明
proof, err := groth16.Prove(circuit, pk, witness)

// 3. Verify: 使用验证密钥验证证明
err = groth16.Verify(proof, vk, publicWitness)
```
# 2. 具体流程
## 1.密钥生成 (Setup)
```go
// keygen/main.go
func main() {
    // 1. 编译电路
    circuit := NewCircuit()
    r1cs, err := frontend.Compile(field, builder, circuit)
    
    // 2. 生成密钥对
    pk, vk, err := groth16.Setup(r1cs)
    
    // 3. 保存密钥
    SaveKeys(pk, vk)
}
```
## 2. 生成证明 (Prove)
```go
// witness/main.go
func main() {
    // 1. 准备见证数据
    witness := PrepareWitness()
    
    // 2. 加载证明密钥
    pk := LoadProvingKey()
    
    // 3. 生成证明
    proof, err := groth16.Prove(circuit, pk, witness)
}
```
## 3.验证证明 (Verify)
```go
// verifier/main.go
func main() {
    // 1. 加载验证密钥
    vk := LoadVerifyingKey()
    
    // 2. 加载公开输入
    publicWitness := GetPublicInputs()
    
    // 3. 验证证明
    err := groth16.Verify(proof, vk, publicWitness)
}
```