function showBaseCurve() {
    const ggbApi = document.ggbApplet;
    // 清除之前的内容
    ggbApi.reset();
    
    // 设置视图范围
    ggbApi.setCoordSystem(-5, 5, -5, 5);
    
    // 绘制 secp256k1 曲线: y² = x³ + 7
    ggbApi.evalCommand("f(x) = sqrt(x^3 + 7)");
    ggbApi.evalCommand("g(x) = -sqrt(x^3 + 7)");
    
    // 设置曲线颜色和样式
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