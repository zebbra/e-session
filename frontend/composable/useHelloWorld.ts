import { useContext } from "nuxt-composition-api";
import { $axios } from "~/utils/axios-acessor";

export function fetchText() {
  const context = useContext();

  try {
    return $axios.$get("/hello");
  } catch (error) {
    context.error(error);
    return "";
  }
}
