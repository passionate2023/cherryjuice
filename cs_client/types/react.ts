export type TDispatchAppReducer = (action: {
  type: number;
  value?: any;
}) => void;

export enum AlertType {
  Error = 'alert-error',
  Warning = 'alert-warning',
}
export type TAlert = {
  type: AlertType;
  title: string;
  description: string;
  error?: Error;
};
