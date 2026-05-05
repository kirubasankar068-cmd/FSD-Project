const [search, setSearch] = useState("");
const [category, setCategory] = useState("");
const [sortBy, setSortBy] = useState("");

const filteredJobs = jobs
  .filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) &&
    (category ? job.category === category : true)
  )
  .sort((a, b) => {
    if (sortBy === "salary") return b.salary - a.salary;
    if (sortBy === "latest") return b.id - a.id;
    return 0;
  });
