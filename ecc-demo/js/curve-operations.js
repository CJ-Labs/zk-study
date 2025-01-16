// 定义不同的曲线参数
const CURVES = {
    secp256k1: {
        name: "secp256k1",
        equation: "y² = x³ + 7",
        a: 0,
        b: 7,
        p: "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F",
        description: "比特币和以太坊使用的曲线，Weierstrass形式，特点是计算效率高",
        displayRange: [-5, 5]
    },
    secp256r1: {
        name: "secp256r1 (NIST P-256)",
        equation: "y² = x³ - 3x + 41058363725152142129326129780047268409114441015993725554835256314039467401291",
        a: -3,
        b: "0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B",
        p: "0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF",
        description: "NIST推荐的曲线，广泛用于TLS",
        displayRange: [-5, 5]
    },
    ed25519: {
        name: "Ed25519",
        equation: "-x² + y² = 1 - (121665/121666)x²y²",
        description: "Edwards曲线，用于EdDSA数字签名，特点是实现简单且安全",
        displayRange: [-3, 3]
    },
    curve25519: {
        name: "Curve25519",
        equation: "y² = x³ + 486662x² + x",
        description: "Montgomery曲线，用于密钥交换，特点是计算效率高",
        displayRange: [-5, 5]
    },
    bls12_381: {
        name: "BLS12-381",
        equation: "y² = x³ + 4",
        description: "配对友好曲线，用于零知识证明和聚合签名",
        displayRange: [-3, 3]
    },
    bn254: {
        name: "BN254",
        equation: "y² = x³ + 3",
        a: 0,
        b: 3,
        p: "0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47",
        description: "Barreto-Naehrig曲线，广泛用于零知识证明系统（如zk-SNARKs），支持配对运算",
        displayRange: [-4, 4],
        order: "0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001"
    }
};

let currentCurve = CURVES.secp256k1;

function changeCurve() {
    const selectedCurve = document.getElementById('curveSelect').value;
    currentCurve = CURVES[selectedCurve];
    updateCurveInfo();
    showBaseCurve();
}

function updateCurveInfo() {
    const curveInfo = document.getElementById('curveInfo');
    curveInfo.innerHTML = `
        <p>方程：${currentCurve.equation}</p>
        <p>${currentCurve.description}</p>
    `;
}

function showBaseCurve() {
    const ggbApi = document.ggbApplet;
    ggbApi.reset();
    
    // 设置视图范围
    const range = currentCurve.displayRange;
    ggbApi.setCoordSystem(range[0], range[1], range[0], range[1]);
    
    // 根据不同曲线类型绘制
    switch(currentCurve.name) {
        case "Ed25519":
            // Edwards 曲线
            ggbApi.evalCommand("curve: -x² + y² = 1 - (121665/121666)x²y²");
            break;
        case "Curve25519":
            // Montgomery 曲线
            ggbApi.evalCommand("f(x) = sqrt(x³ + 486662x² + x)");
            ggbApi.evalCommand("g(x) = -sqrt(x³ + 486662x² + x)");
            break;
        default:
            // Weierstrass 形式
            const equation = currentCurve.equation.split("=")[1];
            ggbApi.evalCommand(`f(x) = sqrt(${equation})`);
            ggbApi.evalCommand(`g(x) = -sqrt(${equation})`);
    }
    
    // 设置曲线样式
    ggbApi.setLineStyle("f", 1);
    ggbApi.setLineThickness("f", 2);
    ggbApi.setLineStyle("g", 1);
    ggbApi.setLineThickness("g", 2);
}

function demonstrateAddition() {
    const ggbApi = document.ggbApplet;
    // 清除之前的内容
    ggbApi.reset();
    showBaseCurve();

    // 创建第一个点并添加动画效果
    ggbApi.evalCommand("P = (1, f(1))");
    ggbApi.setPointSize("P", 5);
    ggbApi.setColor("P", 255, 0, 0);
    ggbApi.setLabelVisible("P", true);
    ggbApi.setAnimating("P", true);
    ggbApi.startAnimation();

    // 2秒后创建第二个点
    setTimeout(() => {
        ggbApi.evalCommand("Q = (2, f(2))");
        ggbApi.setPointSize("Q", 5);
        ggbApi.setColor("Q", 0, 0, 255);
        ggbApi.setLabelVisible("Q", true);
        ggbApi.setAnimating("Q", true);
        
        // 2秒后绘制连线，使用动画
        setTimeout(() => {
            // 绘制连线
            ggbApi.evalCommand("l: Line(P, Q)");
            ggbApi.setLineStyle("l", 2); // 虚线样式
            ggbApi.setLineThickness("l", 2);
            
            // 创建曲线对象
            ggbApi.evalCommand("c1: y = f(x)");
            ggbApi.evalCommand("c2: y = g(x)");
            
            // 2秒后找交点
            setTimeout(() => {
                // 尝试找交点
                ggbApi.evalCommand("R = Intersect(l, c1)");
                if (!ggbApi.exists("R")) {
                    ggbApi.evalCommand("R = Intersect(l, c2)");
                }
                
                if (ggbApi.exists("R")) {
                    ggbApi.setPointSize("R", 3);
                    ggbApi.setColor("R", 128, 128, 128);
                    ggbApi.setLabelVisible("R", true);
                }
                
                // 2秒后创建结果点
                setTimeout(() => {
                    if (ggbApi.exists("R")) {
                        let Rx = ggbApi.getXcoord("R");
                        let Ry = ggbApi.getYcoord("R");
                        
                        // 创建一个动画点，从R移动到最终位置
                        ggbApi.evalCommand(`S = (${Rx}, ${-Ry})`);
                        ggbApi.setPointSize("S", 5);
                        ggbApi.setColor("S", 0, 255, 0);
                        ggbApi.setLabelVisible("S", true);
                        ggbApi.setCaption("S", "P + Q");
                        
                        // 添加辅助线显示反射过程
                        ggbApi.evalCommand(`v: Line((${Rx},${Ry}), (${Rx},${-Ry}))`);
                        ggbApi.setLineStyle("v", 2);
                        ggbApi.setLineThickness("v", 1);
                    }
                }, 2000);
            }, 2000);
        }, 2000);
    }, 2000);
}

function demonstrateMultiplication() {
    const ggbApi = document.ggbApplet;
    ggbApi.reset();
    showBaseCurve();

    // 创建基点 P 并添加动画
    ggbApi.evalCommand("P = (1, f(1))");
    ggbApi.setPointSize("P", 5);
    ggbApi.setColor("P", 255, 0, 0);
    ggbApi.setLabelVisible("P", true);
    ggbApi.setAnimating("P", true);
    
    // 2秒后开始切线计算
    setTimeout(() => {
        let x = 1;
        let y = Math.sqrt(Math.pow(x, 3) + 7);
        let m = (3 * x * x) / (2 * y);
        
        // 创建切线，使用动画效果
        ggbApi.evalCommand(`l: y - ${y} = ${m}(x - ${x})`);
        ggbApi.setLineStyle("l", 2);
        ggbApi.setLineThickness("l", 2);
        
        // 2秒后找交点
        setTimeout(() => {
            ggbApi.evalCommand("c1: y = f(x)");
            ggbApi.evalCommand("c2: y = g(x)");
            
            ggbApi.evalCommand("R = Intersect(l, c1)");
            if (!ggbApi.exists("R")) {
                ggbApi.evalCommand("R = Intersect(l, c2)");
            }
            
            if (ggbApi.exists("R")) {
                ggbApi.setPointSize("R", 3);
                ggbApi.setColor("R", 128, 128, 128);
                ggbApi.setLabelVisible("R", true);
            }
            
            // 2秒后创建结果点
            setTimeout(() => {
                if (ggbApi.exists("R")) {
                    let Rx = ggbApi.getXcoord("R");
                    let Ry = ggbApi.getYcoord("R");
                    
                    // 添加反射线
                    ggbApi.evalCommand(`v: Line((${Rx},${Ry}), (${Rx},${-Ry}))`);
                    ggbApi.setLineStyle("v", 2);
                    ggbApi.setLineThickness("v", 1);
                    
                    // 创建结果点
                    ggbApi.evalCommand(`Q = (${Rx}, ${-Ry})`);
                    ggbApi.setPointSize("Q", 5);
                    ggbApi.setColor("Q", 0, 255, 0);
                    ggbApi.setLabelVisible("Q", true);
                    ggbApi.setCaption("Q", "2P");
                }
            }, 2000);
        }, 2000);
    }, 2000);
}

function showModularCurve() {
    const ggbApi = document.ggbApplet;
    // 清除之前的内容
    ggbApi.reset();
    
    // 设置较小的模数以便演示
    const p = 17;
    ggbApi.setCoordSystem(-1, p + 1, -1, p + 1);
    ggbApi.setGridVisible(true);
    
    // 计算并显示有限域中的点
    for(let x = 0; x < p; x++) {
        let y_squared = (x * x * x + 7) % p;
        for(let y = 0; y < p; y++) {
            if((y * y) % p === y_squared) {
                ggbApi.evalCommand(`A${x}_${y}=(${x},${y})`);
                ggbApi.setPointSize(`A${x}_${y}`, 5);
                ggbApi.setColor(`A${x}_${y}`, 255, 0, 0);
            }
        }
    }
} 