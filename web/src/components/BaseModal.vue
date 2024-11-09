<template lang="">
  <teleport to="body">
    <div
      class="lg:items-center 2xl:items-center fixed left-0 top-0 z-50 flex h-screen w-screen items-start justify-center"
      :class="[
        { 'is-active': isActive },
        closeAnimation || playAnim
          ? 'motion-duration-300 motion-scale-out-0 motion-opacity-out-0'
          : '',
      ]"
    >
      <div
        class="fixed left-0 top-0 z-20 h-full w-full backdrop-blur-lg"
        @click="close()"
      ></div>
      <div
        class="container fixed z-50 w-auto rounded-md border-2 border-secondary bg-base-100 text-base-content bg-opacity-100 shadow-xl motion-scale-in-[0] motion-translate-x-in-[-150%] motion-translate-y-in-[300%] motion-opacity-in-[0%] motion-rotate-in-[-500deg] motion-blur-in-[100px] motion-duration-[0.36s]/scale motion-duration-[0.41s]/translate motion-duration-[0.16s]/opacity motion-duration-[0.48s]/rotate motion-duration-[0.26s]/blur motion-ease-spring-snappy"
      >
        <slot @playAnim="playAnimation"></slot>
      </div>
    </div>
  </teleport>
</template>
<script setup lang="ts">
  import { ref, watch } from "vue";

  const props = defineProps<{ isActive: boolean; playAnim: boolean }>();

  const isActive = ref(props.isActive);

  const closeAnimation = ref(false);

  const emit = defineEmits(["closeModal"]);

  function close() {
    closeAnimation.value = true;
    setTimeout(() => {
      isActive.value = false;
      closeAnimation.value = false;
      emit("closeModal", "any");
    }, 300);
  }
</script>
