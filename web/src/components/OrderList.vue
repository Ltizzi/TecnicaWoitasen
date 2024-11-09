<template lang="">
  <div class="flex justify-center flex-col items-center bg-opacity-0">
    <div class="w-full flex flex-col justify-center items-center mx-auto">
      <h1 class="text-2xl mt-2">Order List</h1>

      <div class="flex justify-between w-9/12 -ml-20 flex-row">
        <!-- NEW ORDER BTN -->
        <button
          class="btn btn-outline btn-primary btn-sm"
          @click="openModal('create', null)"
        >
          Create Post
        </button>

        <!-- FILTERS -->
        <div class="flex flex-row gap-2 items-center">
          <h2 class="text-sm my-auto mr-5">Filters:</h2>

          <button
            :class="[
              'btn  btn-info btn-xs border-opacity-60',
              state.filter == 'all' ? '' : 'btn-outline',
            ]"
            @click="filterOrders('all')"
          >
            All
          </button>

          <button
            :class="[
              'btn  btn-warning btn-xs border-opacity-60',
              ,
              state.filter == 'pending' ? '' : 'btn-outline',
            ]"
            @click="filterOrders('pending')"
          >
            Pending
          </button>

          <button
            :class="[
              'btn  btn-success btn-xs border-opacity-60',
              state.filter == 'completed' ? '' : 'btn-outline',
            ]"
            @click="filterOrders('completed')"
          >
            Completed
          </button>

          <button
            :class="[
              'btn btn-error btn-xs border-opacity-60',
              state.filter == 'cancelled' ? '' : 'btn-outline',
            ]"
            @click="filterOrders('cancelled')"
          >
            Cancelled
          </button>
        </div>
      </div>
    </div>

    <!--TABLE-->
    <table
      :class="[
        'motion-duration-200 motion-ease-in-out table w-10/12 my-2 bg-base-300',
        state.refreshAnim
          ? ' motion-opacity-out-0 motion-preset-focus-lg'
          : 'motion-opacity-in-0 motion-preset-focus-lg',
      ]"
    >
      <thead>
        <tr class="text-sm w-full">
          <th class="max-w-40">Id</th>
          <th class="max-w-48 min-w-48">Customer's Name</th>
          <th class="max-w-52 min-w-52">Item</th>
          <th class="max-w-24 min-w-24">Quantity</th>
          <th class="max-w-32 min-w-32">Status</th>
          <th class="max-w-36 min-w-36">Control</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="duration-75 ease-in-out motion-ease-in-out hover:bg-primary hover:bg-opacity-40 hover:rounded-2xl"
          v-for="order in orders"
        >
          <th class="text-xs">{{ order.id }}</th>
          <td>{{ order.customer_name }}</td>
          <td>{{ order.item }}</td>
          <td>{{ order.quantity }}</td>
          <td>{{ order.status }}</td>
          <td class="flex flex-row gap-3 justify-start">
            <button
              class="btn btn-accent w-16 max-w-16 text-white motion-duration-200 motion-ease-spring-bouncy motion-preset-bounce hover:bg-opacity-60 bg-opacity-45"
              @click="openModal('info', order)"
            >
              Info
            </button>

            <button
              class="btn btn-active btn-secondary w-16 max-w-16 text-white motion-duration-200 motion-ease-spring-bouncy motion-preset-bounce hover:bg-opacity-60 bg-opacity-45"
              @click="openModal('edit', order)"
            >
              Edit
            </button>
            <button
              class="btn btn-error min-w-10 max-w-16 text-white motion-duration-200 motion-ease-spring-bouncy motion-preset-bounce bg-opacity-45"
              @click="openModal('delete', order)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- PAGINATION     -->
    <div
      :class="[
        'mx-auto flex flex-row gap-1 motion-duration-200 motion-ease-in-out',
        state.refreshAnim
          ? 'motion-opacity-out-0 motion-preset-focus-lg'
          : 'motion-opacity-in-0 motion-preset-focus-lg',
      ]"
    >
      <button
        class="join-item btn btn-outline btn-secondary rounded-r-none"
        @click="goPrevious"
      >
        Previous
      </button>

      <div class="join flex flex-row gap-1">
        <div v-for="page in state.totalPages" @click="goPage(page)">
          <button
            :class="[
              'btn btn-primary btn-outline w-12',
              state.currentPage == page ? 'btn-active ' : '',
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>

      <button
        class="join-item btn btn-outline btn-secondary rounded-l-none"
        @click="goNext"
      >
        Next
      </button>
    </div>
  </div>

  <!-- MODALS -->
  <OrderInfo
    :order="selectedOrder"
    :showModal="state.info"
    @closeModal="closeModal('info')"
    v-if="state.info"
  />
  <OrderForm
    :isEditor="state.isEditor"
    :order="selectedOrder"
    :showModal="state.edit || state.new"
    @closeModal="closeModal"
    @updateList="updateList"
  />
  <OrderDeleteModal
    :order="selectedOrder"
    :showModal="state.delete"
    @closeModal="closeModal"
    @updateList="updateList"
  />
</template>
<script setup lang="ts">
  import { ref, onBeforeMount, reactive } from "vue";
  import { Order, Status } from "../utils/types";
  import { API_URL } from "../main";
  import OrderInfo from "./OrderInfo.vue";
  import OrderForm from "./OrderForm.vue";
  import OrderDeleteModal from "./OrderDeleteModal.vue";

  const state = reactive({
    info: false,
    edit: false,
    delete: false,
    new: false,
    isEditor: false,
    currentPage: 1,
    totalPages: 1,
    filter: "all",
    refreshAnim: false,
  });

  const selectedOrder = ref<Order | null>();
  const orders = ref<Order[]>();
  const unfiltered_orders = ref<Order[]>();
  const statusFilter = ref<Status>();

  //PAGINATION

  const PAGE_LIMIT = 10;
  const ordersCount = ref<number>();
  const pages = ref<number[]>([1]);

  async function goPrevious() {
    if (state.currentPage != 1) {
      const targetPage = state.currentPage - 1;
      await goPage(targetPage);
    }
  }

  async function goNext() {
    if (state.currentPage != state.totalPages) {
      const targetPage = state.currentPage + 1;
      await goPage(targetPage);
    }
  }

  async function goPage(page: number) {
    state.refreshAnim = true;
    setTimeout(async () => {
      state.currentPage = page;
      if (state.filter == "all") {
        const response = await fetchOrders(page);
        orders.value = response;
      } else await filterOrders(state.filter.toUpperCase());
    }, 150);

    setTimeout(() => {
      state.refreshAnim = false;
    }, 200);
  }

  function calcPages() {
    if (ordersCount.value) {
      const total = Math.ceil(ordersCount.value / PAGE_LIMIT);
      for (let i = 1; i <= total; i++) {
        pages.value.push(i);
      }
      state.totalPages = total;
    }
  }

  function openModal(type: string, order: Order | null) {
    //console.log(order);
    if (order != null) selectedOrder.value = order;

    switch (type) {
      case "info":
        state.info = true;
        break;
      case "create":
        state.isEditor = false;
        state.new = true;
        break;
      case "edit":
        state.isEditor = true;
        state.edit = true;
        break;
      case "delete":
        state.delete = true;
        break;
    }
  }

  function closeModal(type: string) {
    selectedOrder.value = null;

    switch (type) {
      case "info":
        state.info = false;
        break;
      case "create":
        state.new = false;
        break;
      case "edit":
        state.edit = false;
        state.isEditor = false;
        break;
      case "delete":
        state.delete = false;
        break;
    }
  }

  //FILTER
  async function filterOrders(filter: string) {
    state.refreshAnim = true;
    state.filter = filter;

    if (filter == "all") {
      setTimeout(async () => {
        await getOrdersCount(null);
        calcPages();
        state.refreshAnim = false;
        orders.value = unfiltered_orders.value;
      }, 200);
      return;
    }
    filter = filter.toUpperCase();

    setTimeout(async () => {
      await getOrdersCount(filter);
      if (ordersCount.value && ordersCount.value < 10) {
        state.currentPage = 1;
      }
      calcPages();
      const URL = `${API_URL}/ordersByStatus?status=${filter}&page=${state.currentPage}&pageSize=${PAGE_LIMIT}`;
      const method = "GET";
      const response = await fetch(URL, { method });
      if (response.ok) {
        let res = await response.json();
        orders.value = res;
      }
      state.refreshAnim = false;
    }, 200);
  }

  async function updateList() {
    orders.value = await fetchOrders(state.currentPage);
    unfiltered_orders.value = orders.value;
  }

  async function fetchOrders(page: number) {
    const url = `${API_URL}/orders?page=${page}&pageSize=${PAGE_LIMIT}`;
    const response = await fetch(url, {
      method: "GET",
    });
    return await response.json();
  }

  //Cuenta el número de ordes para calcular la cantidad de páginas
  async function getOrdersCount(status: string | null) {
    let url = `${API_URL}/orders/count`;
    if (status != null) {
      url = url + `?status=${status}`;
    }
    const response = await fetch(url, { method: "GET" });
    let res = await response.json();
    ordersCount.value = res.total;
  }

  onBeforeMount(async () => {
    orders.value = await fetchOrders(state.currentPage);
    unfiltered_orders.value = orders.value;
    await getOrdersCount(null);
    calcPages();
  });
</script>
