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
              :disabled="isMember"
            >
              <!-- <v-list-item-icon class="mr-1">
                <v-btn icon>
                  <v-icon v-if="item.resource" x-small>mdi-open-in-new</v-icon>
                </v-btn>
              </v-list-item-icon> -->
              <v-list-item-content>
                <v-list-item-title class="whiteSpaceNormal">
                  {{ index + 1 }} - {{ item.text }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ item.author }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ item.party }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
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
        resource: "https://www.dietikon.ch/_rte/information/876419",
      },
      {
        text:
          "Interpellation betreffend Fruchtfolgeflächen in Dietikon, Beantwortung",
        author: "Andreas Wolf",
        party: "Grüne",
        resource: "https://www.dietikon.ch/_rte/information/1027649",
      },
      {
        text: "Interpellation betreffend cargo sous terrain, Beantwortung",
        author: "Beda Felber",
        party: "CVP",
        resource: "https://www.dietikon.ch/_rte/information/1031261",
      },
      {
        text:
          "Postulat betreffend Ausweitung und Systemwechsel der Subventionen für ausserfamiliäre Betreuungsangebote, Begründung",
        author: "Kerstin Camenisch",
        party: "SP",
        resource: "https://www.dietikon.ch/_rte/information/964751",
      },
      {
        text:
          "Postulat betreffend Ausgleich der finanziellen Verluste der Kindertagesstätten aufgrund der Coronakrise, Begründung",
        author: "Ernst Joss",
        party: "AL",
        resource: "https://www.dietikon.ch/_rte/information/964727",
      },
      {
        text: "Postulat betreffend LED-Informationstafeln, Begründung",
        author: "Manuela Ehmann",
        party: "EVP",
        resource: "https://www.dietikon.ch/_rte/information/964754",
      },
      {
        text:
          "Postulat betreffend Kontinuierliche online Zufriedenheitsmessung der Bevölkerung, Begründung",
        author: "Konrad Lips",
        party: "SVP",
        resource: "https://www.dietikon.ch/_rte/information/988210",
      },
      {
        text:
          "Interpellation betreffend Schuladministration der Stadt Dietikon - Stellenplan der Schulverwaltung, Begründung",
        author: "Eveline Heiniger",
        party: "SVP",
        resource: "https://www.dietikon.ch/_rte/information/945445",
      },
      {
        text:
          "Interpellation betreffend Attraktivität Dietikons als Standort für Co-Working steigern, Begründung",
        author: "Olivier Barthe",
        party: "FDP",
        resource: "https://www.dietikon.ch/_rte/information/964772",
      },
      {
        text: "Interpellation betreffend Ökologischer Stadtwein, Begründung",
        author: "Beat Hess",
        party: "Grüne",
        resource: "https://www.dietikon.ch/_rte/information/985522",
      },
      {
        text:
          "Interpellation betreffend Bilanz Standortförderung durch die Limmat-stadt AG, Begründung",
        author: "Peter Metzinger",
        party: "FDP",
        resource: "https://www.dietikon.ch/_rte/information/988201",
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
