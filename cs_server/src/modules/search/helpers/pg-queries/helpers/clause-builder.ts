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

  add = (condition: string | ConditionCreator) => {
    this.builder.push(
      typeof condition === 'string'
        ? condition
        : 'get' in condition
        ? condition.get()
        : condition(),
    );
    return this;
  };
  addIf = (predicate: boolean, condition: string | ConditionCreator) => {
    if (predicate) {
      this.builder.push(
        typeof condition === 'string'
          ? condition
          : 'get' in condition
          ? condition.get()
          : condition(),
      );
    }
    return this;
  };
  get = () => this.builder.get();
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
const orGroup = (label?: string) => new OrGroup(label);
const andGroup = (label?: string) => new AndGroup(label);

export { orGroup, andGroup };
