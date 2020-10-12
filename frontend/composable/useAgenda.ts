import { Ref } from "@vue/composition-api";
import { useMutation, useSubscription, useQuery } from "@vue/apollo-composable";
import { roomStore } from "~/store";
import { queries, mutations, subscriptions } from "~/apollo";
import { IRoom } from "~/types";

export function useSetActiveAgendaItem(room: IRoom, index: Ref<number>) {
  return useMutation(mutations.room.setActiveAgendaItem, () => ({
    variables: {
      roomId: room.id,
      index: index.value.toString(),
    },
  }));
}

export function useOnAgendaUpdate(room: IRoom) {
  if (process.browser) {
    const { onResult } = useSubscription<{ agenda: any }>(
      subscriptions.room.agenda,
      { roomId: room.id },
    );

    onResult((result) => {
      roomStore.setActiveAgendaItem(
        parseInt(result.data.agenda.activeAgendaItem),
      );
    });
  }
}

export function useFetchActiveAgendaItem(room: IRoom) {
  if (process.browser) {
    const { onResult } = useQuery<{ fetchActiveAgendaItem: any }>(
      queries.room.fetchActiveAgendaItem,
      () => ({
        roomId: room.id,
      }),
    );
    onResult((result) => {
      roomStore.setActiveAgendaItem(
        parseInt(result.data.fetchActiveAgendaItem.activeAgendaItem),
      );
    });
  }
}
