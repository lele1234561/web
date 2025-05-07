// 添加在现有代码前面
function setScaleRatio() {
    const baseWidth = 1920;
    const currentWidth = window.innerWidth;
    const ratio = currentWidth / baseWidth;
    document.documentElement.style.setProperty('--scale-ratio', ratio);
}

// 初始设置
setScaleRatio();

// 监听窗口大小变化
window.addEventListener('resize', setScaleRatio);

// 保留视口高度设置代码
function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// 初始设置
setVH();

// 监听设备方向变化
window.addEventListener('orientationchange', () => {
    setVH();
});

// 保留登录按钮点击事件
document.querySelector('.login-button').addEventListener('click', () => {
    const button = document.querySelector('.login-button');
    button.style.transform = 'scale(0.9) rotate(0deg)';
    
    setTimeout(() => {
        window.location.href = 'pages/login.html?from=home';
    }, 200);
});

// 简化中心图标容器的点击事件
document.querySelector('.main-icon-container').addEventListener('click', function() {
    window.location.href = 'pages/menu.html';
});

// 添加菜单按钮点击事件
document.querySelector('.menu-button').addEventListener('click', function() {
    window.location.href = 'pages/menu.html';
}); 