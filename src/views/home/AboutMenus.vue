<script setup>
defineProps({
  aboutMenuActiveStatus: String,
})

const emit = defineEmits(['handle-click-close-menu'])
</script>

<template>
  <div id="Forest-About" class="menu quest-menu" :class="{ 'menu-active': aboutMenuActiveStatus === 'forest' }">
    <header class="menu-header-about">
      <button id="Close-Forest-Send" class="close-menu" @click="() => emit('handle-click-close-menu')" style="margin-top: 12px"></button>
      <div class="menu-label">About Forest</div>
      <br />
      <p class="menu-description">
        Ilithane Forest is where Squires dig up $FIEF.<br /><br />At every other quest destination you are guaranteed at least 20 $FIEF but in the
        Forest you have a chance to find somewhere between 30 and 100 $FIEF per Squire at base strength levels.
      </p>
      <br />
      <p class="menu-description">At 10 strength, increase base $FIEF rewards by 30.*</p>
      <p class="menu-description">At 20 strength, increase base $FIEF rewards by 60.*</p>
      <p class="menu-description">At 50 strength, increase base $FIEF rewards by 150.*</p>
      <p class="menu-description">At 100 strength, increase base $FIEF rewards by 400.*</p>
      <br />
      <p class="menu-description">
        <i>*all upgrades are for forest gameplay only</i>
      </p>
      <br />
    </header>
  </div>

  <div id="Cavern-About" class="menu quest-menu" :class="{ 'menu-active': aboutMenuActiveStatus === 'cavern' }">
    <header class="menu-header-about">
      <button id="Close-Cavern-Send" class="close-menu" @click="() => emit('handle-click-close-menu')" style="margin-top: 12px"></button>
      <div class="menu-label">About Cavern</div>
      <br />
      <p class="menu-description">Delvheim Cavern is where Squires have a good chance to find a Potion and a smaller chance to find a Ring.</p>
      <br />
      <p class="menu-description"><b>Luck less than 10:</b></p>
      <p class="menu-description">28% chance for Potion and 5% chance for Ring</p>
      <p class="menu-description"><b>Luck 10 to 19:</b></p>
      <p class="menu-description">28% chance for Potion and 5% chance for Ring</p>
      <p class="menu-description"><b>Luck 20 to 49:</b></p>
      <p class="menu-description">38% chance for Potion and 9% chance for Ring</p>
      <p class="menu-description"><b>Luck 50 to 99:</b></p>
      <p class="menu-description">49% chance for Potion and 15% chance for Ring</p>
      <p class="menu-description"><b>Luck at 100:</b></p>
      <p class="menu-description">55% chance for Potion and 25% chance for Ring</p>
      <br />
      <p class="menu-description">
        <i>*all upgrades are for cavern gameplay only</i>
      </p>
      <br />
    </header>
  </div>

  <div id="Mountain-About" class="menu quest-menu" :class="{ 'menu-active': aboutMenuActiveStatus === 'mountain' }">
    <header class="menu-header-about">
      <button id="Close-Mountain-Send" class="close-menu" @click="() => emit('handle-click-close-menu')" style="margin-top: 12px"></button>
      <div class="menu-label">About Mountain</div>
      <br />
      <p class="menu-description">Crestfall Mountain is where Squires have a good chance to find a Ring and a smaller chance to find a Trinket.</p>
      <br />
      <p class="menu-description"><b>Luck less than 10:</b></p>
      <p class="menu-description">25% chance for Ring and 6% chance for Trinket</p>
      <p class="menu-description"><b>Luck 10 to 19:</b></p>
      <p class="menu-description">29% chance for Ring and 8% chance for Trinket</p>
      <p class="menu-description"><b>Luck 20 to 49:</b></p>
      <p class="menu-description">33% chance for Ring and 10% chance for Trinket</p>
      <p class="menu-description"><b>Luck 50 to 99:</b></p>
      <p class="menu-description">35% chance for Ring and 15% chance for Trinket</p>
      <p class="menu-description"><b>Luck at 100:</b></p>
      <p class="menu-description">42.5% chance for Ring and 22.5% chance for Trinket</p>
      <br />
      <p class="menu-description">
        <i>*all upgrades are for mountain gameplay only</i>
      </p>
      <br />
    </header>
  </div>

  <div id="Temple-About" class="menu quest-menu" :class="{ 'menu-active': aboutMenuActiveStatus === 'temple' }">
    <header class="menu-header-about">
      <button id="Close-Temple-Send" class="close-menu" @click="() => emit('handle-click-close-menu')" style="margin-top: 12px"></button>
      <div class="menu-label">About Temple</div>
      <br />
      <p class="menu-description">
        The Temple is where Squires have a higher chance to level up 1 of their 4 skills.<br /><br />Each other quest has a small chance for skill
        upgrades, but at The Temple you are much more likely to get a skill upgrade.
      </p>
      <br />
      <p class="menu-description"><b>Faith less than 10:</b></p>
      <p class="menu-description">40% chance for +1 stat and 1% chance for +2 stats</p>
      <p class="menu-description"><b>Faith 10 to 19:</b></p>
      <p class="menu-description">60% chance for +1 stat and 3% chance for +2 stats</p>
      <p class="menu-description"><b>Faith 20 to 49:</b></p>
      <p class="menu-description">80% chance for +1 stat and 5% chance for +2 stats</p>
      <p class="menu-description"><b>Faith 50 to 99:</b></p>
      <p class="menu-description">90% chance for +1 stat and 7% chance for +2 stats</p>
      <p class="menu-description"><b>Faith at 100:</b></p>
      <p class="menu-description">80% chance for +1 stat and 20% chance for +2 stats/p> <br /></p>

      <p class="menu-description">
        <i>*all upgrades are for temple gameplay only</i>
      </p>
      <br />
    </header>
  </div>
</template>
