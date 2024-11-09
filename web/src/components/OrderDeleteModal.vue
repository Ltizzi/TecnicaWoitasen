<template lang="">
  <BaseModal
    :is-active="props.showModal"
    v-if="props.showModal"
    @closeModal="closeModal"
    :playAnim="closeAnim"
  >
    <div
      class="flex flex-col justify-center bg-base-300 py-5 px-16 rounded-sm gap-6 motion-duration-500 motion-ease-in-cubic motion-preset-pop motion-delay-300 motion-preset-focus-md w-full h-full"
    >
      <h1 class="text-2xl text-center bg-error w-full">Delete Order</h1>
      <div class="flex flex-col justify-start gap-2">
        <p>
          You are about to delete the order with ID
          <span class="text-xs">{{ props.order.id }}</span> .
        </p>
        <p class="text-sm">Client: {{ props.order.customer_name }}</p>
        <p class="text-sm">Item: {{ props.order.item }}</p>
        <p class="text-sm">
          Date: {{ generateDateTemplate(props.order.created_at) }}
        </p>
        <p class="text-center mt-4">Do you want to continue?</p>
      </div>

      <div class="flex flex-row justify-around w-full mt-5 gap-5">
        <button
          :class="[
            'btn  w-32 flex flex-row gap-1 justify-center',
            state.success ? 'btn-success btn-square' : 'btn-outline  btn-error',
          ]"
          @click="deleteOrder"
          :disabled="state.hasErrors"
        >
          <p v-if="!state.success">DELETE!!</p>
          <p v-else>Success!</p>
          <span v-if="state.awaiting"
            ><span class="loading loading-dots loading-md"></span>
          </span>
        </button>
        <button class="btn btn-outline btn-secondary w-32" @click="closeModal">
          Close
        </button>
      </div>
    </div>
  </BaseModal>
</template>
<script setup lang="ts">
  import BaseModal from "./BaseModal.vue";
  import { reactive, ref } from "vue";
  import { Order } from "../utils/types";
  import { API_URL } from "../main";
  import { generateDateTemplate } from "../utils/utils";

  const props = defineProps<{ showModal: boolean; order: Order }>();
  const emit = defineEmits(["closeModal", "updateList"]);

  const state = reactive({
    awaiting: false,
    success: false,
  });

  const closeAnim = ref<boolean>();

  function closeModal() {
    closeAnim.value = true;
    setTimeout(() => {
      closeAnim.value = false;
      emit("closeModal", "delete");
    }, 300);
  }

  async function deleteOrder() {
    state.awaiting = true;
    const URL = `${API_URL}/orders/${props.order.id}`;
    const method = "DELETE";
    const response = await fetch(URL, { method });
    if (response.ok) {
      state.awaiting = false;
      state.success = true;
      emit("updateList");
      setTimeout(() => {
        state.success = false;
        closeModal();
      }, 1500);
    }
  }
</script>
