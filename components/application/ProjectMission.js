import Form from "../Form";
import TextArea from "../TextArea";

const ProjectMission = () => {
  return (
    <Form
      title="Grant Mission Statement"
      description="Emphasize what new & novel technology your grant will unlock and how the Bitcoin and Stacks communities will benefit from the project."
    >
      <TextArea name="projectMission" maxchar={1500} height="500px" />
    </Form>
  );
};

export default ProjectMission;
