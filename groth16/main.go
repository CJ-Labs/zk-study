package groth16

import "fmt"

func main() {
	// 1. 设置系统参数（在实际应用中通常是预计算的）
	pk := setupProvingKey()
	vk := setupVerifyingKey()

	// 2. 准备witness和公开输入
	witness := []Fr{} // 私密输入
	public := []Fr{}  // 公开输入

	// 3. 生成证明
	proof, err := GenerateProof(pk, witness, public)
	if err != nil {
		panic(err)
	}

	// 4. 验证证明
	if Verify(vk, proof, public) {
		fmt.Println("Proof is valid!")
	} else {
		fmt.Println("Proof is invalid!")
	}
}
