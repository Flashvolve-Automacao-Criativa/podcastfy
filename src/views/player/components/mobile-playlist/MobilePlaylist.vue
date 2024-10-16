<template>
    <n-drawer :width="345">
        <n-button circle size="large" class="close-button" @click="emit('close')">
            <i class="fa fa-times"></i>
        </n-button>
        
        <n-list class="playlist-container">
            <n-list-item 
            v-for="(track, index) in props.tracks"
            :key="index"
            class="track-item"
            @click="() => emit('playTrack', track, index)"
            >
            <n-space align="center" class="track-content">
                <n-space class="track-info" justify="space-between">
                    <n-space vertical align="center">
                        <n-image :src="track.cover" alt="Cover" class="track-cover" />
                        <n-text class="track-duration">{{ formatTime(track.duration) }}</n-text>
                    </n-space>
                    
                    <n-space vertical>
                        <n-text class="track-title">{{ track.title }}</n-text>
                        <n-text class="track-artist">{{ track.artist }}</n-text>
                    </n-space>
                </n-space>
            </n-space>
        </n-list-item>
    </n-list>
</n-drawer>
</template>

<script setup>
const props = defineProps({
    tracks: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits([ 'close' ]);

const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    const formattedTime = `${minutes}:${seconds}`;
    
    return formattedTime;
};
</script>

<style scoped>
.close-button {
    margin: 8px 8px 0 0;
    float: right
}

.playlist-container {
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    margin-top: 50px;
}

.playing-track {
    background-color: #d3e4ff;
}

.track-cover-info {
    display: flex;
}

.track-content {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.5rem;
    justify-content: space-between !important;
}

.track-cover {
    width: 50px;
    height: 50px;
    object-fit: cover;
    margin-right: 10px;
    border-radius: 4px;
}

.track-info {
    flex-flow: row nowrap !important;
    margin: 8px;
}

.track-title {
    font-size: 16px;
    font-weight: bold;
}

.track-artist {
    font-size: 14px;
    color: #777;
}

.track-duration {
    font-size: 14px;
    color: #777;
    margin-right: 15px;
}
</style>