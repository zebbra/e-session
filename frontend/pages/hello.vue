<template>
  <section>
    <div>
      Store: {{ fromStore }}
      <v-btn small @click="onButton1Click">Click Me</v-btn>
    </div>
    <div>
      Store Action: {{ fromStoreAction }}
      <v-btn small @click="onButton2Click">Click Me</v-btn>
    </div>
    <div>Composable Async: {{ fromComposableWithAsync }}</div>
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
  Ref,
  withContext,
} from "nuxt-composition-api";
import { fetchText } from "~/composable/useHelloWorld";
import { helloWorldStore } from "~/store";

export default defineComponent({
  name: "HelloWorld",
  head: {},
  setup() {
    // Reactive data from store
    const fromStore = computed(() => helloWorldStore.text);

    // Also reactive data from store which will update to value from backend upon button click
    const fromStoreAction = computed(() => helloWorldStore.textFromAction);

    // Fetch data with useAsync and composable pattern
    // is initialized on server and will not reload upon hard-reload (set to null)
    const fromComposableWithAsync = useAsync(() => fetchText());

    // Fetch data with useContext and composable pattern
    const fromComposableWithContext: Ref<string> = ref({ hello: "" });

    withContext(async () => {
      fromComposableWithContext.value = await fetchText();
    });

    useMeta({ title: "Hello World" });

    function onButton1Click() {
      helloWorldStore.setText("world");
    }

    function onButton2Click() {
      helloWorldStore.updateText();
    }

    return {
      fromStore,
      fromStoreAction,
      fromComposableWithAsync,
      fromComposableWithContext,
      onButton1Click,
      onButton2Click,
    };
  },
});
</script>
