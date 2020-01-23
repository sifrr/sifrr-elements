import { css } from '@sifrr/template';

export default css`
  :host {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      ${el => el.getBgColor()} 4%,
      ${el => el.getFgColor()} 25%,
      ${el => el.getBgColor()} 45%
    );
    display: inline-block;
    animation: shimmer 2.5s linear 0s infinite;
    background-size: 2000px 100%;
  }
  @keyframes shimmer {
    0% {
      background-position: -2000px 0;
    }
    100% {
      background-position: 2000px 0;
    }
  }
`;
