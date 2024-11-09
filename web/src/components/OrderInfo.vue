<template lang="">
  <BaseModal
    :is-active="props.showModal"
    v-if="props.showModal"
    @closeModal="closeModal"
    :playAnim="closeAnim"
  >
    <div
      class="flex flex-col justify-center bg-base-300 py-5 px-16 rounded-sm gap-6 motion-duration-500 motion-ease-in-cubic motion-preset-pop motion-delay-300 motion-preset-focus-md"
    >
      <h1 class="text-2xl text-center">Order Info</h1>
      <div class="text-start flex flex-col gap-10 text-base w-full">
        <div
          class="flex flex-row justify-between gap-10 hover:bg-primary hover:bg-opacity-15 hover:rounded-md py-1.5 px-2.5 duration-100 transition-all ease-in-out"
        >
          <h3 class="font-bold">Id:</h3>
          <p class="pt-6 italic">{{ props.order.id }}</p>
        </div>
        <div
          class="flex flex-row justify-between gap-10 hover:bg-primary hover:bg-opacity-15 hover:rounded-md py-1.5 px-2.5 duration-100 transition-all ease-in-out"
        >
          <h3 class="font-bold">Customer name:</h3>
          <p class="pt-6 italic">{{ props.order.customer_name }}</p>
        </div>
        <div
          class="flex flex-row justify-between gap-10 hover:bg-primary hover:bg-opacity-15 hover:rounded-md py-1.5 px-2.5 duration-100 transition-all ease-in-out"
        >
          <h3 class="font-bold">Item:</h3>
          <p class="pt-6 italic">{{ props.order.item }}</p>
        </div>

        <div
          class="flex flex-row justify-between gap-10 hover:bg-primary hover:bg-opacity-15 hover:rounded-md py-1.5 px-2.5 duration-100 transition-all ease-in-out"
        >
          <h3 class="font-bold">Quantity:</h3>
          <p class="pt-6 italic">{{ props.order.quantity }}</p>
        </div>
        <div
          class="flex flex-row justify-between gap-10 hover:bg-primary hover:bg-opacity-15 hover:rounded-md py-1.5 px-2.5 duration-100 transition-all ease-in-out"
        >
          <h3 class="font-bold">Status:</h3>
          <p class="pt-6 italic">{{ props.order.status }}</p>
        </div>
        <div
          class="flex flex-row justify-between gap-10 hover:bg-primary hover:bg-opacity-15 hover:rounded-md py-1.5 px-2.5 duration-100 transition-all ease-in-out"
        >
          <h3 class="font-bold">Create at:</h3>
          <p class="pt-6 italic">
            {{ generateDateTemplate(props.order.created_at) }}
          </p>
        </div>
      </div>
      <button class="btn btn-primary mt-5" @click="closeModal">Close</button>
    </div>
  </BaseModal>
</template>
<script setup lang="ts">
  import BaseModal from "./BaseModal.vue";
  import { ref } from "vue";
  import { Order } from "../utils/types";
  import { generateDateTemplate } from "../utils/utils.ts";

  const props = defineProps<{ order: Order; showModal: boolean }>();

  const closeAnim = ref(false);

  const emit = defineEmits(["closeModal", "playAnim"]);

  function closeModal() {
    closeAnim.value = true;
    setTimeout(() => {
      closeAnim.value = false;
      emit("closeModal");
    }, 300);
  }
</script>
