export type TDispatchAppReducer = (action: {
  type: number;
  value?: any;
}) => void;

export enum AlertType {
  Error = 'alert-error',
  Warning = 'alert-warning',
  Neutral = 'alert-neutral',
}
// eslint-disable-next-line @typescript-eslint/ban-types
export type AlertAction = { callbacks: Function[]; name: string };
export type TAlert = {
  type: AlertType;
  title: string;
  description?: string;
  error?: Error;
  action?: AlertAction;
  dismissAction?: AlertAction;
};
