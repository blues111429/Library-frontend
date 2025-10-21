<template>
    <transition name="fade-scale">
        <div v-if="visible" class="modal-overlay">
            <div :class="['modal-card', typeClass]">
                <div class="icon-area">
                    <div class="icon">
                        <span v-if="typeClass === 'success'">√</span>
                        <span v-else-if="typeClass === 'error'">×</span>
                        <span v-else-if="typeClass === 'warning'">!</span>
                        <span v-else>ℹ</span>
                    </div>
                </div>
                <div class="text-area">{{ modalMessage }}</div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const visible = ref(false);
const modalMessage = ref('');
const typeClass = ref('success');
const router = useRouter();

let timer = null;

// 显示提示 + 跳转
function showModalAndRedirect(message = '正在跳转...', type = 'success', redirectPath = '', duration = 2000) {
    modalMessage.value = message;
    typeClass.value = type;
    visible.value = true;

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
        visible.value = false;
        if (redirectPath) router.push(redirectPath);
    }, duration);
}

defineExpose({
    showModalAndRedirect
});
</script>

<style lang="scss" scoped>
/* 半透明背景（模糊 + 柔光） */
.modal-overlay {
    position: fixed;
    inset: 0;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

/* 中间提示卡片 */
.modal-card {
    display: flex;
    align-items: center;
    gap: 18px;
    min-width: 340px;
    padding: 24px 30px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(4px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    font-size: 18px;
    font-weight: 500;
    color: #333;
    animation: popIn 0.3s ease;
}

/* 图标部分 */
.icon-area {
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-size: 24px;
    font-weight: bold;
    color: #fff;
}

/* 不同提示类型的渐变样式 */
.modal-card.success .icon {
    background: linear-gradient(135deg, #48bb78, #38a169);
    box-shadow: 0 0 10px rgba(56, 161, 105, 0.4);
}

.modal-card.error .icon {
    background: linear-gradient(135deg, #f56565, #e53e3e);
    box-shadow: 0 0 10px rgba(229, 62, 62, 0.4);
}

.modal-card.warning .icon {
    background: linear-gradient(135deg, #f6e05e, #ecc94b);
    color: #333;
    box-shadow: 0 0 10px rgba(236, 201, 75, 0.4);
}

/* 提示文字 */
.text-area {
    flex: 1;
    font-size: 17px;
    color: #2d3748;
    text-align: left;
    line-height: 1.5;
}

/* 弹出动画 */
.fade-scale-enter-active, .fade-scale-leave-active {
    transition: all 0.35s ease;
}
.fade-scale-enter-from, .fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

/* 卡片进入动画 */
@keyframes popIn {
    from {
        opacity: 0;
        transform: translateY(-15px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
</style>
