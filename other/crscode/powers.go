package crs

import (
	"math/big"
)

// generatePowers 生成幂次序列
func (crs *CRS) generatePowers(degree int) {
	crs.Powers = make([]*big.Int, degree+1)
	current := big.NewInt(1)

	for i := 0; i <= degree; i++ {
		// 复制当前值
		crs.Powers[i] = new(big.Int).Set(current)
		// 计算下一个幂
		current = new(big.Int).Mul(current, crs.alpha)
		current = current.Mod(current, crs.P)
	}
}

// Commit 对多项式进行承诺
func (crs *CRS) Commit(coeffs []*big.Int) *big.Int {
	if len(coeffs) > len(crs.Powers) {
		return nil
	}

	result := big.NewInt(0)
	temp := new(big.Int)

	for i, coeff := range coeffs {
		// result += coeff * α^i
		temp.Mul(coeff, crs.Powers[i])
		temp.Mod(temp, crs.P)
		result.Add(result, temp)
		result.Mod(result, crs.P)
	}

	return result
}
