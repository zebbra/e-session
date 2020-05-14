import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { $axios } from "~/utils/axios-acessor";

@Module({
  name: "HelloWorld",
  namespaced: true,
  stateFactory: true,
})
export default class HelloWorld extends VuexModule {
  public text: { hello: string } = { hello: "" };
  public textFromAction: { hello: string } = { hello: "" };

  @Mutation
  setText(text: string) {
    this.text.hello = text;
  }

  @Mutation
  setTextFromAction(value: { hello: string }) {
    this.textFromAction = value;
  }

  @Action
  async updateText() {
    const text = await $axios.$get("/hello");
    this.setTextFromAction(text);
  }
}
