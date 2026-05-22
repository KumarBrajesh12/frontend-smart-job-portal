export type DbConnectionStatus =
  | 'disconnected'
  | 'connected'
  | 'connecting'
  | 'disconnecting'
  | 'unknown';

export interface HealthData {
  status: string;
  uptime: {
    seconds: number;
    human: string;
  };
  database: {
    status: DbConnectionStatus;
    connected: boolean;
  };
  timestamp: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  stack?: string;
}

export type HealthResponse = ApiSuccessResponse<HealthData>;
