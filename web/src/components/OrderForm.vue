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
      <h1 class="text-2xl text-center">
        {{ props.isEditor ? "Order Editor" : "Create New Order" }}
      </h1>
      <div v-if="props.isEditor && props.order" class="flex flex-col gap-2">
        <p class="text-sm">Id:</p>
        <p class="text-xs">{{ props.order.id }}</p>
      </div>
      <div v-if="props.isEditor && props.order" class="flex flex-col gap-2">
        <p class="text-sm">Created at:</p>
        <p class="text-xs">
          {{ generateDateTemplate(props.order.created_at) }}
        </p>
      </div>

      <!-- FORM -->
      <div class="text-start flex flex-col gap-3 text-base w-full">
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Customer's name:</span>
          </div>
          <input
            type="text"
            :placeholder="
              props.isEditor ? props.order.customer_name : 'Type here'
            "
            class="input input-bordered w-full max-w-xs"
            v-model="name"
            @blur="validate"
            @change="setTouched('name')"
          />
          <p
            v-if="state.touched.name && state.errors.name.length > 0"
            class="text-xs text-error flex flex-col gap-0.5"
          >
            <span v-for="err in state.errors.name">{{ err }}</span>
          </p>
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Item's name:</span>
          </div>
          <input
            type="text"
            :placeholder="props.isEditor ? props.order.item : 'Type here'"
            class="input input-bordered w-full max-w-xs"
            v-model="item"
            @blur="validate"
            @change="setTouched('item')"
          />
          <p
            v-if="state.touched.item && state.errors.item.length > 0"
            class="text-xs text-error"
          >
            <span v-for="err in state.errors.item">{{ err }}</span>
          </p>
        </label>

        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Quantity:</span>
          </div>
          <input
            type="number"
            :placeholder="
              props.isEditor ? props.order.quantity : 'Pick a number'
            "
            min="1"
            max="100"
            class="input input-bordered w-full max-w-xs"
            v-model="quantity"
            @blur="validate"
            @change="setTouched('quantity')"
          />
          <p
            v-if="state.touched.quantity && state.errors.quantity.length > 0"
            class="text-xs text-error"
          >
            <span v-for="err in state.errors.quantity">{{ err }}</span>
          </p>
        </label>

        <select class="select w-full select-bordered mt-5" v-model="status">
          <option disabled selected>Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <p class="text-xs text-error my-2" v-if="state.failed">
          Algo salió mal...
        </p>

        <div class="flex flex-row justify-around w-full mt-5 gap-5">
          <button
            :class="[
              'btn  w-32 flex flex-row gap-1 justify-center',
              state.success
                ? 'btn-success btn-square'
                : 'btn-outline  btn-primary',
            ]"
            @click="submitForm"
            :disabled="state.hasErrors"
          >
            <p v-if="!state.success">
              {{ props.isEditor ? "Update" : "Create" }}
            </p>
            <p v-else>Success!</p>
            <span v-if="state.awaiting"
              ><span class="loading loading-dots loading-md"></span>
            </span>
          </button>
          <button class="btn btn-outline btn-error w-32" @click="closeModal">
            Close
          </button>
        </div>
      </div>
    </div>
  </BaseModal>
</template>
<script setup lang="ts">
  import BaseModal from "./BaseModal.vue";
  import { ref, watch, reactive } from "vue";
  import { generateDateTemplate } from "../utils/utils.ts";
  import { Status, Order } from "../utils/types";
  import { validateOrder } from "../utils/utils";
  import { API_URL } from "../main";

  const props = defineProps<{
    isEditor: boolean;
    order: Order;
    showModal: boolean;
  }>();

  const emit = defineEmits(["closeModal", "playAnim", "updateList"]);

  const state = reactive({
    hasErrors: false,
    failed: false,
    errors: {
      name: [],
      item: [],
      quantity: [],
    },
    touched: {
      name: false,
      item: false,
      quantity: false,
    },
    awaiting: false,
    success: false,
  });

  //FORM FIELDS
  const name = ref<string>();
  const item = ref<string>();
  const quantity = ref<number>();
  const status = ref<Status>();

  const closeAnim = ref(false);

  //Usada para definir qué mensajes de error mostrar
  function setTouched(name: string) {
    switch (name) {
      case "name":
        state.touched.name = true;
        break;
      case "item":
        state.touched.item = true;
        break;
      case "quantity":
        state.touched.quantity = true;
        break;
      default:
        state.touched.name = false;
        state.touched.item = false;
        state.touched.quantity = false;
        break;
    }
  }

  function validate() {
    state.errors = {
      name: [],
      item: [],
      quantity: [],
    };
    const order = {
      customer_name: name.value,
      item: item.value,
      quantity: quantity.value,
    } as Order;
    //recopila errores y devuelve un objeto con dos props:
    // passed = objeto con 3 propiedades, una para cada prop para validad
    // msgs = mensajes de error
    const validations = validateOrder(order);

    //se asignan los mensajes de error para cada propiedad o un array vacío si no los hay
    state.errors.name = validations.passed.customer_name
      ? []
      : validations.msgs.customer_name;

    state.errors.item = validations.passed.item ? [] : validations.msgs.item;

    state.errors.quantity = validations.passed.quantity
      ? []
      : validations.msgs.quantity;

    //usado para la propiedad disabled del boton q hace el submit del form
    state.hasErrors =
      !validations.passed.customer_name ||
      !validations.passed.item ||
      !validations.passed.quantity;
  }

  async function submitForm() {
    state.awaiting = true;
    let order = {} as Order;
    let url = `${API_URL}/orders`;
    let method = "";

    if (props.isEditor) {
      //se prepara la url y http method para editar una order
      // además se llenan los campos vacios para evitar sobrescritura
      method = "PUT";
      url = url + `/${props.order.id}`;

      order.created_at = props.order.created_at;
      order.id = props.order.id;
      order.customer_name = name.value ? name.value : props.order.customer_name;
      order.item = item.value ? item.value : props.order.item;
      order.quantity = quantity.value ? quantity.value : props.order.quantity;
      order.status = status.value ? status.value : props.order.status;
    } else {
      //se prepara la url y http method para crear una order
      method = "POST";
      order.customer_name = name.value as string;
      order.item = item.value as string;
      order.quantity = quantity.value as number;
      order.status = status.value;
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (response.ok) {
      state.awaiting = false;
      let res = await response.json();
      console.log(res);
      state.success = true;
      setTimeout(() => {
        emit("updateList");
        state.success = false;
        closeModal();
      }, 2000);
    } else {
      state.awaiting = false;
      state.failed = true;
      setTimeout(() => {
        state.failed = false;
      }, 2000);
    }
  }

  function closeModal() {
    closeAnim.value = true;
    setTimeout(() => {
      closeAnim.value = false;
      let modalType = props.isEditor ? "edit" : "create";
      emit("closeModal", modalType);
    }, 300);
  }

  //Vigila la apertura del modal para preparar las variables usadas por el formulario para completar los inputs con los valores a editar. O las limpia si es una ventana para crear una orden nueva.
  watch(
    () => props.showModal,
    (newValue, oldValue) => {
      if (newValue) {
        if (props.isEditor) {
          name.value = props.order.customer_name;
          item.value = props.order.item;
          quantity.value = props.order.quantity;
          status.value = props.order.status;
        } else {
          name.value = "";
          item.value = "";
          quantity.value = 1;
          status.value = Status.PENDING;
        }
      }
    }
  );
</script>
