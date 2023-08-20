export const POLLING_INTERVAL: number = 5000;
export const DEFAULT_DENOMINATIONS: number[] = [1, 5, 10, 20, 25, 100, 500, 1000];
export const DEFAULT_MIN_BUY_IN: number = 5;
export const DEFAULT_MAX_BUY_IN: number = 100;
export const POKERFLOW_GREEN: string = '#388E3C';

export const DEVICE_STATUS_SERVICE_ID: string = '0a32d408-0041-4f79-ae6d-628c1b84f033';
export const DEVICE_STATUS_SERVICE_PUBLISH_ID: string = '32e4440c-bab3-41d8-8cfa-f6f106b7bbe8';
export const DEVICE_STATUS_SERVICE_SUBSCRIBE_ID: string = '1840209c-5e12-41f7-aa10-3db3701c990c';

export const DEPOSIT_SERVICE_ID: string = 'be1c02e2-0da4-4ed8-8db0-7091b56b6acf';
export const DEPOSIT_SERVICE_PUBLISH_ID: string = '0c0b93ef-a1b8-42a1-919b-566e89121a54';
export const DEPOSIT_SERVICE_SUBSCRIBE_ID: string = '2294e13e-5e60-4e56-aa64-d255017b34dc';

export const WITHDRAWAL_SERVICE_ID: string = 'ae0a7741-9fb4-455f-ac4b-118b49de42ee';
export const WITHDRAWAL_SERVICE_PUBLISH_ID: string = '6f6f6649-c473-4610-8c9f-fe246e32f9a7';
export const WITHDRAWAL_SERVICE_SUBSCRIBE_ID: string = 'd414a492-a537-4b7d-9b1f-85749aa4e0a2';

enum TransactionType {
  BUY_IN = 'BUY_IN',
  CASH_OUT = 'CASH_OUT'
}

export const POOL_BY_ID = {
  admin: {
    firstName: "Alex",
    id: 1,
    lastName: "Dalgleish-Morel"
  },
  available_pot: 5.0,
  contributors: [
      {
        contribution: 366.0,
        profile: {
            firstName: "Alex",
            id: 1,
            lastName: "Dalgleish-Morel"
        }
      },
      {
        contribution: 5.0,
        profile: {
          firstName: "Buddy",
          id: 2,
          lastName: "Guy"
        }
      }
  ],
  date_created: "Fri, 30 Jun 2023 04:42:55 GMT",
  device_id: 1,
  id: 1,
  name: "test",
  settings: {
    buy_in_enabled: true,
    buy_in_expiry_time: '',
    denominations: [
        1.0,
        5.0,
        10.0,
        20.0,
        25.0
    ],
    expired: false,
    has_password: false,
    id: 1,
    max_buy_in: 10000.0,
    min_buy_in: 5.0
  },
  transactions: [
    {
      id: 1,
      amount: 11.0,
      date: "Fri, 30 Jun 2023 05:14:50 GMT",
      profile: {
          firstName: "Alex",
          id: 1,
          lastName: "Dalgleish-Morel"
      },
      type: TransactionType.BUY_IN
    },
  ]
};  

export const POOLS_BY_USER = [
  {
    admin: {
      firstName: "Alex",
      id: 1,
      lastName: "Dalgleish-Morel"
    },
    available_pot: 5.0,
    contributors: [
        {
          contribution: 366.0,
          profile: {
              firstName: "Alex",
              id: 1,
              lastName: "Dalgleish-Morel"
          }
        },
        {
          contribution: 5.0,
          profile: {
            firstName: "Buddy",
            id: 2,
            lastName: "Guy"
          }
        }
    ],
    date_created: "Fri, 30 Jun 2023 04:42:55 GMT",
    device_id: 1,
    id: 1,
    name: "test",
    settings: {
      buy_in_enabled: true,
      buy_in_expiry_time: '',
      denominations: [
          1.0,
          5.0,
          10.0,
          20.0,
          25.0
      ],
      expired: false,
      has_password: false,
      id: 1,
      max_buy_in: 10000.0,
      min_buy_in: 5.0
    },
    transactions: [
      {
        id: 1,
        amount: 11.0,
        date: "Fri, 30 Jun 2023 05:14:50 GMT",
        profile: {
            firstName: "Alex",
            id: 1,
            lastName: "Dalgleish-Morel"
        },
        type: "BUY_IN"
      },
    ]
  }
];
