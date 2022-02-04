import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles({
  root: {
    margin: 10,
  },
});

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

const Search = ({ projectName, onSetProjectName }) => {
  return (
    <TextField
      id="standard-basic"
      margin="normal"
      label="Insert project name"
      variant="standard"
      value={projectName}
      onChange={(e) => onSetProjectName(e.target.value)}
    />
  );
};

const Status = ({ status, setStatus }) => {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={status}
          label="Age"
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value={"lost"}>lost</MenuItem>
          <MenuItem value={"won"}>won</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

const ProjectCard = ({ date, name, status }) => {
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
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [status, setStatus] = useState("");
  // const [sortedField, setSortedField] = useState<string>("");
  // let sortedProjects = [...projects];

  const classes = useStyles();

  const fixData = (data) => {
    let result = [];
    data.forEach((p) => {
      let newProject = { ...p };
      if (newProject.projectNamee) {
        newProject.projectName = newProject.projectNamee;
        delete newProject.projectNamee;
      } else if (newProject.projectName === "Hudson, Moore and Kub") {
        newProject.id = "2d02db26-f814-4d36-ad7c-8d374bc540d4";
      } else if (newProject.projectName === "Tom Company") {
        newProject.id = "2d02db26-f814-4d36-ad7c-8d374bc540d5";
        newProject.creationDate = "2019-01-05T13:59:59.424Z";
      }
      result.push(newProject);
    });
    return result;
  };

  const filterProjects = (projects, name) => {
    if (!name) {
      return projects;
    }
    return projects.filter((p) =>
      p.projectName.toLowerCase().startsWith(name.toLowerCase())
    );
  };

  const filterByStatus = (projects, status) => {
    if (!status) {
      return projects;
    }
    return projects.filter((p) => p.status === status);
  };

  // Specify that API is called once on page load
  useEffect(() => {
    const getProjects = async () => {
      const projectsFromServer = await fetchProjects();
      const data = projectsFromServer.data;
      const fixedData = fixData(data);
      setProjects(fixedData);
    };
    getProjects();
  }, []);

  // Fetch Projects
  const fetchProjects = async () => {
    const res = await fetch("http://localhost:3004/projects");
    const data = await res.json();
    console.log("data", data);
    return data;
  };

  function handleChange(sortedType) {
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
  let filteredProjects = filterProjects(projects, projectName);
  filteredProjects = filterByStatus(filteredProjects, status);
  // render App
  return (
    <div className="App">
      <Search projectName={projectName} onSetProjectName={setProjectName} />
      <Status status={status} setStatus={setStatus} />
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
        {filteredProjects.map((project) => (
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
