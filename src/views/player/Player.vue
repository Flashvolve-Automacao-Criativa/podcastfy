<template>
    <n-space class="main-container">
        <n-space justify="space-between">
            <n-image 
                src="https://cbmm.com/-/media/cbmm/images/logos/cbmm_logo-white-1.svg?extension=avif%2cwebp"
                alt="Logo da Empresa"
                style="width: 120px"
            />

            <n-button size="medium" circle class="hamburguer-button" @click="showMobilePlaylist = true">
                <i class="fa fa-bars"></i>
            </n-button>
        </n-space>
        
        <n-space class="base-content">
            <n-spin :show="!currentTrack">
                <n-space class="player-content" v-if="currentTrack">
                    <n-image :src="currentTrack.cover" alt="Capa do Podcast" />
                    <PlyrAudio :audio="currentTrack.src" @plyrInit="initializePlayer" />
                    
                    <n-space class="current-track-info" vertical>
                        <n-text class="title">{{ currentTrack.title }}</n-text>
                        <n-text class="description">{{ currentTrack.artist }}</n-text>
                    </n-space>
                </n-space>
            </n-spin>
                        
            <n-space class="playlist-content" v-if="!isMobile">
                <Playlist :tracks="fetchedTracks" @playTrack="playTrack" />
            </n-space>
        </n-space>
    </n-space>

    <MobilePlaylist 
        v-model:show="showMobilePlaylist"
        :tracks="fetchedTracks"
        @playTrack="playTrack"
        @close="handleCloseMobilePlaylist"
    />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';

import { useRoute } from 'vue-router';
const route = useRoute();

import router from '../../router';

import Playlist from './components/playlist/Playlist.vue';
import PlyrAudio from './components/plyraudio/PlyrAudio.vue';
import MobilePlaylist from './components/mobile-playlist/MobilePlaylist.vue';

import useListTracks from './hooks/useListTracks';
const { fetchedTracks, fetchTracks, fetchTrackByUid } = useListTracks(); 

const currentUid = computed(() => route.params?.uid);

const isMobile = computed(() => window.innerWidth <= 768);
const showMobilePlaylist = ref(false);

const currentTrack = ref(null);

const player = ref(null);
const playing = ref(false);
const currentTime = ref(0);
const duration = ref(0);

const initializePlayer = (plyr) => {
    player.value = plyr;
    
    player.value.on('timeupdate', () => {
        currentTime.value = player.value.currentTime;
        duration.value = player.value.duration;
    });

    player.value.on('play', () => playing.value = true);
    player.value.on('pause', () => playing.value = false);
};

const togglePlay = () => playing.value ? player.value.pause() : player.value.play();

const playTrack = (track) => {
    currentTrack.value = track;
    currentUid.value = track.uid;
    
    router.push({
        name: 'Player', // Nome da rota
        params: { uid: track.uid } // Define o uid como parâmetro
    });
}

const previousTrack = () => {
    const currentIndex = fetchedTracks.value.indexOf(currentTrack.value);
    const previousIndex = (currentIndex - 1 + fetchedTracks.value.length) % fetchedTracks.value.length;

    playTrack(fetchedTracks.value[previousIndex]);
};

const nextTrack = () => {
    const currentIndex = fetchedTracks.value.indexOf(currentTrack.value);
    const nextIndex = (currentIndex + 1) % fetchedTracks.value.length;

    playTrack(fetchedTracks.value[nextIndex]);
};

const handleCloseMobilePlaylist = () => showMobilePlaylist.value = false;

onMounted(async () => {
    await fetchTracks();
    currentTrack.value = currentUid.value ? await fetchTrackByUid(currentUid.value) : fetchedTracks.value[0];
});
</script>

<style scoped>
.main-container {
    align-items: center;
    padding: 10px;
    background-color: #001c7d;
    border-radius: 8px;
}

.main-container .hamburguer-button {
    display: none;
}

.base-content {
    flex-flow: row nowrap !important;
    align-items: flex-start;
    background-color: #ffffff;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.player-content {
    justify-content: center !important;
    align-items: center;
    padding: 20px;
    background-color: #f1f1f1;
}

.player-content .n-image {
    border-radius: 4px;
}

.current-track-info {
    text-align: center;
    margin-top: 10px;
    flex-direction: column;
}

.current-track-info .title {
    font-size: 18px;
    font-weight: bold;
}

.current-track-info .description {
    font-size: 16px;
    color: #777;
    margin-bottom: 15px;
}

.playlist-content {
    width: 100%;
    min-width: 300px;
    border-left: 1px solid #f1f1f1;
}

@media screen and (max-width: 768px) {
    .main-container {
        margin: 10px;
    }

    .main-container .hamburguer-button {
        display: flex;
        color: #ffffff;
        position: fixed;
        top: 25px;
        right: 30px;
    }

    .base-content {
        margin-top: 4px;
        flex-flow: column nowrap !important;
    }

    .playlist-content {
        display: none !important;
    }
}
</style>