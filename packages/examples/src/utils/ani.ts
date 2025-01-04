export default function useAni() {
    const list: { func: () => void; duration: number }[] = [];
    let index = 0, pausing = false;

    const play = () => {
        if (pausing || !list[index]) return;
        const { func, duration } = list?.[index];
        if (!func) {
            return;
        }
        func();
        setTimeout(() => {
            play();
        }, duration);
        index++;

    };

    return {
        push: (func: () => void, duration: number) => {
            list.push({
                func,
                duration,
            })
        },
        play,
    }
}