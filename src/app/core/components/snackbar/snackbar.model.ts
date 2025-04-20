export type SnackbarIconTypes = 'success' | 'info' | 'warn' | 'danger';

export interface SnackbarBase{
  iconType: SnackbarIconTypes;
  headingText: string;
  messageText: string;
}

export interface Snackbar extends SnackbarBase{
  id: number;
  timer: Object;
  isClosed: boolean;
  isSliding: boolean;
}

export interface SnackbarRequest extends SnackbarBase{
  durationType: DurationType;
}

export type DurationType = 'short' | 'medium' | 'long' | 'dev';
