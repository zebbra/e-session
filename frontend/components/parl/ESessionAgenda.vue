<template>
  <div>
    <h4>Agenda</h4>
    <v-card class="scroll mt-2 agenda-items" max-width="374">
      <v-card-text>
        <v-list dense>
          <v-list-item-group v-model="step">
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              three-line
              :disabled="isMember"
            >
              <v-list-item-content>
                <v-list-item-title class="whiteSpaceNormal"
                  >{{ index + 1 }} - {{ item.text }}</v-list-item-title
                >
                <v-list-item-subtitle>{{ item.author }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ item.party }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>

        <!-- <v-stepper v-model="step" vertical>
        <div v-for="(item, index) in items" :key="index" class="step">
          <v-stepper-step :complete="step > index" :step="index">
            {{ item.text }}
            <small>{{ item.author }}</small>
            <small>{{ item.party }}</small>
          </v-stepper-step>

          <v-stepper-content :step="index">
            <v-btn color="primary" @click="step = step + 1">
              Continue
            </v-btn>
          </v-stepper-content>
        </div>
      </v-stepper> -->
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "nuxt-composition-api";
import { roomStore, sessionStore } from "~/store";
import {
  useSetActiveAgendaItem,
  useFetchActiveAgendaItem,
} from "~/composable/useAgenda";

export default defineComponent({
  name: "ESessionParl",
  head: {},
  components: {},
  setup() {
    // const step = ref(0);
    const items = ref([
      {
        text: "Mitteilungen",
      },
      {
        text:
          "Interpellation betreffend Kleinstpensum in der Schule - ohne BVG, Beantwortung",
        author: "Esther Wyss-Tödtli",
        party: "SVP",
      },
      {
        text:
          "Interpellation betreffend Fruchtfolgeflächen in Dietikon, Beantwortung",
        author: "Andreas Wolf",
        party: "Grüne",
      },
      {
        text: "Interpellation betreffend cargo sous terrain, Beantwortung",
        author: "Beda Felber",
        party: "CVP",
      },
      {
        text:
          "Postulat betreffend Ausweitung und Systemwechsel der Subventionen für ausserfamiliäre Betreuungsangebote, Begründung",
        author: "Kerstin Camenisch",
        party: "SP",
      },
      {
        text:
          "Postulat betreffend Ausgleich der finanziellen Verluste der Kindertagesstätten aufgrund der Coronakrise, Begründung",
        author: "Ernst Joss",
        party: "AL",
      },
      {
        text: "Postulat betreffend LED-Informationstafeln, Begründung",
        author: "Manuela Ehmann",
        party: "EVP",
      },
      {
        text:
          "Postulat betreffend Kontinuierliche online Zufriedenheitsmessung der Bevölkerung, Begründung",
        author: "Konrad Lips",
        party: "SVP",
      },
      {
        text:
          "Interpellation betreffend Schuladministration der Stadt Dietikon - Stellenplan der Schulverwaltung, Begründung",
        author: "Eveline Heiniger",
        party: "SVP",
      },
      {
        text:
          "Interpellation betreffend Attraktivität Dietikons als Standort für Co-Working steigern, Begründung",
        author: "Olivier Barthe",
        party: "FDP",
      },
      {
        text: "Interpellation betreffend Ökologischer Stadtwein, Begründung",
        author: "Beat Hess",
        party: "Grüne",
      },
      {
        text:
          "Interpellation betreffend Bilanz Standortförderung durch die Limmat-stadt AG, Begründung",
        author: "Peter Metzinger",
        party: "FDP",
      },
    ]);
    useFetchActiveAgendaItem(roomStore.room);

    const step = computed({
      get: () => roomStore.activeAgendaItem,
      set: (idx) => {
        if (idx !== undefined && idx !== index.value) {
          index.value = idx;
          if (sessionStore.isModerator) {
            setActiveItem();
          }
        }
      },
    });

    const index = ref(0);
    const { mutate: setActiveItem } = useSetActiveAgendaItem(
      roomStore.room,
      index,
    );

    const isMember = computed(() => !sessionStore.isModerator);

    return {
      items,
      step,
      isMember,
    };
  },
});
</script>

<style scoped>
.scroll {
  overflow-y: scroll;
}
.whiteSpaceNormal {
  white-space: normal;
}
.agenda-items {
  height: calc(100vh - 300px);
}
</style>
