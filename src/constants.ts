export const POLLING_INTERVAL: number = 5000;
export const DEFAULT_DENOMINATION_COUNT: number = 4;
export const DEFAULT_DENOMINATIONS: number[] = [0.1, 0.5, 1, 5, 10, 25, 100, 500, 1000, 5000];
export const DEFAULT_MIN_BUY_IN: number = 5;
export const DEFAULT_MAX_BUY_IN: number = 100;
export const POKERFLOW_GREEN: string = '#388E3C';
export const API_TIMEOUT_CONSTRAINT: number = 10000;

export const EMPTY_POOL_DATA = {
    name: '',
    date_created: '',
    id: '',
    available_pot: 0,
    member_ids: [],
    contributors: [],
    transactions: [],
    admin: {},
    settings: {
      min_buy_in: 0,
      max_buy_in: 0,
      denominations: []
    }
};

export const DEVICE_STATUS_SERVICE_ID: string = '0a32d408-0041-4f79-ae6d-628c1b84f033';
export const DEVICE_STATUS_SERVICE_PUBLISH_ID: string = '32e4440c-bab3-41d8-8cfa-f6f106b7bbe8';
export const DEVICE_STATUS_SERVICE_SUBSCRIBE_ID: string = '1840209c-5e12-41f7-aa10-3db3701c990c';

export const DEPOSIT_SERVICE_ID: string = 'be1c02e2-0da4-4ed8-8db0-7091b56b6acf';
export const DEPOSIT_SERVICE_PUBLISH_ID: string = '0c0b93ef-a1b8-42a1-919b-566e89121a54';
export const DEPOSIT_SERVICE_SUBSCRIBE_ID: string = '2294e13e-5e60-4e56-aa64-d255017b34dc';

export const WITHDRAWAL_SERVICE_ID: string = 'ae0a7741-9fb4-455f-ac4b-118b49de42ee';
export const WITHDRAWAL_SERVICE_PUBLISH_ID: string = '6f6f6649-c473-4610-8c9f-fe246e32f9a7';
export const WITHDRAWAL_SERVICE_SUBSCRIBE_ID: string = 'd414a492-a537-4b7d-9b1f-85749aa4e0a2';
