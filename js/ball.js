class Ball {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'ball';
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        
        // 修改速度设置，使垂直速度更大，产生明显的弹跳效果
        this.speedX = (Math.random() - 0.5) * 2;  // 降低水平速度
        this.speedY = -Math.random() * 8 - 4;  // 初始向上的速度
        this.gravity = 0.2;  // 添加重力效果
        this.bounce = -0.7;  // 弹跳系数
        
        this.size = Math.random() * 30 + 5;  // 稍微调小球体大小
        
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        
        // 创建白色半透明小球，带发光效果
        const opacity = Math.random() * 0.5 + 0.1;
        this.element.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
        this.element.style.boxShadow = `0 0 ${this.size/2}px rgba(255, 255, 255, ${opacity})`;
        this.element.style.position = 'absolute';
        this.element.style.borderRadius = '50%';
        
        // 添加模糊效果
        this.element.style.filter = `blur(${this.size/15}px)`;
        this.element.style.transition = 'transform 0.05s linear'; // 减小过渡时间使运动更流畅
        
        document.querySelector('.ball-container').appendChild(this.element);
        
        // 初始化动画属性
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 2;
    }

    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        // 应用重力
        this.speedY += this.gravity;
        
        // 更新位置
        this.x += this.speedX;
        this.y += this.speedY;

        // 边界碰撞检测
        if (this.x <= 0 || this.x >= window.innerWidth - this.size) {
            this.speedX *= -0.9; // 水平方向有轻微的能量损失
            if (this.x <= 0) this.x = 0;
            if (this.x >= window.innerWidth - this.size) this.x = window.innerWidth - this.size;
        }
        
        // 垂直方向的弹跳
        if (this.y >= window.innerHeight - this.size) {
            this.y = window.innerHeight - this.size;
            this.speedY *= this.bounce;
            
            // 添加随机水平速度变化，使弹跳更自然
            this.speedX += (Math.random() - 0.5) * 1;
            
            // 创建弹跳效果
            this.createRippleEffect();
        }
        
        // 当球体几乎停止时，给予新的向上的推力
        if (Math.abs(this.speedY) < 0.5 && this.y > window.innerHeight - this.size - 1) {
            this.speedY = -Math.random() * 8 - 4; // 随机新的向上速度
        }

        // 更新旋转 - 根据运动速度调整旋转
        this.rotation += this.speedX * 2;

        // 应用变换
        this.element.style.transform = `
            translate(${this.x}px, ${this.y}px)
            rotate(${this.rotation}deg)
        `;
    }

    createRippleEffect() {
        // 弹跳时的形变效果
        this.element.style.transform += ' scaleX(1.2) scaleY(0.8)';
        setTimeout(() => {
            this.element.style.transform = this.element.style.transform.replace(' scaleX(1.2) scaleY(0.8)', '');
        }, 100);
    }
} 