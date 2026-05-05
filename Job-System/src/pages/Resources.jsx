import { useState } from 'react';
import Layout from '../components/Layout';
import { useAppContext } from '../context/AppContext';
import {
  BookOpen, Video, FileText, Star, Download,
  GraduationCap, ExternalLink, Filter, Clock, Users
} from 'lucide-react';

/* ─── Resource / Course Generator ────────────────────────────────────────── */
const generateResources = (count) => {
  const generated = [];
  const subjects = ['React', 'Python', 'Machine Learning', 'Data Science', 'UI/UX Design', 'Cloud Computing', 'Cybersecurity', 'DevOps', 'Blockchain', 'System Architecture', 'Node.js', 'Go Lang', 'Project Management', 'Cloud Native', 'Salary Negotiation', 'Leadership'];
  const authors = ['Tech Academy', 'JobGrox Editorial', 'Code Masters', 'Data Insights', 'Web Warriors', 'Cloud Institute', 'Global Tech Learning'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  const categories = ['Course', 'Course', 'Guide', 'Guide', 'Video', 'Video', 'Template']; // Weighted for variety

  for (let i = 1; i <= count; i++) {
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];
    const level = levels[Math.floor(Math.random() * levels.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    let title, description, duration;
    
    if (category === 'Course') {
      title = `${subject} Masterclass: Enterprise Certification (${i})`;
      description = `High-fidelity training protocol covering end-to-end ${subject} applications. Designed for elite network synchronization.`;
      duration = `${Math.floor(Math.random() * 50) + 5} hrs`;
    } else if (category === 'Guide') {
      title = `The Definitive Guide to ${subject} in 2026 (${i})`;
      description = `An exhaustive cheat-sheet and best-practice manual for mastering ${subject} interviews and deployment.`;
      duration = `${Math.floor(Math.random() * 45) + 10} min read`;
    } else if (category === 'Video') {
      title = `${subject} Deep Dive - Zero to Architect (${i})`;
      description = `A comprehensive visual series breaking down the complex architecture and implementation of ${subject}.`;
      duration = `${Math.floor(Math.random() * 8) + 1} hr video`;
    } else if (category === 'Template') {
      title = `ATS-Optimized ${subject} Resume Asset (${i})`;
      description = `Plug-and-play template designed to pass algorithmic screening software for elite ${subject} positions.`;
      duration = `Instant download`;
    }

    const students = Math.floor(Math.random() * 900) + 10;
    
    generated.push({
      id: `gen-r${i}`,
      category: category,
      title: title,
      author: (category === 'Guide' || category === 'Template') ? 'JobGrox Editorial' : `${author} · Online`,
      description: description,
      url: '#',
      tags: [subject, category],
      duration: duration,
      students: category === 'Course' ? `${students}K+` : undefined,
      level: level,
    });
  }
  return generated;
};

/* ─── Resource / Course Data ─────────────────────────────────────────────── */
const ALL_ITEMS = [
  /* ── GUIDES ── */
  {
    id: 'r1', category: 'Guide',
    title: 'The Ultimate React Interview Guide 2026',
    author: 'JobGrox Editorial',
    description: 'Master hooks, patterns, and tricky interview questions asked at FAANG companies.',
    url: 'https://reactjs.org/docs/getting-started.html',
    tags: ['React', 'Interviews'],
    duration: '45 min read',
    level: 'Intermediate',
  },
  {
    id: 'r2', category: 'Guide',
    title: 'Negotiating Your Salary Like a Pro',
    author: 'Sarah Finance',
    description: 'Proven scripts and tactics to confidently negotiate a 20 – 40 % higher offer.',
    url: 'https://www.glassdoor.com/blog/guide/how-to-negotiate-your-salary/',
    tags: ['Career', 'Finance'],
    duration: '20 min read',
    level: 'All Levels',
  },
  {
    id: 'r3', category: 'Guide',
    title: 'JavaScript: The Definitive Cheat-Sheet',
    author: 'MDN Web Docs',
    description: 'Quick-reference for ES2024 features, array methods, async patterns & more.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
    tags: ['JavaScript', 'Reference'],
    duration: '30 min read',
    level: 'All Levels',
  },
  {
    id: 'r4', category: 'Guide',
    title: 'Cracking the Coding Interview: Patterns',
    author: 'AlgoExpert',
    description: 'The 14 most important algorithm patterns that solve 80 % of LeetCode problems.',
    url: 'https://www.algoexpert.io/questions',
    tags: ['DSA', 'Interviews'],
    duration: '1 hr read',
    level: 'Advanced',
  },

  /* ── VIDEOS ── */
  {
    id: 'v1', category: 'Video',
    title: 'System Design for Senior Engineers',
    author: 'TechLead',
    description: 'Deep-dive into designing scalable systems: caching, sharding, microservices.',
    url: 'https://www.youtube.com/results?search_query=system+design+interview',
    tags: ['System Design', 'Architecture'],
    duration: '3 hr series',
    level: 'Senior',
  },
  {
    id: 'v2', category: 'Video',
    title: 'Full-Stack React & Node.js – Zero to Hero',
    author: 'Traversy Media',
    description: 'Build a production-ready MERN app from scratch with JWT auth & REST API.',
    url: 'https://www.youtube.com/@TraversyMedia',
    tags: ['React', 'Node.js', 'MERN'],
    duration: '8 hr video',
    level: 'Beginner',
  },
  {
    id: 'v3', category: 'Video',
    title: 'TypeScript Full Course 2024',
    author: 'Fireship',
    description: 'Everything you need to know about TypeScript in one fast-paced video.',
    url: 'https://www.youtube.com/c/Fireship',
    tags: ['TypeScript', 'JavaScript'],
    duration: '1 hr video',
    level: 'Intermediate',
  },

  /* ── TEMPLATES ── */
  {
    id: 't1', category: 'Template',
    title: 'ATS-Friendly Standard Resume Template',
    author: 'JobGrox Careers',
    description: 'Clean single-column layout proven to pass automated screening software.',
    url: 'https://www.canva.com/resumes/templates/',
    tags: ['Resume', 'ATS'],
    duration: 'Instant download',
    level: 'All Levels',
  },
  {
    id: 't2', category: 'Template',
    title: 'Software Engineer Cover Letter Pack',
    author: 'JobGrox Editorial',
    description: '5 battle-tested templates for SDE, frontend, backend and full-stack roles.',
    url: 'https://www.overleaf.com/gallery/tagged/cv',
    tags: ['Cover Letter', 'Templates'],
    duration: 'Instant download',
    level: 'All Levels',
  },
  {
    id: 't3', category: 'Template',
    title: 'LinkedIn Profile Optimisation Checklist',
    author: 'Career Sidekick',
    description: 'Step-by-step checklist to make your profile show up in recruiter searches.',
    url: 'https://careersidekick.com/linkedin-profile-tips/',
    tags: ['LinkedIn', 'Branding'],
    duration: '10 min',
    level: 'All Levels',
  },

  /* ── COURSES ── */
  {
    id: 'c1', category: 'Course',
    title: 'The Complete JavaScript Course 2024',
    author: 'Jonas Schmedtmann · Udemy',
    description: 'From JS fundamentals to modern ES6+, async/await, and real-world projects.',
    url: 'https://www.udemy.com/course/the-complete-javascript-course/',
    tags: ['JavaScript', 'Web Dev'],
    duration: '69 hrs', students: '900K+',
    level: 'Beginner',
  },
  {
    id: 'c2', category: 'Course',
    title: 'React – The Complete Guide (Hooks, Redux)',
    author: 'Maximilian Schwarzmüller · Udemy',
    description: 'Master React 18, Hooks, Context, React Router, Redux & Next.js.',
    url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
    tags: ['React', 'Redux'],
    duration: '68 hrs', students: '750K+',
    level: 'Intermediate',
  },
  {
    id: 'c3', category: 'Course',
    title: 'CS50: Introduction to Computer Science',
    author: 'Harvard University · edX',
    description: "Harvard's legendary intro to CS — completely free. Covers C, Python, SQL, web.",
    url: 'https://cs50.harvard.edu/x/',
    tags: ['CS Fundamentals', 'Free'],
    duration: '12 weeks', students: '4M+',
    level: 'Beginner',
  },
  {
    id: 'c4', category: 'Course',
    title: 'Data Structures & Algorithms Bootcamp',
    author: 'Colt Steele · Udemy',
    description: 'Learn Big-O, sorting, trees, graphs, dynamic programming with JavaScript.',
    url: 'https://www.udemy.com/course/js-algorithms-and-data-structures-masterclass/',
    tags: ['DSA', 'JavaScript'],
    duration: '22 hrs', students: '500K+',
    level: 'Intermediate',
  },
  {
    id: 'c5', category: 'Course',
    title: 'Responsive Web Design Certification',
    author: 'freeCodeCamp',
    description: 'Learn HTML, CSS & modern layouts — 100 % free with a shareable certificate.',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
    tags: ['HTML', 'CSS', 'Free'],
    duration: '300 hrs', students: '10M+',
    level: 'Beginner',
  },
  {
    id: 'c6', category: 'Course',
    title: 'Python for Everybody Specialisation',
    author: 'University of Michigan · Coursera',
    description: 'Five-course path: variables, data structures, APIs, databases with Python.',
    url: 'https://www.coursera.org/specializations/python',
    tags: ['Python', 'Data'],
    duration: '8 months', students: '2M+',
    level: 'Beginner',
  },
  {
    id: 'c7', category: 'Course',
    title: 'Machine Learning Specialisation',
    author: 'Andrew Ng · Coursera',
    description: 'Gold standard ML course covering supervised, unsupervised & deep learning.',
    url: 'https://www.coursera.org/specializations/machine-learning-introduction',
    tags: ['ML', 'AI', 'Python'],
    duration: '3 months', students: '1.5M+',
    level: 'Intermediate',
  },
  {
    id: 'c8', category: 'Course',
    title: 'Node.js, Express, MongoDB & More',
    author: 'Jonas Schmedtmann · Udemy',
    description: 'Build a complete REST API with authentication, security & deployment.',
    url: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/',
    tags: ['Node.js', 'MongoDB', 'API'],
    duration: '42 hrs', students: '200K+',
    level: 'Intermediate',
  },
  {
    id: 'c9', category: 'Course',
    title: 'AWS Cloud Practitioner Essentials',
    author: 'Amazon · Coursera',
    description: 'Official AWS course to prepare for the CLF-C02 Cloud Practitioner exam.',
    url: 'https://www.coursera.org/learn/aws-cloud-practitioner-essentials',
    tags: ['AWS', 'Cloud', 'DevOps'],
    duration: '6 hrs', students: '500K+',
    level: 'Beginner',
  },
  {
    id: 'c10', category: 'Course',
    title: 'Full Stack Open 2024',
    author: 'University of Helsinki',
    description: 'Modern web dev with React, Redux, Node, MongoDB, GraphQL & TypeScript — free.',
    url: 'https://fullstackopen.com/en/',
    tags: ['React', 'Node.js', 'Free'],
    duration: 'Self-paced', students: '800K+',
    level: 'Intermediate',
  },
  ...generateResources(600)
];

/* ── helpers ─────────────────────────────────────────────────────────── */
const TABS = ['All', 'Course', 'Guide', 'Video', 'Template'];

const ICON = {
  Guide:    <FileText   size={20} />,
  Video:    <Video      size={20} />,
  Template: <Download   size={20} />,
  Course:   <GraduationCap size={20} />,
};

const LEVEL_COLOR = {
  Beginner:     'bg-emerald-50 text-emerald-700',
  Intermediate: 'bg-blue-50 text-blue-700',
  Advanced:     'bg-purple-50 text-purple-700',
  Senior:       'bg-rose-50 text-rose-700',
  'All Levels': 'bg-slate-100 text-slate-600',
};

const CAT_COLOR = {
  Guide:    'bg-amber-50  text-amber-700',
  Video:    'bg-rose-50   text-rose-700',
  Template: 'bg-violet-50 text-violet-700',
  Course:   'bg-cyan-50   text-cyan-700',
};

/* ── component ───────────────────────────────────────────────────────── */
export default function Resources() {
  const { toggleFavorite, isFavorite } = useAppContext();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch]       = useState('');

  const filtered = ALL_ITEMS.filter(item => {
    const matchTab    = activeTab === 'All' || item.category === activeTab;
    const matchSearch = !search || [item.title, item.author, ...(item.tags || [])].join(' ')
                          .toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const courses = filtered.filter(i => i.category === 'Course');
  const others  = filtered.filter(i => i.category !== 'Course');

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">

        {/* ── Header ── */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
            <BookOpen size={14} className="text-cyan-600" />
            <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-widest">Library</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Career Resources</h1>
          <p className="text-lg text-slate-500 font-medium">
            Elevate your professional trajectory with guides, courses &amp; premium assets.
          </p>

          {/* Search bar */}
          <div className="relative">
            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, author or tag…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-700 placeholder-slate-400"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  activeTab === t
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-cyan-400 hover:text-cyan-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </header>

        {/* ── Courses Section ── */}
        {(activeTab === 'All' || activeTab === 'Course') && courses.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap size={20} className="text-cyan-600" />
              <h2 className="text-2xl font-extrabold text-slate-800">Study Courses</h2>
              <span className="ml-1 text-xs font-bold bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">{courses.length}</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {courses.map(course => (
                <CourseCard
                  key={course.id}
                  item={course}
                  fav={isFavorite(course.id)}
                  onFav={() => toggleFavorite(course)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Other Resources Section ── */}
        {others.length > 0 && (
          <section className="space-y-4">
            {(activeTab === 'All') && (
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-slate-600" />
                <h2 className="text-2xl font-extrabold text-slate-800">Guides, Videos &amp; Templates</h2>
                <span className="ml-1 text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{others.length}</span>
              </div>
            )}
            <div className="grid gap-4">
              {others.map(res => (
                <ResourceRow
                  key={res.id}
                  item={res}
                  fav={isFavorite(res.id)}
                  onFav={() => toggleFavorite(res)}
                />
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-24 text-slate-400">
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">No resources match your search.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

/* ── CourseCard ─────────────────────────────────────────────────────── */
function CourseCard({ item, fav, onFav }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all group flex flex-col gap-4">

      <div className="flex items-start justify-between gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${CAT_COLOR[item.category]}`}>
          {ICON[item.category]}
        </div>
        <button
          onClick={onFav}
          className={`p-2 rounded-xl border transition-all ${fav ? 'bg-yellow-50 text-yellow-500 border-yellow-100' : 'bg-white text-slate-300 border-slate-200 hover:text-yellow-500'}`}
        >
          <Star size={16} className={fav ? 'fill-current' : ''} />
        </button>
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap gap-1.5 mb-1">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${CAT_COLOR[item.category]}`}>
            {item.category}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${LEVEL_COLOR[item.level]}`}>
            {item.level}
          </span>
        </div>
        <h3 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-cyan-700 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-slate-500 font-semibold">{item.author}</p>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">{item.description}</p>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1"><Clock size={12} />{item.duration}</span>
          {item.students && <span className="flex items-center gap-1"><Users size={12} />{item.students}</span>}
        </div>
        <div className="flex gap-1 flex-wrap">
          {(item.tags || []).slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold rounded-xl transition-colors"
      >
        Start Learning <ExternalLink size={14} />
      </a>
    </div>
  );
}

/* ── ResourceRow ────────────────────────────────────────────────────── */
function ResourceRow({ item, fav, onFav }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row gap-5 items-start md:items-center group">

      <div className={`w-14 h-14 flex items-center justify-center rounded-xl flex-shrink-0 ${CAT_COLOR[item.category]}`}>
        {ICON[item.category]}
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${CAT_COLOR[item.category]}`}>
            {item.category}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${LEVEL_COLOR[item.level]}`}>
            {item.level}
          </span>
          {(item.tags || []).map(tag => (
            <span key={tag} className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 leading-tight mt-1 group-hover:text-cyan-700 transition-colors">
          {item.title}
        </h3>
        <p className="text-sm font-semibold text-slate-500">By {item.author}</p>
        {item.description && <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>}
        <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium mt-1">
          <Clock size={11} />{item.duration}
        </span>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-200 transition-colors text-sm"
        >
          Access <ExternalLink size={13} />
        </a>
        <button
          onClick={onFav}
          className={`p-2.5 rounded-xl border transition-all ${fav ? 'bg-yellow-50 text-yellow-500 border-yellow-100' : 'bg-white text-slate-400 border-slate-200 hover:text-yellow-500'}`}
        >
          <Star size={18} className={fav ? 'fill-current' : ''} />
        </button>
      </div>
    </div>
  );
}
