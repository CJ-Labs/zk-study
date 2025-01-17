package main

import (
	"fmt"
	"math/big"

	"./crs"
)

func main() {
	// 初始化CRS
	system, err := crs.Setup(10) // 支持最高10次多项式
	if err != nil {
		panic(err)
	}

	// 创建一个多项式的系数
	coeffs := []*big.Int{
		big.NewInt(1), // 常数项
		big.NewInt(2), // x的系数
		big.NewInt(3), // x²的系数
	}

	// 生成承诺
	commitment := system.Commit(coeffs)
	fmt.Printf("Commitment: %s\n", commitment.String())

	// 在某点验证
	point := big.NewInt(5)
	value := big.NewInt(86) // f(5) = 1 + 2*5 + 3*25 = 86
	proof := big.NewInt(0)  // 在实际应用中需要生成proper proof

	// 验证
	if system.Verify(commitment, point, value, proof) {
		fmt.Println("Verification successful!")
	} else {
		fmt.Println("Verification failed!")
	}
}
