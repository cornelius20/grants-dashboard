import styles from "./ProjectRoadmap.module.css";
import ArrowLeft from "../../public/images/arrowLeft.svg";
import ArrowRight from "../../public/images/arrowRight.svg";
import Link from 'next/link';
import Input from "../Input";
import Form from "../Form";
import { useState, useEffect } from "react";

function validateMilestone(number) {
  let deliverable = Array.from(
    document.getElementsByName(`milestone${number}Deliverable`)
  )[0];

  let isDeliverableValid = isFieldValid(deliverable);

  if (isDeliverableValid) {
    return true;
  } else {
    return false;
  }
}

function isFieldValid(field) {
  if (field.value == undefined || field.value == "") {
    field.style.outlineColor = "red";
    field.style.borderColor = "red";
    return false;
  } else {
    field.style.outlineColor = "#3182ce";
    field.style.borderColor = "#3182ce";
    return true;
  }
}

const ProjectRoadmap = ({ visibleModal }) => {
  const [numOfMilestones, setNumOfMilestones] = useState();
  const [currentMilestone, setCurrentMilestone] = useState(1);

  useEffect(() => {
    let formData = JSON.parse(localStorage.getItem("formData"));
    let { projectBudget } = formData;

    let numMilestones = getNumberOfMilestones(projectBudget);
    formData.currentMilestone = currentMilestone;
    localStorage.setItem("formData", JSON.stringify(formData));

    setNumOfMilestones(numMilestones);
  }, [currentMilestone]);

  const Milestones = () => {
    let milestones = [];
    let nav = [];

    for (let i = 1; i <= numOfMilestones; i++) {
      nav.push(i);
    }
    const Milestone = (number) => {
      return (
        <div key={`milestone${number}`} className={styles.section}>
          <div>
            <p className={styles.deliverables}>Milestone Deliverables</p>

            <Input
              name={`milestone${number}Deliverable`}
              label={`Deliverable (Milestone ${currentMilestone} of ${numOfMilestones})`}
              labelSize="12px"
              maxchar={80}
            />
            <div className={styles.arrows}>
              <button
                onClick={() => {
                  if (currentMilestone > 1)
                    setCurrentMilestone(currentMilestone - 1);
                }}
              >
                <ArrowLeft />
              </button>
              <div className={styles.nav}>
                <ul>
                  {nav.map((i) => {
                    let style = {};

                    if (i == currentMilestone) {
                      style = { color: "#9F7AEA" };
                    }
                    if (i !== currentMilestone ) {
                      style = {
                        color: "rgba(255, 255, 255, 0.24)",
                      };
                    }

                    return (
                      <li
                        style={style}
                        // onClick={() => setCurrentMilestone(i)}
                        key={i}
                      >
                        {i}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <button
                onClick={() => {
                  if (
                    currentMilestone < numOfMilestones &&
                    validateMilestone(number)
                  )
                    setCurrentMilestone(currentMilestone + 1);
                }}
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      );
    };
    for (let i = 1; i <= numOfMilestones; i++) {
      milestones.push(Milestone(i));
    }
    return milestones;
  };

  function getNumberOfMilestones(budget) {
    if (budget < 0) {
      return 0;
    } else if (budget < 10000) {
      return 1;
    } else if (budget < 25000) {
      return 2;
    } else if (budget < 48000) {
      return 3;
    } else if (budget < 100000) {
      return 4;
    } else if (budget < 200000) {
      return 5;
    } else if (budget < 300000) {
      return 6;
    } else {
      return 7;
    }
  }

  return (
    <Form
      title="Grant Roadmap"
      description="Provide clear, concise, easy to review deliverables and acceptance criteria for progress payments."
    >
      <h1 className={styles.h1}>
        <button onClick={visibleModal} className={styles.purpleLink}>PAYMENT QUANTITY & SIZING TABLE</button>
      </h1>
      <div className={styles.final}>
        <Input
          name="finalDeliverable"
          label="Final Deliverable *"
          labelFontSize="18px"
          maxchar={80}
        />
      </div>
      <div className={styles.final}>
        <Input
          name="missionDeliverable"
          label="Mission Deliverable *"
          labelFontSize="18px"
          maxchar={80}
        />
      </div>

      {Milestones()[currentMilestone - 1]}
    </Form>
  );
};

export default ProjectRoadmap;
