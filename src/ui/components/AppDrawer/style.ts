import { cssRule } from 'typestyle';

export const host: string = `#sn-app-drawer`;

cssRule(
  host,
  {
    position: `fixed`,
    top: `-120px`,
    right: 0,
    bottom: `-120px`,
    left: 0,
    visibility: `hidden`,
    transitionProperty: `visibility`,
  }
);

export const opened: string = `.opened`;

cssRule(
  `${host}${opened}`,
  {
    visibility: `visible`,
  }
);

export const persistent: string = `.persistent`;

cssRule(
  `${host}${persistent}`,
  {
    width: `256px`,
  }
);

export const content: string = `#sn-app-drawer-content`;

cssRule(
  content,
  {
    position: `absolute`,
    top: 0,
    bottom: 0,
    left: 0,
    width: `256px`,
    padding: `120px 0`,
    transitionProperty: [
      `-webkit-transform`,
      `transform`,
    ],
    '-webkit-transform': `translate3d(-100%, 0, 0)`,
    transform: `translate3d(-100%, 0, 0)`,
    backgroundColor: `#fff`,
  }
);

export const swipeOpen: string = `.swipeOpen`;

cssRule(
  `${host}${swipeOpen} > ${content}::after`,
  {
    position: `fixed`,
    top: 0,
    bottom: 0,
    left: 0,
    visibility: `visible`,
    width: `20px`,
    content: `""`,
  }
);

cssRule(
  `${host}${opened} > ${content}`,
  {
    '-webkit-transform': `translate3d(0, 0, 0)`,
    transform: `translate3d(0, 0, 0)`,
  }
);

export const scrim: string = `#sn-app-drawer-scrim`;

cssRule(
  scrim,
  {
    position: `absolute`,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    transitionProperty: `opacity`,
    '-webkit-transform': `translateZ(0)`,
    transform: `translateZ(0)`,
    opacity: 0,
    background: `rgba(0, 0, 0, 0.5)`,
  }
);

cssRule(
  `${host}${opened} > ${scrim}`,
  {
    opacity: 1,
  }
);

cssRule(
  `${host}${opened}${persistent} > ${scrim}`,
  {
    visibility: `hidden`,
    opacity: 0,
  }
);
