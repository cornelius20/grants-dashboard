import styles from "./Nav.module.css";
import CloseIcon from "../../../public/images/close.svg";
import Link from "next/link";

const Nav = (props) => {
  let { step, totalSteps } = props;
  return (
    <div className={styles.layoutWrapper}>
      <div>
        <div
          className={styles.progressBar}
          style={{ width: `${step == 1 ? "220" : totalSteps * 20}px` }}
        >
          <span
            style={{
              background: "linear-gradient(45deg, #3281cd, #96286f)",
              width: `${step == 1 ? 10 : (step * 100) / totalSteps}%`,
              height: "100%",
              display: "block",
            }}
          ></span>
        </div>
        <p>{props.name}</p>
      </div>
      <Link href="/">
        <div className={styles.close}>
            <p>
              <CloseIcon />
              <span style={{color: '#fff',cursor: 'pointer'}}>Back</span>
            </p>
          <span style={bar}></span>
        </div>
      </Link>
    </div>
  );
};

export default Nav;


const wrapper = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  paddingRight: 26,
  paddingTop: 38,
  position: 'relative'
}


const bar = {
  height: 2,
  width: 30,
  borderRadius: 3,
  // marginBottom: 20,
  backgroundColor: '#fff'
}