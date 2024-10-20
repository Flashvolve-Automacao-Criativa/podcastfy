
<template>
    <n-space class="main-container">
        <n-space justify="space-between">
            <img 
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
                <n-space class="player-content">
                    <img :src="currentTrack?.cover || 'https://res.cloudinary.com/prime-arte/image/upload/v1729455131/santander/top3wcxdkwopa7kt6gpc.jpg'" alt="Current Cover Podcast" />
                    <PlyrAudio :audio="currentTrack?.src" @plyrInit="initializePlayer" />
                    
                    <n-space class="current-track-info" vertical>
                        <n-text class="title">{{ currentTrack?.title }}</n-text>
                        <n-text class="description">{{ currentTrack?.artist }}</n-text>
                    </n-space>
                </n-space>

                <n-empty v-if="!fetchedTracks.length">
                    <n-text>{{ t('pages.player.empty') }}</n-text>
                </n-empty>
                
            </n-spin>

            
            <n-space class="playlist-content" v-if="!isMobile">
                <Playlist :tracks="fetchedTracks" @playTrack="playTrack" />
            </n-space>
        </n-space>
    </n-space>
    
    <div class="language-switcher">
        <n-dropdown
        :options="languageOptions"
        trigger="click"
        @select="changeLanguage"
        >
        <n-button>
            <img :src="currentFlagUrl" alt="Current Language Flag" class="flag-icon">
        </n-button>
    </n-dropdown>
</div>

<MobilePlaylist 
v-model:show="showMobilePlaylist"
:tracks="fetchedTracks"
@playTrack="playTrack"
@close="handleCloseMobilePlaylist"
/>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

import { useRoute } from 'vue-router';
const route = useRoute();

import router from '../../router';

import Playlist from './components/playlist/Playlist.vue';
import PlyrAudio from './components/plyraudio/PlyrAudio.vue';
import MobilePlaylist from './components/mobile-playlist/MobilePlaylist.vue';

import useListTracks from './hooks/useListTracks';
const { fetchedTracks, fetchTracksByCompanyId, fetchTrackByUid } = useListTracks(); 

const emit = defineEmits([ 'updateLanguage']);

const { locale } = inject('player');

const languages = {
    en: {
        label: 'English',
        flagUrl: 'https://goodies.icons8.com/web/common/header/flags/us.svg',
    },
    pt: {
        label: 'Português',
        flagUrl: 'https://goodies.icons8.com/web/common/header/flags/br.svg',
    },
    // es: {
    //     label: 'Español',
    //     flagUrl: 'https://goodies.icons8.com/web/common/header/flags/es.svg',
    // },
};

const languageOptions = Object.keys(languages).map((key) => ({
    label: languages[key].label,
    key,
}));

const currentFlagUrl = computed(() => {
    return languages[locale.value]?.flagUrl || '';
});

const changeLanguage = (lang) => {
    if (languages[lang]) {
        locale.value = lang;
        emit('updateLanguage', lang);
    } else {
        console.error(`Idioma desconhecido: ${lang}`);
    }
};

const currentCompanyId = ref(6);
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
    await fetchTracksByCompanyId(currentCompanyId.value);
    currentTrack.value = currentUid.value ? await fetchTrackByUid(currentUid.value) : fetchedTracks.value[0];
});
</script>

<style scoped>
.language-switcher {
    position: absolute;
    top: 7.5%;
    left: calc(7% - 55px);
    z-index: 1;
}

.flag-icon {
    width: 20px;
    height: 20px;
}

.main-container {
    align-items: center;
    padding: 6px;
    background-color: #001c7d;
    max-height: 60vh;
    overflow: hidden;
}

.main-container .hamburguer-button {
    display: none;
}

.base-content {
    flex-flow: row nowrap !important;
    align-items: flex-start;
    background-color: #f1f1f1;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.player-content {
    justify-content: center !important;
    align-items: center;
    padding: 20px;
    background-color: #f1f1f1;
    min-height: 10%;
}

.player-content img {
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
}

@media screen and (max-width: 1600px) {
    .language-switcher {
        top: 8%;
    }
    
    .main-container {
        max-height: 80vh;
    }
}

@media screen and (max-width: 768px) {
    .language-switcher {
        top: 8%;
        left: 2%;
    }
    
    .flag-icon {
        width: 18px;
        height: 18px;
    }
    
    .main-container {
        margin: 0;
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