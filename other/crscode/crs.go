package crs

import (
	"crypto/rand"
	"math/big"
)

type CRS struct {
	G1     *big.Int
	G2     *big.Int
	P      *big.Int
	Powers []*big.Int
	alpha  *big.Int // 这个随机数需要被安全销毁
}

// Setup 初始化CRS
func Setup(degree int) (*CRS, error) {
	p, err := rand.Prime(rand.Reader, 2048)
	if err != nil {
		return nil, err
	}

	g1, err := rand.Int(rand.Reader, p)
	if err != nil {
		return nil, err
	}

	g2, err := rand.Int(rand.Reader, p)
	if err != nil {
		return nil, err
	}

	alpha, err := rand.Int(rand.Reader, p)
	if err != nil {
		return nil, err
	}

	crs := &CRS{
		G1:    g1,
		G2:    g2,
		P:     p,
		alpha: alpha,
	}

	// 生成幂次序列
	crs.generatePowers(degree)

	// 安全销毁alpha
	crs.destroyAlpha()

	return crs, nil
}

// destroyAlpha 安全销毁随机数alpha
func (crs *CRS) destroyAlpha() {
	if crs.alpha != nil {
		// 1. 先用随机数覆盖
		random, _ := rand.Int(rand.Reader, crs.P)
		crs.alpha.Set(random)

		// 2. 用0覆盖
		crs.alpha.SetInt64(0)

		// 3. 释放内存
		crs.alpha = nil
	}
}

// IsAlphaDestroyed 检查alpha是否已被销毁
func (crs *CRS) IsAlphaDestroyed() bool {
	return crs.alpha == nil
}
