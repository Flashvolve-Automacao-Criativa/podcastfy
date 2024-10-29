<template>
    <n-spin :show="isLoading">
        <n-space class="uploader-container">
            <n-space class="interaction-container">
                <n-avatar
                    class="logo"
                    size="120"
                    src="https://flashvolve.com/images/logo_automacao_criativa.svg"
                    alt="Logo Autmação Criativa"
                />
                
                <n-typography>
                    <n-h1 class="title-text">Bem vindo à Flash Automação Criativa</n-h1>
                </n-typography>
                
                <n-typography>
                    <n-text class="description-text">
                        Faça o upload da pasta com os arquivos de mídia para iniciar a automação criativa.
                    </n-text>
                </n-typography>
                
                <n-select
                v-if="fetchedArtists.length"
                class="artist-select"
                v-model="currentArtist"
                placeholder="Selecione um artista para começar..."
                :options="fetchedArtists.map(artist => ({ label: artist, value: artist }))"
                @update:value="updateCurrentArtist"
                />
            
                <n-space class="uploader-content" justify="space-between" align="center">
                    <n-upload
                    v-if="!hasUploaded"
                    :multiple="false"
                    :directory="true"
                    :accept="['image/*', 'video/*']"
                    :disabled="!currentArtist"
                    :show-file-list="false"
                    @change="handleUploadChange"
                    >
                        <n-upload-dragger>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
                                        <path stroke-linejoin="round" d="M4.382 8.813v8.5c0 .845.344 1.656.957 2.253a3.3 3.3 0 0 0 2.308.934h8.706c.866 0 1.696-.336 2.308-.934a3.15 3.15 0 0 0 .957-2.253v-8.5m0-5.313H4.382c-.901 0-1.632.714-1.632 1.594v2.125c0 .88.73 1.593 1.632 1.593h15.236c.901 0 1.632-.713 1.632-1.593V5.094c0-.88-.73-1.594-1.632-1.594" />
                                        <path stroke-miterlimit="10" d="M12 12v5"/>
                                        <path stroke-linejoin="round" d="m14.293 14.105l-1.967-1.967a.46.46 0 0 0-.652 0l-1.967 1.967"/>
                                    </g>
                                </svg>
                            </div>
            
                            <n-text style="font-size: 16px">
                                Clique ou arraste e solte a pasta aqui para fazer o upload.
                            </n-text>
                        </n-upload-dragger>

                    </n-upload>

                    <n-space v-else>
                        <n-typography>
                            <n-button class="saver-button" @click="handleRegisterTrackFiles">
                                <n-text>Arquivos enviados com sucesso! Transferir para o banco de dados.</n-text>
                            </n-button>
                        </n-typography>
                    </n-space>
                </n-space>
            </n-space>
        </n-space>
    </n-spin>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

import useListArtists from './hooks/list-artists/useListArtists';
const { fetchedArtists, fetchArtistsByCompanyId } = useListArtists(); 

import useRegisterTrack from './hooks/register-track/useRegisterTrack';
const { registerTrack } = useRegisterTrack(); 

const isLoading = ref(false);
const hasUploaded = ref(false);

const currentCompanyId = ref(6);
const currentArtist = ref(null);
const currentProcessedArtist = ref(null);

const uploadedTracksFiles = ref([]);
const tracksToRegister = ref([]);

const updateCurrentArtist = (artist) => {
    currentArtist.value = artist;
    
    currentProcessedArtist.value = artist
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

const handleRegisterTrackFiles = async () => {
    isLoading.value = true;
    
    const tracksToRegisterWithoutId = tracksToRegister.value
        .filter(track => uploadedTracksFiles.value.some(file => file.id === track.id))
        .map(({ id, ...trackWithoutId }) => trackWithoutId);

    const tracksWithUploadedSrc = await Promise.all(
        tracksToRegisterWithoutId.map(async track => {
            const src = await uploadAudioToCloudnary(track.srcToSave);
            return { ...track, src };
        })
    );

    await Promise.all(tracksWithUploadedSrc.map(track => {
        delete track.srcToSave;
        return registerTrack(track);
    }));

    isLoading.value = false;
}


const getNormalizedPath = (track) => track.fullPath.split('/').slice(0, -1).join('/');

const processTrackVersioning = (tracks) => {
    return Object.values(
        tracks.reduce((acc, track) => {
            const trackPath = getNormalizedPath(track);
            const versionMatch = track.name.match(/_v(\d+)|_V(\d+)/i);
            const version = versionMatch ? parseInt(versionMatch[1] || versionMatch[2], 10) : 0; 
            
            if (!acc[trackPath]) acc[trackPath] = [];
            acc[trackPath].push({ ...track, version });
            return acc;
        }, {})
    ).flatMap(tracks => {
        const versionedTracks = tracks.filter(track => track.name.match(/_v|_V/));
        return versionedTracks.length > 0 ?
            versionedTracks.reduce((prev, curr) => (curr.version > prev.version ? curr : prev)) :
            tracks;
        });
}

const handleUploadChange = async (fileItem) => {
    isLoading.value = true;
    
    try {
        const { file } = fileItem;
        if (file?.type.includes('audio')) {
            
            const processedFilename = file.name
                .replace(/[^a-zA-Z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '')
                .toLowerCase();
            
            if (processedFilename.includes(currentProcessedArtist.value)) {
                uploadedTracksFiles.value.push(file);

                const samePathTracks = uploadedTracksFiles.value.filter(
                    track => getNormalizedPath(track) === getNormalizedPath(file)
                );

                if (samePathTracks.length > 1) uploadedTracksFiles.value = processTrackVersioning(uploadedTracksFiles.value);

                const pathParts = file.fullPath.split('/');
                let folderName = pathParts.find(part => part.startsWith('SEMANA')) || file.name;
                folderName = folderName.replace(/(\d{2})-(\d{2})-(\d{4})/, (match, day, month, year) => `${day}/${month}/${year}`);
                const locale = pathParts.includes('INGLÊS') ? 'en' : 'pt';
                folderName = locale === 'en' ? folderName.replace('SEMANA', 'WEEK') : folderName;

                const trackToRegister = {
                    id: file.id,
                    title: folderName,
                    artist: currentArtist.value,
                    cover: `https://placehold.co/300x300/001c7d/white?text=${folderName}`,
                    company_id: currentCompanyId.value,
                    locale: locale,
                    srcToSave: file.file,
                };
                
                const audioElement = document.createElement('audio');
                audioElement.src = URL.createObjectURL(file.file);
                audioElement.onloadedmetadata = () => {
                    const duration = Math.ceil(audioElement.duration);
                    trackToRegister.duration = duration;
                }
                
                tracksToRegister.value.push(trackToRegister);
                hasUploaded.value = true;
            }
        }
    } catch (error) {
        console.error('Error on handleUploadChange: ', error);
    } finally {
        setTimeout(() => isLoading.value = false, 1000);
    }
}

const uploadAudioToCloudnary = async (fileItem) => {
    const formData = new FormData();
    formData.append('file', fileItem);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

    const { data: cloudUrl } = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`, formData,
        { 
            headers: {
                'Content-Type': 'multipart/form-data',
            } 
        }
    );

    return cloudUrl.secure_url;
}

onMounted(async () => {
    await fetchArtistsByCompanyId(currentCompanyId.value);
});
</script>

<style scoped>
.uploader-container {
    flex-flow: nowrap !important;
    margin: 32px;
    padding: 16px;
    background-color: #ffffff;
    border-radius: 8px;
}

.interaction-container {
    flex-flow: column !important;
    justify-content: center !important;
    align-items: center !important;
}

.logo {
    background-color: transparent;
}

.title-text {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
}

.description-text {
    font-size: 16px;
    font-weight: 500;
    color: #666;
}

.artist-select {
    min-width: 300px;
    margin-top: 16px;
}

.uploader-content {
    padding: 16px;
    border-radius: 8px;
}

.saver-button {
    background-color: #f1f1f1;
    border: 1px solid #9688f2;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 16px;
    font-weight: 500;
    color: #9688f2;
    transition: background-color 0.3s, color 0.3s;
}

.saver-button:hover {
    background-color: #9688f2;
    color: #f1f1f1;
}
</style>