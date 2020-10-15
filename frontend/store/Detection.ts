import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { FaceExpressions } from "face-api.js";

@Module({
  name: "Detection",
  namespaced: true,
  stateFactory: true,
})
export default class Global extends VuexModule {
  public expressions: FaceExpressions = null;
  public expressionsDetection: boolean = false;

  @Mutation
  setExpression(expressions: FaceExpressions) {
    this.expressions = expressions;
  }

  @Action
  updateExpression(expressions: FaceExpressions) {
    this.setExpression(expressions);
  }

  @Mutation
  toggleExpressionsDetection() {
    this.expressionsDetection = !this.expressionsDetection;
  }
}
