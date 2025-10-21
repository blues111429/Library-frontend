<template>
    <transition name="fade-scale">
        <div v-if="visible" class="modal-overlay">
            <div :class="['modal-content', typeClass]">
                <div class="icon-area">
                    <span v-if="typeClass === 'success'">√</span>
                    <span v-else-if="typeClass === 'error'">×</span>
                    <span v-else-if="typeClass === 'warning'">!</span>
                    <span v-else></span>
                </div>
                <div class="text-area">
                    {{ modalMessage }}
                </div>
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

//显示提示

function showModalAndRedirect(message = '正在跳转...', type = 'success', redirectPath = '', duration = 2000) {
    modalMessage.value = message;
    typeClass.value = type;
    visible.value = true;

    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
        visible.value = false;
        if(redirectPath) {
            router.push(redirectPath);
        }
    }, duration);
}

defineExpose({
    showModalAndRedirect
});
</script>

<style lang="scss" scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    backdrop-filter: blur(6px);
    background-color: rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content {
    display: flex;
    align-items: center;
    gap: 18px;
    min-width: 320px;
    padding: 20px 28px;
    border-radius: 16px;
    font-size: 18px;
    font-weight: 500;
    color: #fff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    transform: translateY(-10px);
    background: linear-gradient(135deg, #333, #444);
    transition: all 0.35s ease;
}

.modal-content.success {
    background: linear-gradient(135deg, #3ecf8e, #2ba55d);
    box-shadow: 0 0 20px rgba(46, 204, 113, 0.5);
}
.modal-content.error {
    background: linear-gradient(135deg, #e74c3c, #ff7675);
    box-shadow: 0 0 20px rgba(231, 76, 60, 0.5);
}
.modal-content.warning {
    background: linear-gradient(135deg, #f1c40f, #f7d96e);
    color: #333;
    box-shadow: 0 0 20px rgba(241, 196, 15, 0.5);
}

.icon-area {
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    font-size: 22px;
    font-weight: bold;
    background-color: rgba(255, 255, 255, 0.15);
    color: #fff;
}

.icon.warning {
    background-color: rgba(255, 255, 255, 0.3);
    color: #333;
}

.text-area {
    line-height: 1.5;
    text-align: left;
    flex: 1;
}

/* 动画 */
.fade-scale-enter-active, .fade-scale-leave-active {
    transition: all 0.35s ease;
}
.fade-scale-enter-from, .fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.9);
}
</style>