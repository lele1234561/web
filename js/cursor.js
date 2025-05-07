class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursorFollower = document.createElement('div');
        this.pageTransition = document.createElement('div');
        
        this.cursor.className = 'cursor';
        this.cursorFollower.className = 'cursor-follower';
        this.pageTransition.className = 'page-transition';
        
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorFollower);
        document.body.appendChild(this.pageTransition);
        
        // 添加初始位置，避免光标闪烁
        this.cursor.style.transform = 'translate(-100px, -100px)';
        this.cursorFollower.style.transform = 'translate(-100px, -100px)';
        
        // 添加鼠标位置状态
        this.mouseX = -100;
        this.mouseY = -100;
        this.cursorX = -100;
        this.cursorY = -100;
        this.followerX = -100;
        this.followerY = -100;
        
        this.bindEvents();
        this.setupPageTransitions();
        this.animate(); // 添加动画循环

        // 修改图片加载检查
        const img = new Image();
        img.onload = () => {
            console.log('Mouse pointer image loaded successfully');
            // 使用绝对路径
            this.cursor.style.backgroundImage = `url('/images/Mouse pointer.png')`;
        };
        img.onerror = () => {
            console.error('Failed to load Mouse pointer image');
            this.cursor.style.backgroundColor = 'red';
            this.cursor.style.borderRadius = '50%';
        };
        // 使用绝对路径
        img.src = '/images/Mouse pointer.png';
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // 为所有链接添加悬停效果
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
                this.cursorFollower.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
                this.cursorFollower.classList.remove('hover');
            });
        });
        
        // 添加点击效果
        document.addEventListener('mousedown', () => {
            this.cursor.classList.add('clicking');
        });
        
        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('clicking');
        });
    }
    
    setupPageTransitions() {
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('http')) return;
                
                e.preventDefault();
                const target = link.getAttribute('href');
                
                // 播放页面退出动画
                this.pageTransition.classList.add('enter');
                
                setTimeout(() => {
                    window.location.href = target;
                }, 600);
            });
        });
        
        // 页面加载时的进入动画
        window.addEventListener('load', () => {
            this.pageTransition.classList.add('exit');
            setTimeout(() => {
                this.pageTransition.classList.remove('exit');
                this.pageTransition.style.transform = 'translateY(100%)';
            }, 600);
        });
    }
    
    animate() {
        // 简化定位逻辑，直接使用鼠标位置
        this.cursor.style.transform = `translate(${this.mouseX - 16}px, ${this.mouseY - 16}px)`;
        
        requestAnimationFrame(() => this.animate());
    }
} 