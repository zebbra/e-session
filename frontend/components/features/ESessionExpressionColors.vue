<template>
  <div :style="boxShadow" />
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  onMounted,
  ref,
  useContext,
} from "nuxt-composition-api";
import { Tween, update } from "es6-tween";
import { FaceExpressions } from "face-api.js";
import { detectionStore } from "~/store";
import { round, highestScore } from "~/utils/helpers";

export default defineComponent({
  name: "ESessionExpressionColors",

  setup() {
    const { app } = useContext();

    onMounted(() => {
      requestAnimationFrame(animate);
      app.$startFaceApi();
    });

    const initColorTest = ref({
      red: 0,
      green: 0,
      blue: 0,
      alpha: 0,
    });

    const finalColors = ref({
      redScore: { red: 255, green: 0, blue: 0, alpha: 0.6 },
      purpleScore: { red: 128, green: 0, blue: 128, alpha: 0.6 },
      orangeScore: { red: 255, green: 165, blue: 0, alpha: 0.6 },
      greenScore: { red: 0, green: 255, blue: 0, alpha: 0.6 },
      whiteScore: { red: 255, green: 255, blue: 255, alpha: 0.6 },
      blueScore: { red: 0, green: 0, blue: 255, alpha: 0.6 },
      yellowScore: { red: 255, green: 255, blue: 0, alpha: 0.6 },
    });

    const expressionsColor = computed(() => {
      const expressions: FaceExpressions = detectionStore.expressions;
      const scores = {
        redScore: round(expressions ? expressions.angry : 0),
        purpleScore: round(expressions ? expressions.disgusted : 0),
        orangeScore: round(expressions ? expressions.fearful : 0),
        greenScore: round(expressions ? expressions.happy : 0),
        whiteScore: round(expressions ? expressions.neutral : 0),
        blueScore: round(expressions ? expressions.sad : 0),
        yellowScore: round(expressions ? expressions.surprised : 0),
      };

      const result = highestScore(scores);

      return finalColors.value[result];
    });

    const initColorTestNew = computed(() => expressionsColor.value);

    const tweenedCSSColor = computed(() => {
      // console.log("tweenedCSSColor");
      new Tween(initColorTest.value).to(initColorTestNew.value, 750).start();
      // animate();
      return `rgba(${initColorTest.value.red}, ${initColorTest.value.green}, ${initColorTest.value.blue}, ${initColorTest.value.alpha})`;
    });

    const boxShadow = computed(() => {
      // console.log("initColorTest.value", initColorTest.value);
      // console.log("initColorTestNew.value", initColorTestNew.value);

      return {
        "box-shadow": `0px -12px 34px 0px inset ${tweenedCSSColor.value}`,
      };
    });

    function animate(time) {
      requestAnimationFrame(animate);
      update(time);
    }

    return {
      boxShadow,
    };
  },
});
</script>

<style scoped></style>
