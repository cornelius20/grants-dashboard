import styles from "./Application.module.css";
import Nav from "../components/application/layout/Nav";
import Steps from "../components/application/layout/Steps";
import StacksLogo from "../public/images/stacks-logo.svg";
import Checkmark from "../public/images/checkmark.svg";
import ProjectImpact from "../components/application/ProjectImpact";
import ProjectLinks from "../components/application/ProjectLinks";
import ApplicationType from "../components/application/ApplicationType";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { isValidURL } from "../components/Input";

import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import ProjectInformation from "../components/application/ProjectInformation";
import ProjectFundingStream from "../components/application/ProjectFundingStream";
import ProjectTrack from "../components/application/ProjectTrack";
import ProjectTags from "../components/application/ProjectTags";
import ProjectRoadmap from "../components/application/ProjectRoadmap";
import ProjectMission from "../components/application/ProjectMission";
import ProjectRevisionsOne from "../components/application/ProjectRevisionsOne";
import ProjectRevisionsTwo from "../components/application/ProjectRevisionsTwo";
import ApplicantInformation from "../components/application/ApplicantInformation";
import { useSession, signOut } from "next-auth/react";
import { generateTemplate } from "../components/application/layout/markdownTemplates/IssueTemplate";
import Modal from "../components/Modal";
import { Octokit } from "@octokit/rest";
import ProjectLeadInformation from "../components/application/ProjectLeadInformation";
import ApplicationChecklist from "../components/application/ApplicationChecklist";
import WishlistIdea from "../components/application/WishlistIdea";
import ApplicantInformationB from "../components/application/ApplicantInformationB";
import GrantTrack from "../components/application/GrantTrack";
import GrantType from "../components/application/GrantType";
import PaymentTable from '../components/PaymentTable';
import CheckMark from '../public/images/checkmark.svg';

const Application = () => {
  const { data: session } = useSession();
  const [flow, setFlow] = useState();
  const [paymentModalVisible, setPaymentModalVisible] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [URL, setURL] = useState("");

  useEffect(() => {
    let formData = JSON.parse(localStorage.getItem("formData"));

    if (!formData) {
      localStorage.setItem("formData", JSON.stringify({}));
    }
    formData = JSON.parse(localStorage.getItem("formData"));
    if (typeof formData.agreedToChecklist == undefined)
      formData.agreedToChecklist = false;
    localStorage.setItem("formData", JSON.stringify(formData));

    async function refresh() {
      if (session) {
        const github = new Octokit({
          auth: session?.accessToken,
        });
        await github.request("GET /user");
      }
    }

    refresh();
  }, []);

  function getModal() {
    let modal;

    if (flow == "B") {
      modal = !error ? (
        <Modal
          title="Success"
          subParagraphOne="Your wishlist idea has been submitted.  "
          link={URL}
        />
      ) : (
        <Modal
          title="Oops"
          subParagraphOne="There seems to be an error with your submission"
          subParagraphTwo={error}
        />
      );
    } else {
      modal = !error ? (
        <Modal
          title="Success"
          subParagraphOne="Your application has been submitted."
          link={URL}
        />
      ) : (
        <Modal
          title="Oops"
          subParagraphOne="There seems to be an error with your submission"
          subParagraphTwo={error}
        />
      );
    }

    return modal;
  }

  const signOutTimeout = () => {
    setTimeout(() => {
      signOut();
    }, 10000);
  };

  function getApplicationType(applicationType) {
    switch (applicationType) {
      case "This is an application for a grant that I intend to complete myself or as part of a team.":
        applicationType = "Direct Application";
        break;
      case "This is just an idea I want to add to the Wishlist.":
        applicationType = "Wishlist Submission";
        break;
      case "This is an application I found on the list of approved Wishlist grants that I wish to complete.":
        applicationType = "Wishlist Request";
        break;
    }
    return applicationType;
  }

  async function submitApplication() {
    let formData = JSON.parse(localStorage.getItem("formData"));
    formData.applicationType = getApplicationType(formData.applicationType);

    let markdown = generateTemplate(flow, formData);

    const github = new Octokit({
      auth: session?.accessToken,
    });

    if (flow == "B") {
      // create GH discussion
      const query = `mutation {
        createDiscussion(input: {repositoryId: "MDEwOlJlcG9zaXRvcnkyOTIwMDk4MzE=", categoryId: "MDE4OkRpc2N1c3Npb25DYXRlZ29yeTI1NzYzMDg1", body: "${markdown}", title: "Wishlist Idea"}) {
          discussion {
            id
            url
          }
        }
      }`;
      try {
        let req = await fetch("https://api.github.com/graphql", {
          method: "POST",
          body: JSON.stringify({
            query,
          }),
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "GraphQL-Features": "discussion_api",
          },
        });

        if (req.status == 200) {
          let res = await req.json();

          setURL(res.data.createDiscussion.discussion.url);
          localStorage.setItem("formData", JSON.stringify({}));
          setError(null);
          signOutTimeout();
        } else {
          setError(
            "Please try resubmitting. If you're still having issues then please reach out to us at grants@stacks.org"
          );
          signOutTimeout();
        }
      } catch (err) {
        setError(
          "Please try resubmitting. If you're still having issues then please reach out to us at grants@stacks.org"
        );
        signOutTimeout();
      }
    } else {
      try {
        let req = await github.rest.issues.create({
          owner: process.env.NEXT_PUBLIC_REPO_OWNER,
          repo: process.env.NEXT_PUBLIC_REPO,
          title: formData.projectTitle,
          body: markdown,
        });

        let res = await req;

        setURL(res.data.html_url);

        if (res.status == 201) {
          setError(null);
          localStorage.setItem("formData", JSON.stringify({}));
          signOutTimeout();
        } else {
          setError(
            "Please try resubmitting. If you're still having issues then please reach out to us at grants@stacks.org"
          );
          signOutTimeout();
        }
      } catch (err) {
        setError(
          "Please try resubmitting. If you're still having issues then please reach out to us at grants@stacks.org"
        );
        signOutTimeout();
      }
    }

    setShowModal(true);
  }

  let invalidFields = [];

  let optionGroupsChecked = [];
  let optionGroupsValid = [];

  function validateField(field) {
    field.style.outlineColor = "#3182ce";
    field.style.borderColor = "#3182ce";
    invalidFields = invalidFields.filter((e) => e !== field.name);
  }

  function checkField(field) {
    console.log('Field is : - ',field)

    switch (field.type) {
      case "text":
      case "textarea":
      case "number":
        if (field.value == undefined || field.value == "") {
          field.style.outlineColor = "red";
          field.style.borderColor = "red";
          invalidFields.push(field.name);
        } else {
          switch (field.name) {
            case "wishlistGithub":
            case "referenceLink":
              if (!isValidURL(field.value)) {
                field.style.outlineColor = "red";
                field.style.borderColor = "red";
                invalidFields.push(field.name);
              } else {
                validateField(field);
              }
              break;
            default:
              validateField(field);
              return true;
              break;
          }
        }
        break;
      case "radio":
        if (!optionGroupsChecked.includes(field.name)) {
          optionGroupsChecked.push(field.name);
        }
        if (!optionGroupsValid.includes(field.name)) {
          if (field.checked) {
            optionGroupsValid.push(field.name);
            validateField(field);
          }
        }
        break;
    }
    return false;
  }

  function handleSubmit(nextStepNumber) {
    let fields = Array.from(document.querySelectorAll("input, textarea"));
    let allChecked = false;

    fields.map((field) => {
      switch (field.name) {
        case "discordUsername":
        // case "email":
        case "twitterUsername":
        case "forumUsername":
        // case "projectTeam":
        case "referenceLink":
        case "referenceLinkDescription":
        case "budgetRevision":
        case "durationRevision":
        case "projectRevisions":
        case "githubUsername":
          break;
        case "wishlistGithub":
          let existingWishlist =
            document.getElementById("existingWishlist").checked;
          if (existingWishlist) {
            checkField(field);
            break;
          } else {
            validateField(field);
          }
          break;
        case "previousGrant":
          let previouslyCompletedGrant = document.getElementById(
            "completedPreviousGrant"
          ).checked;
          if (!previouslyCompletedGrant) {
            validateField(field);
            break;
          }
          checkField(field);
          break;
        case "otherEcosystemPrograms":
          let otherEcosystemPrograms =
            document.getElementById("otherEcosystem").checked;
          if (!otherEcosystemPrograms) {
            validateField(field);
            break;
          }
          checkField(field);
          break;
        case "projectTrack":
          const el = document.getElementsByName('projectTrack');
          el.forEach(item=>{
            if(item.checked){
              allChecked = true;
            }
          })
          break
          // console.log('EL',el);
          // allChecked = true;
        // case "guidelines":
        //   let guideline1 = document.getElementById("guideline1").checked;
        //   let guideline2 = document.getElementById("guideline2").checked;
        //   let guideline3 = document.getElementById("guideline3").checked;
        //   let guideline4 = document.getElementById("guideline4").checked;
        //   let guideline5 = document.getElementById("guideline5").checked;
        //   let guideline6 = document.getElementById("guideline6").checked;
        //   if (
        //     guideline1 &&
        //     guideline2 &&
        //     guideline3 &&
        //     guideline4 &&
        //     guideline5 &&
        //     guideline6
        //   ) {
        //     allChecked = true;
        //     break;
        //   }
        //   break;
        default:
          checkField(field);
          break;
      }
    });
    let optionsValid = optionGroupsChecked.length == optionGroupsValid.length;
    optionsValid ? null : invalidFields.push(optionGroupsChecked[0]);

    let formData = JSON.parse(localStorage.getItem("formData"));

    let isValid = false;

    function nextPage() {
      //validation
      if (invalidFields.length == 0) {
        isValid = true;
        if (currentStep > 1 && currentStep == navSteps().length) {
        } else {
          setCurrentStep(nextStepNumber);
        }
        fields.map((field) => {
          let { name, value, type } = field;

          switch (type) {
            case "text":
            case "textarea":
            case "number":
              formData[name] = value;
              break;
            case "radio":
              if (field.checked) {
                formData[name] = value;
              }
          }
          localStorage.setItem("formData", JSON.stringify(formData));
        });

        if (currentStep == 1) {
          switch (formData.applicationType) {
            case "This is an application for a grant that I intend to complete myself or as part of a team.":
              setFlow("A");
              break;
            case "This is just an idea I want to add to the Wishlist.":
              setFlow("B");
              break;
            case "This is an application I found on the list of approved Wishlist grants that I wish to complete.":
              setFlow("C");
              break;
          }
        }
      }
    }

    function getNumberOfMilestones(budget) {
      if (budget < 10e3) {
        return 0;
      } else if (budget < 25e3) {
        return 1;
      } else if (budget < 60e3) {
        return 2;
      } else if (budget < 100e3) {
        return 3;
      } else if (budget < 150e3) {
        return 4;
      } else if (budget < 250e3) {
        return 6;
      } else {
        return 8;
      }
    }

    let currentMilestone = formData.currentMilestone;

    if (flow == "A" && currentStep == "4") {
      formData.agreedToChecklist = allChecked;
      localStorage.setItem("formData", JSON.stringify(formData));
      if (allChecked) {
        setCurrentStep(nextStepNumber);
        isValid = true;
      }
    } else if (
      flow == "A" &&
      currentStep == "9" &&
      getNumberOfMilestones(formData.projectBudget) > 0
    ) {
      if (currentMilestone == getNumberOfMilestones(formData.projectBudget)) {
        let milestoneDeliverable = Array.from(
          document.getElementsByName(
            "milestone" + currentMilestone.toString() + "Deliverable"
          )
        )[0];

        if (checkField(milestoneDeliverable)) nextPage();
        isValid = true;
      }
    } else {
      nextPage();
    }

    return isValid;
  }

  const flowDefaultSteps = ["Application Type"];

  const FlowDefault = () => {
    switch (currentStep) {
      case 1:
        return <ApplicationType />;
    }
  };

  const flowASteps = [
    "Applicant Information",
    "Grant Lead Information",
    "Grant Type",
    "Grant Track",
    "Grant Tags",
    "Grant Information",
    "Grant Roadmap",
    "Grant Mission Statement",
    "Grant Impact & Risks",
    "Support Links",
  ];

  const FlowA = () => {
    switch (currentStep) {
      case 1:
        return <ApplicantInformation />;
      case 2:
        return <ProjectLeadInformation />;
      case 3:
        return <GrantType />;
      case 4:
        return <GrantTrack />;
      case 5:
        return <ProjectTags />;
      case 6:
        return <ProjectInformation />;
      case 7:
        return <ProjectRoadmap visibleModal={visibleModal}/>;
      case 8:
        return <ProjectMission />;
      case 9:
        return <ProjectImpact />;
      case 10:
        return <ProjectLinks />;
    }
  };

  const flowBSteps = [
    "Application Type",
    "Applicant Information",
    "Wishlist Idea",
  ];

  const FlowB = () => {
    switch (currentStep) {
      case 1:
        return <ApplicationType />;
      case 2:
        return <ApplicantInformationB />;
      case 3:
        return <WishlistIdea />;
    }
  };

  const flowCSteps = [
    "Application Type",
    "Applicant Information",
    "Grant Lead Information",
    "Grant Revisions (1 of 2)",
    "Grant Revisions (2 of 2)",
  ];

  const FlowC = () => {
    switch (currentStep) {
      case 1:
        return <ApplicationType />;
      case 2:
        return <ApplicantInformation />;
      case 3:
        return <ProjectLeadInformation />;
      case 4:
        return <ProjectRevisionsOne />;
      case 5:
        return <ProjectRevisionsTwo />;
    }
  };

  const navSteps = () => {
    switch (flow) {
      case "A":
        return flowASteps;
      case "B":
        return flowBSteps;
      case "C":
        return flowCSteps;
      default:
        return flowASteps;
    }
  };

  const CurrentStep = () => {
    switch (flow) {
      case "A":
        return <FlowA />;
      case "B":
        return <FlowB />;
      case "C":
        return <FlowC />;
      default:
        return <FlowA />;
    }
  };

  const visibleModal = () => {
    setPaymentModalVisible(true);
  }

  const closeModal = () => {
    setPaymentModalVisible(false);
  }

  return (
    <div>
      <PaymentTable isVisible={paymentModalVisible} closeModal={closeModal} />
      <div
        className={
          !showModal ? styles.applicationWrapper : styles.applicationWrapperBlur
        }
      >
        <Nav
          name={"Application Progress"}
          step={currentStep}
          totalSteps={navSteps().length}
        />
        <div className={styles.mainComponents}>
          <div id="step">
            <Steps
              handleSubmit={handleSubmit}
              step={currentStep}
              steps={navSteps()}
              setCurrentStep={setCurrentStep}
            />
          </div>
          <div className={styles.middleComponent}>
            <AnimatePresence exitBeforeEnter initial={false}>
              {CurrentStep()}
            </AnimatePresence>
            <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center'}}>
              <button className={styles.prevBtn} onClick={()=>{if(currentStep > 1) setCurrentStep(currentStep - 1)}}>Previous Step</button>
              <div style={{padding: 1,background: 'linear-gradient(45deg, #3182CE, #FFFFFF)',borderRadius: 5}}>
                {/* <button className={styles.nextBtn}><CheckMark/> Next Step</button> */}
                {currentStep > 1 && currentStep == navSteps().length ? (
                  <button
                    className={styles.nextBtn}
                    onClick={() => {
                      if (handleSubmit()) submitApplication();
                    }}
                    name="okButton"
                  >
                    <Checkmark />
                    Submit Application
                  </button>
                ) : (
                  <button
                    className={styles.nextBtn}
                    onClick={() => handleSubmit(currentStep + 1)}
                    name="okButton"
                  >
                    <Checkmark />
                    Next Step
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className={styles.navButtonWrapper}>
            <div style={{visibility: 'hidden'}} className={styles.button}>
              {currentStep > 1 && currentStep == navSteps().length ? (
                <button
                  onClick={() => {
                    if (handleSubmit()) submitApplication();
                  }}
                  name="okButton"
                >
                  <p>Submit Application</p>
                </button>
              ) : (
                <button
                  onClick={() => handleSubmit(currentStep + 1)}
                  name="okButton"
                >
                  <Checkmark />
                  <p>Ok</p>
                </button>
              )}
            </div>
            {flow === "A" && currentStep === 2 ? (
              <Modal
                title="Important"
                subParagraphTwo="It's not required to complete all fields on this page, but doing so will significantly increase your odds of having your application approved."
              />
            ) : (
              <></>
            )}
          </div>
        </div>

        <StacksLogo className={styles.stacksSVG} />
      </div>
      {showModal && getModal()}
    </div>
  );
};

export default Application;

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  session.user.email = "";
  return {
    props: {
      session,
    },
  };
}

