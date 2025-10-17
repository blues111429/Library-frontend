<template>
    <transition name="toast-fade-slide">
        <div v-if="visible" :class="['toast', typeClass]">
            <span class="icon">
                <template v-if="typeClass === 'success'">√</template>
                <template v-else-if="typeClass === 'error'">×</template>
                <template v-else-if="typeClass === 'warning'">!</template>
            </span>
            <span class="message">{{ message }}</span>
        </div>
    </transition>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);
const message = ref('');
const typeClass = ref('success');
let timer = null;

// 显示Toast
function showToast(msg, type = 'success', duration = 2000) {
    message.value = msg;
    typeClass.value = type;
    visible.value = true;

    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
        visible.value = false;
    }, duration);
}

defineExpose({ showToast });
</script>

<style lang="scss" scoped>
.toast {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 240px;
    padding: 12px 18px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
    font-weight: 500;
    color: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
}

.toast.success { background-color: #28a745; }
.toast.error { background-color: #dc3545; }
.toast.warning { background-color: #f0ad4e; color: #333; }

.icon {
    font-size: 18px;
    font-weight: bold;
}

.message {
    flex: 1;
}

/* 动画 */
.toast-fade-slide-enter-active, 
.toast-fade-slide-leave-active {
    transition: all 0.3s ease;
}
.toast-fade-slide-enter-from {
    opacity: 0;
    transform: translate(-50%, -20px);
}
.toast-fade-slide-leave-to {
    opacity: 0;
    transform: translate(-50%, -20px);
}
</style>