package merkle

import (
	"bytes"
	"crypto/sha256"
	"errors"
)

// MerkleNode 默克尔树节点
type MerkleNode struct {
	Left  *MerkleNode
	Right *MerkleNode
	Hash  []byte
	Data  []byte
}

// MerkleTree 默克尔树
type MerkleTree struct {
	Root     *MerkleNode
	Leaves   []*MerkleNode
	HashFunc func(data []byte) []byte
}

// NewMerkleTree 创建新的默克尔树
func NewMerkleTree(data [][]byte) (*MerkleTree, error) {
	if len(data) == 0 {
		return nil, errors.New("data cannot be empty")
	}

	// 创建树实例
	tree := &MerkleTree{
		HashFunc: sha256Hash,
	}

	// 创建叶子节点
	for _, datum := range data {
		node := &MerkleNode{
			Hash: tree.HashFunc(datum),
			Data: datum,
		}
		tree.Leaves = append(tree.Leaves, node)
	}

	// 构建树
	root, err := tree.buildTree(tree.Leaves)
	if err != nil {
		return nil, err
	}

	tree.Root = root
	return tree, nil
}

// buildTree 构建默克尔树
func (m *MerkleTree) buildTree(nodes []*MerkleNode) (*MerkleNode, error) {
	if len(nodes) == 0 {
		return nil, errors.New("cannot build tree with no nodes")
	}

	if len(nodes) == 1 {
		return nodes[0], nil
	}

	var parentNodes []*MerkleNode

	// 两两配对构建父节点
	for i := 0; i < len(nodes); i += 2 {
		var left, right *MerkleNode
		left = nodes[i]

		// 如果是奇数个节点，复制最后一个节点
		if i+1 == len(nodes) {
			right = nodes[i]
		} else {
			right = nodes[i+1]
		}

		// 计算父节点哈希
		parentHash := m.HashFunc(append(left.Hash, right.Hash...))
		parent := &MerkleNode{
			Left:  left,
			Right: right,
			Hash:  parentHash,
		}

		parentNodes = append(parentNodes, parent)
	}

	// 递归构建上层节点
	return m.buildTree(parentNodes)
}

// GetProof 获取默克尔证明
func (m *MerkleTree) GetProof(data []byte) ([][]byte, error) {
	// 查找目标叶子节点
	var targetLeaf *MerkleNode
	for _, leaf := range m.Leaves {
		if bytes.Equal(leaf.Data, data) {
			targetLeaf = leaf
			break
		}
	}

	if targetLeaf == nil {
		return nil, errors.New("data not found in tree")
	}

	proof := make([][]byte, 0)
	return m.generateProof(m.Root, targetLeaf.Hash, &proof), nil
}

// generateProof 生成默克尔证明
func (m *MerkleTree) generateProof(node *MerkleNode, targetHash []byte, proof *[][]byte) [][]byte {
	if node == nil {
		return *proof
	}

	// 如果是叶子节点，返回证明
	if node.Left == nil && node.Right == nil {
		return *proof
	}

	// 查找目标哈希所在的分支
	if bytes.Equal(node.Left.Hash, targetHash) {
		*proof = append(*proof, node.Right.Hash)
		return m.generateProof(node.Left, targetHash, proof)
	}

	if bytes.Equal(node.Right.Hash, targetHash) {
		*proof = append(*proof, node.Left.Hash)
		return m.generateProof(node.Right, targetHash, proof)
	}

	// 递归搜索左右子树
	leftProof := m.generateProof(node.Left, targetHash, proof)
	if len(leftProof) > 0 {
		return leftProof
	}

	return m.generateProof(node.Right, targetHash, proof)
}

// VerifyProof 验证默克尔证明
func (m *MerkleTree) VerifyProof(data []byte, proof [][]byte) bool {
	// 计算叶子节点哈希
	currentHash := m.HashFunc(data)

	// 逐步计算根哈希
	for _, proofElement := range proof {
		// 确定证明元素的位置（左或右）
		if bytes.Compare(currentHash, proofElement) < 0 {
			currentHash = m.HashFunc(append(currentHash, proofElement...))
		} else {
			currentHash = m.HashFunc(append(proofElement, currentHash...))
		}
	}

	// 验证计算得到的根哈希是否与树的根哈希相同
	return bytes.Equal(currentHash, m.Root.Hash)
}

// 辅助函数：SHA256哈希
func sha256Hash(data []byte) []byte {
	hash := sha256.Sum256(data)
	return hash[:]
}
