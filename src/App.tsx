import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
interface ProjectItem {
  creationDate: any;
  projectName: any;
  id: any;
  status: string;
}

const useStyles = makeStyles({
  root: {
    margin: 10,
  },
});

interface CardProps {
  date: any;
  name: string;
  status: string;
}

const useCardStyles = makeStyles({
  root: {
    width: 350,
    margin: 10,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 10,
  },
});

const ProjectCard: React.FC<CardProps> = ({ date, name, status }) => {
  const classes = useCardStyles();
  const toDate = new Date(date);

  return (
    <Card className={classes.root} variant="outlined">
      <div>
        <Typography
          data-testid="date"
          className={classes.title}
          color="textSecondary"
        >
          {toDate.toUTCString()}
        </Typography>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
        <Typography style={{ color: "white", marginBottom: 10 }}>
          {status}
        </Typography>
      </div>
    </Card>
  );
};

function App() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  // const [sortedField, setSortedField] = useState<string>("");
  // let sortedProjects = [...projects];

  const classes = useStyles();

  const fixData = (data: any) => {
    let result: any = []
    data.forEach((p: any) => {
      let newProject = {...p}
      if (newProject.projectNamee) {
        newProject.projectName = newProject.projectNamee
        delete newProject.projectNamee
      } else if (newProject.projectName === "Hudson, Moore and Kub") {
        newProject.id = "2d02db26-f814-4d36-ad7c-8d374bc540d4"
      } else if (newProject.projectName === "Tom Company") {
        newProject.id = "2d02db26-f814-4d36-ad7c-8d374bc540d5"
        newProject.creationDate = "2019-01-05T13:59:59.424Z"
      }
      result.push(newProject)
    })
    return result;
  }

  // Specify that API is called once on page load
  useEffect(() => {
    const getProjects = async () => {
      const projectsFromServer = await fetchProjects();
      const data = projectsFromServer.data;
      const fixedData = fixData(data)
      setProjects(fixedData);
    };
    getProjects();
  }, []);

  // Fetch Projects
  const fetchProjects = async () => {
    const res = await fetch("http://localhost:3004/projects");
    const data = await res.json();
    console.log("data", data)
    return data;
  };

  function handleChange(sortedType: "earliest" | "latest") {
    const sorted = [...projects].sort((a, b) => {
      let date1 = new Date(a.creationDate);
      let date2 = new Date(b.creationDate);

      if (sortedType === "earliest") {
        return date1.getTime() - date2.getTime();
      } else if (sortedType === "latest") {
        return date2.getTime() - date1.getTime();
      } else {
        return 0;
      }
    });
    setProjects(sorted);
  }

  // render App
  return (
    <div className="App">
      <div className="buttons-menu">
        <Button
          className={classes.root}
          variant="contained"
          onClick={() => handleChange("earliest")}
          data-testid="earliest-button"
        >
          Earliest
        </Button>
        <Button
          className={classes.root}
          variant="contained"
          onClick={() => handleChange("latest")}
          data-testid="latest-button"
        >
          Latest
        </Button>
      </div>
      <div className="projects-content">
      {console.log(projects)}
        {projects.map((project) => (

          <ProjectCard
            key={project.id}
            date={project.creationDate}
            name={project.projectName}
            status={project.status}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
