<template>
  <section>
    <div>
      Store: {{ fromStore }}
      <v-btn small @click="onButtonClick">Click Me</v-btn>
    </div>
    <div>Store Action: {{ fromStoreAction }}</div>
    <div>Composable Async: {{ fromComposableWithAsync }}</div>
    <div>Composable Fetch: {{ fromComposableWithFetch }}</div>
    <div>Composable Context: {{ fromComposableWithContext }}</div>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  useAsync,
  useMeta,
  computed,
  ref,
  withContext,
  useFetch,
} from "nuxt-composition-api";
import { fetchText, fetchTextAndStore } from "~/composable/useHelloWorld";
import { helloWorldStore } from "~/store";

export default defineComponent({
  name: "HelloWorld",
  head: {},
  setup() {
    // Reactive data from store
    const fromStore = computed(() => helloWorldStore.text);

    // Also reactive data from store over action <-- use this if we need store
    const fromStoreAction = computed(() => helloWorldStore.textFromAction);
    fetchTextAndStore("store");

    // Fetch data with useAsync and composable pattern <-- use this for once off
    // is initialized on server and will not reload upon hard-reload (set to null)
    const fromComposableWithAsync = useAsync(() => fetchText("async"));

    // Fetch data with useFetch and composable pattern
    const fromComposableWithFetch = ref({ hello: "" });
    const { $fetch } = useFetch(async () => {
      const result = await fetchText("fetch");
      fromComposableWithFetch.value = result;
    });
    $fetch();

    // Fetch data with useContext and composable pattern <-- use this for non-store data
    const fromComposableWithContext = ref({ hello: "" });
    withContext(async () => {
      fromComposableWithContext.value = await fetchText("context");
    });

    useMeta({ title: "Hello World" });

    function onButtonClick() {
      helloWorldStore.setText("world");
    }

    return {
      fromStore,
      fromStoreAction,
      fromComposableWithAsync,
      fromComposableWithFetch,
      fromComposableWithContext,
      onButtonClick,
    };
  },
});
</script>
