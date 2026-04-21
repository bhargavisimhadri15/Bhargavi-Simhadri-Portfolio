import React from 'react';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Contact from './Contact';
import AddProject from './AddProject';

const Home = ({ data }) => {
  const [projects, setProjects] = React.useState(data?.projects || []);

  const handleAddProject = (newProject) => {
    setProjects([newProject, ...projects]);
  };

  return (
    <main>
      <Hero profile={data?.profile} />
      <About summary={data?.profile?.summary} />
      <Skills skills={data?.skills} />
      <Experience experience={data?.experience} />
      <AddProject onProjectAdded={handleAddProject} />
      <Projects projects={projects} />
      <Contact />
    </main>
  );
};

export default Home;
