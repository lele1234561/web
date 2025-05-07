class BouncingDot {
    constructor(element, container) {
        this.element = element;
        this.container = container;
        this.width = element.offsetWidth;
        this.height = element.offsetHeight;
        this.radius = this.height / 2;

        // 确保初始位置在椭圆区域内
        do {
            this.x = Math.random() * (container.offsetWidth - this.width);
            this.y = Math.random() * (container.offsetHeight - this.height);
        } while (!this.isPositionValid(this.x, this.y));

        // 初始速度增加
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 2; // 增加初始速度
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.restitution = 0.8; // 增加弹性系数
        this.minSpeed = 3; // 设置最小速度

        this.updatePosition();
    }

    isPositionValid(x, y) {
        const centerX = x + this.width / 2;
        const centerY = y + this.height / 2;
        return this.isPointInAnyEllipse(centerX, centerY);
    }

    updatePosition() {
        // 在更新位置之前检查新位置是否有效
        let newX = this.x + this.vx;
        let newY = this.y + this.vy;
        
        // 如果新位置在区域外，立即进行碰撞检测和反弹
        if (!this.isPositionValid(newX, newY)) {
            this.checkBoundaryCollision();
            // 重新计算新位置
            newX = this.x + this.vx;
            newY = this.y + this.vy;
        }

        this.x = newX;
        this.y = newY;
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    isPointInAnyEllipse(x, y) {
        const ellipses = document.querySelectorAll('.ellipse');
        const point = { x, y };

        for (let ellipse of ellipses) {
            const rect = ellipse.getBoundingClientRect();
            const containerRect = this.container.getBoundingClientRect();
            const ellipseX = rect.left - containerRect.left + rect.width / 2;
            const ellipseY = rect.top - containerRect.top + rect.height / 2;
            const a = rect.width / 2;
            const b = rect.height / 2;

            const relX = point.x - ellipseX;
            const relY = point.y - ellipseY;

            if ((relX * relX) / (a * a) + (relY * relY) / (b * b) <= 1) {
                return true;
            }
        }
        return false;
    }

    checkBoundaryCollision() {
        const points = [];
        const numPoints = 12;
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            // 检测距离
            const checkRadius = this.radius + 5;
            const pointX = centerX + Math.cos(angle) * checkRadius;
            const pointY = centerY + Math.sin(angle) * checkRadius;
            
            if (!this.isPointInAnyEllipse(pointX, pointY)) {
                const normal = this.findClosestBoundaryNormal(pointX, pointY);
                if (normal) {
                    const dot = this.vx * normal.x + this.vy * normal.y;
                    this.vx = (this.vx - 2 * dot * normal.x) * this.restitution;
                    this.vy = (this.vy - 2 * dot * normal.y) * this.restitution;
                    
                    // 确保最小速度并添加额外推力
                    this.ensureMinimumSpeed();
                    
                    // 立即调整位置以确保在区域内
                    this.x -= this.vx;
                    this.y -= this.vy;
                    return true;
                }
            }
        }
        return false;
    }

    ensureMinimumSpeed() {
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed < this.minSpeed) {
            // 添加随机推力
            const angle = Math.random() * Math.PI * 2;
            const boost = this.minSpeed - speed + Math.random();
            this.vx += Math.cos(angle) * boost;
            this.vy += Math.sin(angle) * boost;
        }
    }

    findClosestBoundaryNormal(x, y) {
        const ellipses = document.querySelectorAll('.ellipse');
        let closestDist = Infinity;
        let closestNormal = null;

        ellipses.forEach(ellipse => {
            const rect = ellipse.getBoundingClientRect();
            const containerRect = this.container.getBoundingClientRect();
            const ellipseX = rect.left - containerRect.left + rect.width / 2;
            const ellipseY = rect.top - containerRect.top + rect.height / 2;
            const a = rect.width / 2;
            const b = rect.height / 2;

            const dx = x - ellipseX;
            const dy = y - ellipseY;
            const angle = Math.atan2(dy * a, dx * b);
            
            // 计算椭圆边界上的最近点
            const boundaryX = ellipseX + a * Math.cos(angle);
            const boundaryY = ellipseY + b * Math.sin(angle);
            
            const dist = Math.hypot(x - boundaryX, y - boundaryY);
            if (dist < closestDist) {
                closestDist = dist;
                // 计算法线方向
                closestNormal = {
                    x: (boundaryX - ellipseX) / a,
                    y: (boundaryY - ellipseY) / b
                };
                // 归一化法线向量
                const len = Math.sqrt(closestNormal.x * closestNormal.x + closestNormal.y * closestNormal.y);
                closestNormal.x /= len;
                closestNormal.y /= len;
            }
        });

        return closestNormal;
    }

    checkDotCollision(otherDot) {
        const dx = (this.x + this.width/2) - (otherDot.x + otherDot.width/2);
        const dy = (this.y + this.height/2) - (otherDot.y + otherDot.height/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        // 增加碰撞检测距离
        const minDistance = this.radius + otherDot.radius + 50;

        if (distance < minDistance) {
            const nx = dx / distance;
            const ny = dy / distance;
            const relativeVx = this.vx - otherDot.vx;
            const relativeVy = this.vy - otherDot.vy;
            const vn = relativeVx * nx + relativeVy * ny;

            if (vn < 0) {
                const impulse = -(1 + this.restitution) * vn;
                const impulseX = impulse * nx;
                const impulseY = impulse * ny;

                this.vx += impulseX;
                this.vy += impulseY;
                otherDot.vx -= impulseX;
                otherDot.vy -= impulseY;

                // 分离小球并确保最小速度
                const overlap = minDistance - distance;
                const separationX = (overlap * nx) / 2;
                const separationY = (overlap * ny) / 2;
                this.x += separationX;
                this.y += separationY;
                otherDot.x -= separationX;
                otherDot.y -= separationY;

                // 碰撞后确保两个小球都保持最小速度
                this.ensureMinimumSpeed();
                otherDot.ensureMinimumSpeed();
            }
        }
    }

    update(otherDots) {
        this.updatePosition();

        // 检查与其他小球的碰撞
        otherDots.forEach(dot => {
            if (dot !== this) {
                this.checkDotCollision(dot);
            }
        });
        
        // 限制最大速度
        const maxSpeed = 4;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            const scale = maxSpeed / speed;
            this.vx *= scale;
            this.vy *= scale;
        }

        // 每帧添加小的随机推力
        const randomAngle = Math.random() * Math.PI * 2;
        const randomForce = 0.1;
        this.vx += Math.cos(randomAngle) * randomForce;
        this.vy += Math.sin(randomAngle) * randomForce;

        // 确保最小速度
        this.ensureMinimumSpeed();
    }
}

// 初始化小球
function initDots() {
    const container = document.querySelector('.dots-container');
    const dots = Array.from(document.querySelectorAll('.entrance-dot'));
    const bouncingDots = dots.map(dot => new BouncingDot(dot, container));

    function animate() {
        bouncingDots.forEach(dot => dot.update(bouncingDots));
        requestAnimationFrame(animate);
    }

    animate();
}

// 页面加载完成后初始化
window.addEventListener('load', initDots); 