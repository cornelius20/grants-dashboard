import Input from "../Input";
import Form from "../Form";
import Container from "../Container";

const ProjectInformation = () => {
  return (
    <Form
      title="Grant Information"
      description="Tell us some basics about your project."
    >
      <Input
        name="projectTitle"
        label="Grant Name"
        maxchar={30}
        description="Name your Grant so that it clearly communicates your objectives to others, during review and in the future."
        labelFontSize="18px"
      />
      <Container>
        <Input
          name="projectBudget"
          label="Total Budget"
          description="Provide the total budget in $USD to complete your project."
          isNumber={true}
          labelFontSize="18px"
        />
        <Input
          name="projectDuration"
          label="Total Duration"
          description="Provide the total amount of hours required to complete your project. Include all members if this is a team project."
          isNumber={true}
          labelFontSize="18px"
        />
      </Container>
      <Input
        name="projectTeam"
        label="Grant Team Members"
        description="Provide the GitHub usernames of any Grant Team Members. Comma separate all names."
        labelFontSize="18px"
      />
    </Form>
  );
};

export default ProjectInformation;
