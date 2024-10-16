<template>
  <div class="plyr-container">
    <audio class="plyr" crossorigin playsinline>
      <source :src="audio" type="audio/mp3" />
    </audio>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import Plyr from 'plyr';

const props = defineProps(['audio']);
const emit = defineEmits(['plyrInit']);

const playerRef = ref(null);
const oldLink = ref(null);

onMounted(async () => {
  await nextTick();
  playerRef.value = new Plyr('.plyr', {});
  emit('plyrInit', playerRef.value);
});

watch(() => props.audio, (newAudioLink) => {
  if (oldLink.value === newAudioLink) return;
  
  oldLink.value = newAudioLink;

  if (playerRef.value) {
    playerRef.value.source = { 
      type: 'audio',
      sources: [
        { src: newAudioLink, type: 'audio/mp3' }
      ],
    };

    playerRef.value.play();
  }
  
});
</script>

<style scoped>
.plyr-container {
  margin-top: 10px;
}
</style>
