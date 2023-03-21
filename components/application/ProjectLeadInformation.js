import Input from "../Input";
import Form from "../Form";
import GithubIcon from "../../public/images/github.svg";
import Container from "../Container";
import Checkbox from "../Checkbox";
import TextArea from "../TextArea";

const ProjectLeadInformation = () => {
  return (
    <Form
      title="Grant Lead Information"
      description="Tell us a bit about any other support you’ve received within the Stacks ecosystem."
    >
      <Checkbox
        id="completedPreviousGrant"
        value="Stacks Foundation funded grant, residency, etc."
        label="I have previously completed - or - I am currenly working on another:"
        labelColor="rgba(255, 255, 255, 0.8)"
      />
      <div style={div}/>
      <Input
        name="previousGrant"
        label="GitHub Issue"
        labelColor="rgba(255, 255, 255, 0.24)"
        image={<GithubIcon />}
      />
      <Checkbox
        id="otherEcosystem"
        label="I have previously completed - or - I am currently enrolled in - or - I am accepted into:"
        value="Stacks Web3 Startup Lab and/or Stacks Accelerator."
        labelColor="rgba(255, 255, 255, 0.8)"
      />
      <TextArea
        name="otherEcosystemPrograms"
        label="Explain below which program and tell us about your project below."
        maxchar={300}
        height="100px"
      />
    </Form>
  );
};

const div = {
  height:"1px"
}

export default ProjectLeadInformation;
