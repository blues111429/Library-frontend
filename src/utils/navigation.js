import { useRouter } from "vue-router";

export function useNavigation() {
    const router = useRouter();

    const toHome = () => router.push('/');
    const toLogin = () => router.push('/login');
    const toRegister = () => router.push('/register');
    const toUserInfo = () => router.push('/userInfo');

    return {
        toHome,
        toLogin,
        toRegister,
        toUserInfo,
    }
}