const createClauseBuilder = (joiningOperator: JoiningOperator) => {
  const conditions: string[] = [];
  const push = (condition: string) => conditions.push(condition);
  return {
    push,
    get: () =>
      conditions.length === 0
        ? ''
        : conditions.length === 1
        ? conditions[0]
        : `(${conditions.filter(Boolean).join(` ${joiningOperator} `)})`,
  };
};

type ConditionCreator = (() => string) | OperatorGroup;
type JoiningOperator = 'or' | 'and';

class OperatorGroup {
  builder;
  constructor(joiningOperator: 'or' | 'and') {
    this.builder = createClauseBuilder(joiningOperator);
  }

  protected add = (condition: string | ConditionCreator) => {
    this.builder.push(
      typeof condition === 'string'
        ? condition
        : '_' in condition
        ? condition._()
        : condition(),
    );
    return this;
  };
  protected addIf = (
    predicate: boolean,
    condition: string | ConditionCreator,
  ) => {
    if (predicate) {
      this.add(condition);
    }
    return this;
  };
  _ = () => this.builder.get();
  tap = (func: () => void) => {
    func();
    return this;
  };
}

class OrGroup extends OperatorGroup {
  constructor(private label?: string) {
    super('or');
  }
  or = this.add;
  orIf = this.addIf;
}
class AndGroup extends OperatorGroup {
  constructor(private label?: string) {
    super('and');
  }
  and = this.add;
  andIf = this.addIf;
}
const or_ = (label?: string) => new OrGroup(label);
const and_ = (label?: string) => new AndGroup(label);

export { or_, and_ };
