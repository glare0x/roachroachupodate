import logo from "../Images/Roach-Rally-Banner.png";
import busd from "../Images/busd-logo.svg";
import redHamster from "../Images/Black Roach.png";
import yellowHamster from "../Images/Green Roach.png";
import greenHamster from "../Images/White Roach.png";
import blueHamster from "../Images/Purp Roach.png";
import user from "../Images/user.png";
export function Logo({ styles }) {
  return <img src={logo} style={{ ...styles }} className="image" />;
}
export function BUSD({ styles }) {
  return <img src={busd} style={{ ...styles }} className="image" />;
}
export function User({ styles }) {
  return <img src={user} style={{ ...styles }} className="image" />;
}
export function RedHamster({ styles }) {
  return (
    <img
      src={redHamster}
      style={{
        display: "block",
        width: "100px",
        height: "100px",
        backgroundImage: redHamster,
        ...styles,
      }}
      className="image"
    />
  );
}
export function YellowHamster({ styles }) {
  return (
    <img
      src={yellowHamster}
      style={{
        display: "block",
        width: "100px",
        height: "100px",
        backgroundImage: yellowHamster,
        ...styles,
      }}
      className="image"
    />
  );
}
export function BlueHamster({ styles }) {
  return (
    <img
      src={blueHamster}
      style={{
        display: "block",
        width: "100px",
        height: "100px",
        backgroundImage: blueHamster,
        ...styles,
      }}
      className="image"
    />
  );
}
export function GreenHamster({ styles }) {
  return (
    <img
      src={greenHamster}
      style={{
        display: "block",
        width: "100px",
        height: "100px",
        backgroundImage: greenHamster,
        ...styles,
      }}
      className="image"
    />
  );
}
