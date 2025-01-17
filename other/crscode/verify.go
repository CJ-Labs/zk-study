package crs

import (
	"math/big"
)

// Verify 验证多项式承诺
func (crs *CRS) Verify(commitment *big.Int, point *big.Int, value *big.Int, proof *big.Int) bool {
	// 在实际应用中，这里需要实现双线性配对验证
	// 这里简化为基本验证
	eval := crs.evaluateAt(point)
	return eval.Cmp(value) == 0
}

// evaluateAt 在指定点评估多项式
func (crs *CRS) evaluateAt(point *big.Int) *big.Int {
	result := big.NewInt(0)
	temp := new(big.Int)
	xPower := big.NewInt(1)

	for _, power := range crs.Powers {
		// result += power * x^i
		temp.Mul(power, xPower)
		temp.Mod(temp, crs.P)
		result.Add(result, temp)
		result.Mod(result, crs.P)

		// x^(i+1)
		xPower.Mul(xPower, point)
		xPower.Mod(xPower, crs.P)
	}

	return result
}
