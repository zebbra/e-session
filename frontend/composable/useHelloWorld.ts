import { useContext } from "nuxt-composition-api";
import { $axios } from "~/utils/axios-acessor";
import { helloWorldStore } from "~/store";

export function fetchText(text: string) {
  const context = useContext();

  try {
    return $axios.$get(`/hello?text=${text}`);
  } catch (error) {
    context.error(error);
    return "";
  }
}

export async function fetchTextAndStore(text: string) {
  const result = await fetchText(text);
  helloWorldStore.setTextFromAction(result);
}
