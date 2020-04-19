export type TDispatchAppReducer = (action: {
  type: number;
  value?: any;
}) => void;

export enum AlertType {
  Error = 'alert-error',
  Information = 'alert-information',
}
export type TAlert = {
  type: AlertType;
  title: string;
  description: string;
  error?: Error;
};
