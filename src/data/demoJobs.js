const companies = [
  ['Northstar Labs', 'NL', '#e6efff', '#3159bd'],
  ['Orbit Digital', 'OD', '#fce9dd', '#b75c2c'],
  ['Bloom Health', 'BH', '#dcf5e9', '#21835c'],
  ['Pixel & Co.', 'P', '#f2e7ff', '#7b42b5'],
  ['Summit Finance', 'SF', '#fff1c9', '#8b6b13'],
  ['Cloudline', 'C', '#dff5f7', '#147a87']
]
const roles = [
  ['Frontend React Developer', 'Technology', 'Full-time', 'Remote', 'Mid-level', '$2,000–$3,500 / month'],
  ['UI/UX Product Designer', 'Design', 'Full-time', 'Karachi, Pakistan', 'Mid-level', '$1,200–$2,000 / month'],
  ['Junior Web Developer', 'Technology', 'Internship', 'Lahore, Pakistan', 'Entry level', '$400–$700 / month'],
  ['Digital Marketing Specialist', 'Marketing', 'Contract', 'Remote', 'Mid-level', '$900–$1,500 / month'],
  ['Data Analyst', 'Data & Analytics', 'Full-time', 'Islamabad, Pakistan', 'Mid-level', '$1,500–$2,400 / month'],
  ['Backend Engineer (Node.js)', 'Technology', 'Full-time', 'Remote', 'Senior', '$3,000–$4,500 / month'],
  ['Customer Success Associate', 'Customer Support', 'Part-time', 'Karachi, Pakistan', 'Entry level', '$500–$850 / month'],
  ['Graphic Designer', 'Design', 'Contract', 'Remote', 'Entry level', '$700–$1,100 / month'],
  ['QA Automation Engineer', 'Technology', 'Full-time', 'Lahore, Pakistan', 'Senior', '$2,000–$3,200 / month'],
  ['HR & Talent Coordinator', 'Human Resources', 'Full-time', 'Islamabad, Pakistan', 'Mid-level', '$800–$1,300 / month'],
  ['Business Intelligence Analyst', 'Data & Analytics', 'Full-time', 'Remote', 'Senior', '$2,200–$3,600 / month'],
  ['Social Media Executive', 'Marketing', 'Internship', 'Karachi, Pakistan', 'Entry level', '$300–$500 / month'],
  ['Mobile App Developer', 'Technology', 'Contract', 'Remote', 'Mid-level', '$1,800–$3,000 / month'],
  ['Operations Coordinator', 'Operations', 'Full-time', 'Lahore, Pakistan', 'Mid-level', '$750–$1,200 / month'],
  ['Content Writer', 'Marketing', 'Part-time', 'Remote', 'Entry level', '$450–$800 / month'],
  ['Product Designer', 'Design', 'Full-time', 'Islamabad, Pakistan', 'Senior', '$1,700–$2,800 / month'],
  ['Python Developer', 'Technology', 'Full-time', 'Remote', 'Mid-level', '$2,000–$3,500 / month'],
  ['Finance Assistant', 'Finance', 'Full-time', 'Karachi, Pakistan', 'Entry level', '$600–$950 / month'],
  ['SEO Specialist', 'Marketing', 'Contract', 'Remote', 'Mid-level', '$800–$1,400 / month'],
  ['IT Support Technician', 'Customer Support', 'Full-time', 'Lahore, Pakistan', 'Entry level', '$500–$900 / month'],
  ['Cloud Engineer', 'Technology', 'Full-time', 'Remote', 'Senior', '$3,200–$5,000 / month'],
  ['Research Analyst', 'Data & Analytics', 'Internship', 'Islamabad, Pakistan', 'Entry level', '$400–$650 / month'],
  ['Recruitment Specialist', 'Human Resources', 'Part-time', 'Remote', 'Mid-level', '$700–$1,100 / month'],
  ['Project Coordinator', 'Operations', 'Full-time', 'Karachi, Pakistan', 'Mid-level', '$900–$1,500 / month']
]
export const demoJobs = roles.map((role, i) => {
  const company = companies[i % companies.length]
  return {
    id: `demo-${i + 1}`, title: role[0], category: role[1], jobType: role[2],
    location: role[3], level: role[4], salary: role[5], company: company[0],
    initials: company[1], logoBg: company[2], logoColor: company[3],
    posted: ['2 days ago', '3 days ago', '1 week ago', 'Yesterday'][i % 4],
    description: `${role[0]} at ${company[0]}. We're looking for a curious, collaborative person who enjoys solving real problems and building thoughtful experiences. You'll work with a supportive team, contribute to meaningful projects, and have room to grow.`,
    responsibilities: ['Collaborate with teammates and stakeholders to deliver high-quality work.', 'Break down requirements into clear, manageable tasks.', 'Communicate progress, share ideas, and continuously improve.', 'Write maintainable work and document important decisions.'],
    requirements: ['Relevant experience, education, or a strong portfolio of work.', 'Good communication and problem-solving skills.', 'Ability to learn quickly and work independently when needed.', 'Attention to detail and a collaborative mindset.'],
    tags: [role[1], role[4], role[2]]
  }
})