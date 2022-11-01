<template>
  <div class="loader" id="loading"><span id="white"></span></div>
  <div class="loader-logo" id="logo-loading" style="z-index: 999999">
    <img src="/assets/images/unnamed.png" style="width: 150px; height: 150px" alt="Loader" />
  </div>
</template>

<script>
export default {
  name: 'LoaderComponent',
}
</script>

<style>
.loader-logo {
  position: absolute;
  width: 150px;
  height: 150px;
  top: 40%;
}

.loader {
  position: absolute;
  width: 150px;
  height: 150px;
  top: 40%;
  border-radius: 90%;
  background: linear-gradient(45deg, transparent 40%, skyblue);
  animation: move 0.8s linear infinite;
}

.loader::before {
  position: absolute;
  content: '';
  top: 6px;
  left: 6px;
  right: 6px;
  bottom: 6px;
  background: #000;
  border-radius: 90%;
}

.loader::after {
  position: absolute;
  content: '';
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 90%;
  background: linear-gradient(45deg, transparent 40%, skyblue);
  filter: blur(20px);
}

@keyframes move {
  to {
    transform: rotate(360deg);
    filter: hue-rotate(360deg);
  }
}
</style>
