export const POLLING_INTERVAL: number = 5000;
export const DEFAULT_DENOMINATION_COUNT: number = 4;
export const DEFAULT_DENOMINATIONS: number[] = [0.1, 0.5, 1, 5, 10, 25, 100, 500, 1000, 5000];
export const DEFAULT_MIN_BUY_IN: number = 5;
export const DEFAULT_MAX_BUY_IN: number = 100;
export const POKERFLOW_GREEN: string = '#388E3C';
export const API_TIMEOUT_CONSTRAINT: number = 10000;

export const EMPTY_GAME_DATA = {
    name: '',
    dateCreated: '',
    id: '',
    availableCashout: 0,
    memberIDs: [],
    contributors: [],
    transactions: [],
    admin: {id: -1, email: '', firstName: '', lastName: ''},
    settings: {
      buyInEnabled: false,
      expired: false,
      minBuyIn: 0,
      maxBuyIn: 0,
      denominations: [],
      denominationColors: []
    }
};

const BLUE_COLOR_GROUP = { name: 'BLUE',      shades: ['#0000FF', '#ADD8E6', '#87CEEB', '#4682B4', '#000080'] };
const WHITE_COLOR_GROUP = { name: 'WHITE',    shades: ['#FFFFFF', '#F5F5F5', '#E8E8E8', '#DCDCDC', '#D0D0D0'] };
const RED_COLOR_GROUP = { name: 'RED',        shades: ['#FF0000', '#FFCCCC', '#FF6666', '#CC0000', '#800000'] };
const GREEN_COLOR_GROUP = { name: 'GREEN',    shades: ['#008000', '#CCFFCC', '#66CC66', '#009933', '#006600'] };
const BLACK_COLOR_GROUP = { name: 'BLACK',    shades: ['#000000', '#202020', '#404040', '#606060', '#808080'] };
const ORANGE_COLOR_GROUP = { name: 'ORANGE',  shades: ['#FFA500', '#FFE5CC', '#FFCC99', '#FF9933', '#CC6600'] };
const PURPLE_COLOR_GROUP = { name: 'PURPLE',  shades: ['#800080', '#E6CCFF', '#CC99FF', '#9933FF', '#6600CC'] };
const PINK_COLOR_GROUP = { name: 'PINK',      shades: ['#FFC0CB', '#FFCCFF', '#FF99FF', '#FF66FF', '#CC00CC'] };
const YELLOW_COLOR_GROUP = { name: 'YELLOW',  shades: ['#FFFF00', '#FFFFCC', '#FFFF99', '#FFFF66', '#CCCC00'] };
const BROWN_COLOR_GROUP = { name: 'BROWN',    shades: ['#A52A2A', '#E6D3C3', '#B3866F', '#8C5E4A', '#663D30'] };

export const COLOR_GROUPS = [
  BLUE_COLOR_GROUP,
  WHITE_COLOR_GROUP,
  RED_COLOR_GROUP,
  GREEN_COLOR_GROUP,
  BLACK_COLOR_GROUP,
  ORANGE_COLOR_GROUP,
  PURPLE_COLOR_GROUP,
  PINK_COLOR_GROUP,
  YELLOW_COLOR_GROUP,
  BROWN_COLOR_GROUP
];

export const DEFAULT_DENOMINATION_COLORS: string[] = [
  WHITE_COLOR_GROUP.shades[0],
  RED_COLOR_GROUP.shades[0],
  GREEN_COLOR_GROUP.shades[0],
  BLACK_COLOR_GROUP.shades[0],
  BLUE_COLOR_GROUP.shades[0],
  PURPLE_COLOR_GROUP.shades[0],
  ORANGE_COLOR_GROUP.shades[0],
  PINK_COLOR_GROUP.shades[0],
  YELLOW_COLOR_GROUP.shades[0],
  BROWN_COLOR_GROUP.shades[0]
];
