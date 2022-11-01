<script setup>
import { useStore } from 'vuex'

const store = useStore()

defineProps({
  showFog: Boolean,
  mapRegionActive: String,
})

const emit = defineEmits(['handle-hover-map-region', 'handle-click-label', 'handle-click-about'])
</script>

<template>
  <div id="World" class="discovered" :class="{ 'no-fog': !showFog }">
    <!-- fog -->
    <div id="World__Fog">
      <div id="World__Fog__Layer-1" class="fog"><img src="/assets/images/beta/i/kote-fog-1.png" /></div>
      <div id="World__Fog__Layer-2" class="fog"><img src="/assets/images/beta/i/kote-fog-2.png" /></div>
    </div>
    <!-- map -->
    <div id="World__Map" :class="{ iso: mapRegionActive !== '' }">
      <!-- zone labels -->
      <div id="World__Map__Labels">
        <button
          id="Town-Label"
          class="btn"
          @mouseenter="() => emit('handle-hover-map-region', 'town')"
          @mouseleave="() => emit('handle-hover-map-region', '')"
          @click="() => emit('handle-click-label', 'town/send')"
        >
          Town
        </button>
        <button
          id="Jeweler-Label"
          class="btn"
          @mouseenter="() => emit('handle-hover-map-region', 'jeweler')"
          @mouseleave="() => emit('handle-hover-map-region', '')"
          @click="() => emit('handle-click-label', 'jeweler/send')"
        >
          Jeweler
        </button>
        <button
          id="Blacksmith-Label"
          class="btn"
          @mouseenter="() => emit('handle-hover-map-region', 'blacksmith')"
          @mouseleave="() => emit('handle-hover-map-region', '')"
          @click="() => emit('handle-click-label', 'blacksmith/send')"
        >
          Blacksmith
        </button>
        <button
          id="Alchemist-Label"
          class="btn"
          @mouseenter="() => emit('handle-hover-map-region', 'alchemist')"
          @mouseleave="() => emit('handle-hover-map-region', '')"
          @click="() => emit('handle-click-label', 'alchemist/send')"
        >
          Alchemist
        </button>
        <button
          id="Forest-Label"
          class="btn quest"
          @mouseenter="() => emit('handle-hover-map-region', 'forest')"
          @mouseleave="() => emit('handle-hover-map-region', '')"
          @click="() => emit('handle-click-label', 'forest/send')"
        >
          Forest
        </button>
        <button id="Forest-Label-About" class="btn-about quest-about" @click="() => emit('handle-click-about', 'forest')"></button>
        <button
          id="Temple-Label"
          class="btn"
          :class="{ quest: store.state.user.approveWorship }"
          @mouseenter="() => emit('handle-hover-map-region', 'temple')"
          @mouseleave="() => emit('handle-hover-map-region', '')"
          @click="
            () => {
              if (store.state.user.approveTemple) emit('handle-click-label', 'temple/send')
            }
          "
        >
          Temple
        </button>
        <button id="Temple-Label-About" class="btn-about quest-about" @click="() => emit('handle-click-about', 'temple')"></button>
        <button
          id="Mountain-Label"
          class="btn quest"
          @mouseenter="() => emit('handle-hover-map-region', 'mountain')"
          @mouseleave="() => emit('handle-hover-map-region', '')"
          @click="() => emit('handle-click-label', 'mountain/send')"
        >
          Mountain
        </button>
        <button id="Mountain-Label-About" class="btn-about quest-about" @click="() => emit('handle-click-about', 'mountain')"></button>
        <button
          id="Cavern-Label"
          class="btn quest"
          @mouseenter="() => emit('handle-hover-map-region', 'cavern')"
          @mouseleave="() => emit('handle-hover-map-region', '')"
          @click="() => emit('handle-click-label', 'cavern/send')"
        >
          Cavern
        </button>
        <button id="Cavern-Label-About" class="btn-about quest-about" @click="() => emit('handle-click-about', 'cavern')"></button>
      </div>
      <!-- zone regions -->
      <div id="World__Map__Regions">
        <div id="Alchemist" class="map-region" :class="{ active: mapRegionActive === 'alchemist' }">
          <img src="/assets/images/beta/i/kote-map-alchemist-hovered.png" />
        </div>
        <div id="Temple" class="map-region" :class="{ active: mapRegionActive === 'temple' }">
          <img src="/assets/images/beta/i/kote-map-altar-hovered.png" />
        </div>
        <div id="Blacksmith" class="map-region" :class="{ active: mapRegionActive === 'blacksmith' }">
          <img src="/assets/images/beta/i/kote-map-blacksmiths-hovered.png" />
        </div>
        <div id="Cavern" class="map-region" :class="{ active: mapRegionActive === 'cavern' }">
          <img src="/assets/images/beta/i/kote-map-cavern-hovered.png" />
        </div>
        <div id="Forest" class="map-region" :class="{ active: mapRegionActive === 'forest' }">
          <img src="/assets/images/beta/i/kote-map-forest-hovered.png" />
        </div>
        <div id="Jeweler" class="map-region" :class="{ active: mapRegionActive === 'jeweler' }">
          <img src="/assets/images/beta/i/kote-map-jewelers-hovered.png" />
        </div>
        <div id="Mountain" class="map-region" :class="{ active: mapRegionActive === 'mountain' }">
          <img src="/assets/images/beta/i/kote-map-mountain-hovered.png" />
        </div>
        <div id="Town" class="map-region" :class="{ active: mapRegionActive === 'town' }">
          <img src="/assets/images/beta/i/kote-map-town-hovered.png" />
        </div>
      </div>
    </div>

    <div class="Audio-Toggle-Name"><i>Music by Premes</i></div>
    <button id="Audio-Toggle" onclick="play()">
      <img src="/assets/images/beta/i/kote-icon-sound.png" />
    </button>
    <audio id="Audio-Play" autoplay loop src="https://knightsoftheether.com/tnet-main/music/atmo2_1.mp3"></audio>
  </div>
</template>
